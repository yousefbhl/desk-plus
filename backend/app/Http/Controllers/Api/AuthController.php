<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    /* ──────────────────────────────────────────────────────────────
     |  EMAIL / PASSWORD  (unchanged)
     ────────────────────────────────────────────────────────────── */

    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone'    => 'nullable|string|max:20',
            'role'     => 'nullable|in:customer,seller',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => $data['password'],
            'phone'    => $data['phone'] ?? null,
            'role'     => $data['role'] ?? 'customer',
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user'  => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials. Please try again.'],
            ]);
        }

        $user  = Auth::user();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user'  => new UserResource($user),
            'token' => $token,
        ]);
    }

    public function me(Request $request)
    {
        return new UserResource($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully.']);
    }

    /* ──────────────────────────────────────────────────────────────
     |  GOOGLE OAUTH
     ────────────────────────────────────────────────────────────── */

    /**
     * Step 1 — send the user to Google's account picker.
     * Frontend hits this URL directly (full page redirect).
     */
    public function googleRedirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    /**
     * Step 2 — Google sends the user back here with their profile.
     *
     * Three cases:
     *   A) email exists & already linked to Google  -> log in
     *   B) email exists but NO google_id (signed up via email) -> LINK accounts, log in
     *   C) brand new email -> create as role 'pending', send to choose-role screen
     */
    public function googleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Throwable $e) {
            // user cancelled or token exchange failed
            return redirect($this->frontend('/login?error=google_failed'));
        }

        $user = User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            // Cases A & B — existing account. Link Google id if not set yet.
            if (!$user->google_id) {
                $user->google_id = $googleUser->getId();
            }
            // fill avatar only if they don't already have one
            if (!$user->avatar && $googleUser->getAvatar()) {
                $user->avatar = $googleUser->getAvatar();
            }
            $user->save();

            $token = $user->createToken('auth-token')->plainTextToken;

            // already has a real role -> straight in
            return redirect($this->frontend("/oauth/callback?token={$token}"));
        }

        // Case C — new user. Create with a temporary 'pending' role.
        $user = User::create([
            'name'      => $googleUser->getName() ?: $googleUser->getNickname() ?: 'New User',
            'email'     => $googleUser->getEmail(),
            'google_id' => $googleUser->getId(),
            'avatar'    => $googleUser->getAvatar(),
            'password'  => null,                 // no password for Google users
            'role'      => 'pending',            // must choose customer / seller next
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        // send them to the role-choice screen
        return redirect($this->frontend("/choose-role?token={$token}"));
    }

    /**
     * Step 3 — a 'pending' user picks customer or seller.
     * Authenticated (token from step 2 is sent as Bearer).
     */
    public function setRole(Request $request)
    {
        $request->validate([
            'role' => 'required|in:customer,seller',
        ]);

        $user = $request->user();

        // only pending users may set their role through this endpoint
        if ($user->role !== 'pending') {
            return response()->json([
                'message' => 'Role is already set for this account.',
            ], 403);
        }

        $user->role = $request->role;
        $user->save();

        return response()->json([
            'user' => new UserResource($user),
        ]);
    }

    /* ──────────────────────────────────────────────────────────────
     |  helper
     ────────────────────────────────────────────────────────────── */

    private function frontend(string $path): string
    {
        return rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/') . $path;
    }
}