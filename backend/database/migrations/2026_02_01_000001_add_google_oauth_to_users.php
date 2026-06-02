<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds Google OAuth support to the users table.
 *
 *  - google_id : stores the Google account ID so we can link/recognise the account
 *  - password  : made nullable, because users who sign up with Google have no password
 *
 * NOTE: changing an existing column type (password -> nullable) requires doctrine/dbal
 * on Laravel < 11. On Laravel 11 native change() works out of the box. If you hit
 * "Unknown column type" run:  composer require doctrine/dbal
 */
return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('google_id')->nullable()->unique()->after('email');
            $table->string('password')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('google_id');
            // revert password back to NOT NULL
            $table->string('password')->nullable(false)->change();
        });
    }
};
