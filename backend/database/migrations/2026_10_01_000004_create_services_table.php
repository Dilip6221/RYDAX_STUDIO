<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique()->index();
            $table->text('short_description');
            $table->longText('description');
            $table->string('image_url');
            $table->string('image_public_id')->nullable();
            $table->string('icon')->nullable();
            $table->string('category')->nullable()->index();
            $table->string('duration')->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE')->index();
            $table->json('interactive_sections')->nullable();
            $table->json('faqs')->nullable();
            $table->json('packages')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
