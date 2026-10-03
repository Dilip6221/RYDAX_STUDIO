<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('job_code')->unique()->index();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('car_id')->constrained('user_cars')->onDelete('cascade');
            $table->enum('status', ['PENDING', 'PROGRESS', 'COMPLETED', 'DELIVERED', 'CANCELLED'])->default('PENDING')->index();
            $table->enum('current_stage', [
                'CHECK_IN',
                'INSPECTION',
                'WORK_STARTED',
                'PART_REPLACED',
                'QUALITY_CHECK',
                'READY',
                'DELIVERED'
            ])->default('CHECK_IN')->index();
            $table->integer('progress_percent')->default(0);
            $table->timestamp('check_in_time')->nullable();
            $table->timestamp('expected_delivery')->nullable();
            $table->json('timeline')->nullable();
            $table->text('customer_notes')->nullable();
            $table->json('reel_data')->nullable();
            $table->timestamps();
        });

        Schema::create('job_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained('service_jobs')->onDelete('cascade');
            $table->string('service_name');
            $table->decimal('price', 10, 2)->default(0);
            $table->string('status')->default('PENDING');
            $table->timestamps();
        });

        Schema::create('job_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained('service_jobs')->onDelete('cascade');
            $table->string('media_url');
            $table->string('public_id')->nullable();
            $table->enum('media_type', ['IMAGE', 'VIDEO'])->default('IMAGE');
            $table->string('stage')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_media');
        Schema::dropIfExists('job_services');
        Schema::dropIfExists('service_jobs');
    }
};
