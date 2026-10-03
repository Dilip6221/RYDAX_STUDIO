<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('online_service_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->timestamps();
        });

        Schema::create('online_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('online_service_categories')->onDelete('set null');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable();
            $table->string('image_url')->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->timestamps();
        });

        Schema::create('online_service_packages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained('online_services')->onDelete('cascade');
            $table->string('name');
            $table->decimal('price', 10, 2);
            $table->string('duration')->nullable();
            $table->json('features')->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->timestamps();
        });

        Schema::create('online_service_addons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained('online_services')->onDelete('cascade');
            $table->string('name');
            $table->decimal('price', 10, 2);
            $table->text('description')->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->timestamps();
        });

        Schema::create('online_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained('online_service_categories')->onDelete('set null');
            $table->foreignId('service_id')->constrained('online_services')->onDelete('cascade');
            $table->foreignId('package_id')->constrained('online_service_packages')->onDelete('cascade');
            $table->json('addons')->nullable();
            $table->string('booking_date');
            $table->string('slot');
            $table->text('address');
            $table->string('city')->index();
            $table->decimal('total_amount', 10, 2);
            $table->enum('payment_status', ['PENDING', 'PAID', 'FAILED'])->default('PENDING');
            $table->enum('status', ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])->default('PENDING')->index();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('online_bookings');
        Schema::dropIfExists('online_service_addons');
        Schema::dropIfExists('online_service_packages');
        Schema::dropIfExists('online_services');
        Schema::dropIfExists('online_service_categories');
    }
};
