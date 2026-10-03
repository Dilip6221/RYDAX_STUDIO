<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('otps', function (Blueprint $table) {
            $table->id();
            $table->string('phone')->index();
            $table->string('otp_hash');
            $table->integer('resend_count')->default(0);
            $table->integer('attempts')->default(0);
            $table->integer('max_attempts')->default(5);
            $table->boolean('is_used')->default(false);
            $table->timestamp('expires_at');
            $table->string('ip')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('otps');
    }
};
