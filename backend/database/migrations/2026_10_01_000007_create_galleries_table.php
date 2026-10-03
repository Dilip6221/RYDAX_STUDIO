<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('galleries', function (Blueprint $table) {
            $table->id();
            $table->string('service')->index();
            $table->enum('type', ['SINGLE', 'BEFORE_AFTER'])->default('SINGLE')->index();
            $table->string('title')->nullable();
            $table->string('image_url')->nullable();
            $table->string('public_id')->nullable();
            $table->string('before_image_url')->nullable();
            $table->string('before_public_id')->nullable();
            $table->string('after_image_url')->nullable();
            $table->string('after_public_id')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('galleries');
    }
};
