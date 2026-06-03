<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\PasswordResetCodeMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    /** How long a code stays valid (minutes). */
    private const CODE_TTL_MINUTES = 15;

    /* ──────────────────────────────────────────────────────────────
     |  STEP 1 — user submits email, we email them a 6-digit code
     ────────────────────────────────────────────────────────────── */
    public function sendCode(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $email = strtolower(trim($request->email));

        // Throttle: max 3 requests per email per 10 minutes (anti-spam)
        $key = 'pwreset:send:' . $email;
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'message' => "Too many requests. Try again in {$seconds} seconds.",
            ], 429);
        }
        RateLimiter::hit($key, 600); // 10 min decay

        $user = User::where('email', $email)->first();

        // Only actually send if the user exists AND has a password
        // (Google-only accounts have no password to reset).
        if ($user && $user->password !== null) {
            $code = (string) random_int(100000, 999999); // always 6 digits

            // Store HASHED code. We reuse Laravel's password_reset_tokens table:
            // email (pk) + token (we put the hashed code here) + created_at.
            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $email],
                [
                    'token'      => Hash::make($code),
                    'created_at' => now(),
                ]
            );

            try {
                Mail::to($email)->send(new PasswordResetCodeMail($code, self::CODE_TTL_MINUTES));
            } catch (\Throwable $e) {
                // don't leak mail errors to the client; log for yourself
                report($e);
            }
        }

        // IMPORTANT: identical response whether or not the email exists.
        // This prevents attackers from discovering which emails are registered.
        return response()->json([
            'message' => 'If an account exists for that email, a code has been sent.',
        ]);
    }

    /* ──────────────────────────────────────────────────────────────
     |  STEP 2 — user submits the code; we check it (don't consume yet)
     ────────────────────────────────────────────────────────────── */
    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code'  => 'required|string',
        ]);

        $email = strtolower(trim($request->email));

        if (!$this->codeIsValid($email, $request->code)) {
            return response()->json([
                'message' => 'Invalid or expired code.',
            ], 422);
        }

        return response()->json(['message' => 'Code verified.']);
    }

    /* ──────────────────────────────────────────────────────────────
     |  STEP 3 — user sets a new password; we verify code again,
     |           change the password for real, then delete the token
     ────────────────────────────────────────────────────────────── */
    public function reset(Request $request)
    {
        $request->validate([
            'email'                 => 'required|email',
            'code'                  => 'required|string',
            'password'              => 'required|string|min:8|confirmed',
        ]);

        $email = strtolower(trim($request->email));

        // Re-verify the code (someone could call this endpoint directly,
        // skipping step 2 — so we never trust that step 2 happened).
        if (!$this->codeIsValid($email, $request->code)) {
            return response()->json([
                'message' => 'Invalid or expired code.',
            ], 422);
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['message' => 'Invalid or expired code.'], 422);
        }

        // Change the password. ('password' is cast as 'hashed' in the User
        // model, so assigning the plain value hashes it automatically.)
        $user->password = $request->password;
        $user->save();

        // Burn the token so the code can't be reused.
        DB::table('password_reset_tokens')->where('email', $email)->delete();

        // Optional hardening: revoke existing login tokens so old sessions
        // can't keep using the account after a reset. Uncomment if wanted.
        // $user->tokens()->delete();

        return response()->json([
            'message' => 'Password updated successfully. You can now sign in.',
        ]);
    }

    /* ──────────────────────────────────────────────────────────────
     |  helper — is this code correct AND still within the TTL?
     ────────────────────────────────────────────────────────────── */
    private function codeIsValid(string $email, string $code): bool
    {
        $row = DB::table('password_reset_tokens')->where('email', $email)->first();
        if (!$row) {
            return false;
        }

        // expired?
        if (Carbon::parse($row->created_at)->addMinutes(self::CODE_TTL_MINUTES)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            return false;
        }

        // matches the hashed code?
        return Hash::check($code, $row->token);
    }
}
