<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->json('services')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['NEW', 'CONTACTED', 'IN_PROGRESS', 'RESOLVED'])->default('NEW')->index();
            $table->timestamps();
        });

        Schema::create('customer_reviews', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->decimal('rating', 2, 1)->default(5.0);
            $table->text('review');
            $table->string('car_model')->nullable();
            $table->boolean('is_verified')->default(true);
            $table->boolean('is_approved')->default(true)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->timestamps();
        });

        Schema::create('about_timelines', function (Blueprint $table) {
            $table->id();
            $table->string('year');
            $table->string('title');
            $table->text('description');
            $table->string('image_url')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        Schema::create('subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->enum('status', ['SUBSCRIBED', 'UNSUBSCRIBED'])->default('SUBSCRIBED');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscribers');
        Schema::dropIfExists('about_timelines');
        Schema::dropIfExists('customer_reviews');
        Schema::dropIfExists('inquiries');
    }
};
