<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed Admin User
        User::updateOrCreate(
            ['phone' => '9313015917'],
            [
                'name' => 'RYDAX Studio Admin',
                'email' => 'admin@rydax.com',
                'role' => 'ADMIN',
                'is_profile_complete' => true,
                'status' => 'ACTIVE',
            ]
        );

        // Seed Luxury Services
        $services = [
            [
                'title' => 'Paint Protection Film (PPF)',
                'slug' => 'paint-protection-film-ppf',
                'short_description' => 'Self-healing aerospace grade aliphatic TPU shield defending against stone chips, debris, and road rashes.',
                'description' => 'Engineered for extreme durability, our 8.5 MIL aliphatic TPU Paint Protection Film delivers optical clarity, high-gloss hydrophobic top-coat, and instant scratch self-healing when exposed to heat or sun.',
                'image_url' => 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
                'icon' => 'bi-shield-shaded',
                'category' => 'Exterior Protection',
                'duration' => '2-3 Days',
                'status' => 'ACTIVE',
                'packages' => [
                    ['name' => 'Full Front Armor', 'price' => 45000, 'features' => ['Bumper, Bonnet, Fenders', 'Mirror Caps & Headlights', '5-Year Warranty']],
                    ['name' => 'Complete Vehicle Shield', 'price' => 125000, 'features' => ['All Painted Surfaces', 'Self-Healing Heat Activation', '10-Year Warranty']],
                ],
            ],
            [
                'title' => 'Ceramic Coating',
                'slug' => 'ceramic-coating',
                'short_description' => '9H+ aerospace grade nano-ceramic matrix delivering 115° hydrophobic water beading and mirror finish.',
                'description' => 'Permanent nano-ceramic bonding that chemically fuses with your clear coat. Resists UV oxidation, bird droppings, acid rain, and heavy contaminants with effortless maintenance.',
                'image_url' => 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
                'icon' => 'bi-droplet-half',
                'category' => 'Ceramic Matrix',
                'duration' => '1-2 Days',
                'status' => 'ACTIVE',
                'packages' => [
                    ['name' => '9H Pro Matrix (3 Years)', 'price' => 25000, 'features' => ['Multi-Stage Correction', 'Body + Glass Coating', '3-Year Certificate']],
                    ['name' => '10H Graphene Infused (5 Years)', 'price' => 45000, 'features' => ['Diamond Glass Shield', 'Alloy Wheels & Calipers', '5-Year Certificate']],
                ],
            ],
            [
                'title' => 'Paint Correction & Restoration',
                'slug' => 'paint-correction-restoration',
                'short_description' => 'Multi-stage rotary and DA polish eliminating 90%+ of swirl marks, spiderwebs, and hologram reflections.',
                'description' => 'True architectural paint correction using microscopic depth gauges and bespoke polishing compounds to reveal OEM depth and mirror clarity before any protection is applied.',
                'image_url' => 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=80',
                'icon' => 'bi-stars',
                'category' => 'Surface Polishing',
                'duration' => '1 Day',
                'status' => 'ACTIVE',
                'packages' => [
                    ['name' => 'Single Stage Gloss Enhancement', 'price' => 12000, 'features' => ['Swirl Reduction 60%', 'Jeweling Finish', 'Hydra Sealant']],
                    ['name' => 'Multi-Stage Deep Correction', 'price' => 22000, 'features' => ['Heavy Defect Removal 95%', 'Orange Peel Leveling', 'Panel Wipe Prep']],
                ],
            ],
            [
                'title' => 'Bespoke Interior Atelier',
                'slug' => 'bespoke-interior-atelier',
                'short_description' => 'Deep leather conditioning, steam decontamination, and hydrophobic fabric protection.',
                'description' => 'A complete spa transformation for your luxury cabin. PH-balanced leather nourishing, anti-bacterial ozone sterilization, and stain-repellent nano guards.',
                'image_url' => 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
                'icon' => 'bi-gem',
                'category' => 'Interior Spa',
                'duration' => '1 Day',
                'status' => 'ACTIVE',
                'packages' => [
                    ['name' => 'Executive Leather & Fabric Care', 'price' => 15000, 'features' => ['Steam Sanitization', 'Mat Deep Extraction', 'Matte Finish Dressing']],
                ],
            ],
        ];

        foreach ($services as $srv) {
            \App\Models\Service::updateOrCreate(['slug' => $srv['slug']], $srv);
        }

        // Seed Customer Reviews
        $reviews = [
            [
                'name' => 'Dr. Vikramaditya Rathore',
                'phone' => '9825011223',
                'rating' => 5.0,
                'review' => 'Got full body self-healing PPF installed on my Porsche Macan GTS. The optical clarity and precision wrapping around curves is sheer art. RYDAX is the gold standard.',
                'car_model' => 'Porsche Macan GTS',
                'is_verified' => true,
                'is_approved' => true,
                'is_featured' => true,
            ],
            [
                'name' => 'Ananya Patel',
                'phone' => '9879543210',
                'rating' => 5.0,
                'review' => 'The 10H Ceramic Coating on my BMW M4 has insane hydrophobic beading. Water slides off immediately like mercury. The customer live HUD updates were thrilling to watch!',
                'car_model' => 'BMW M4 Competition',
                'is_verified' => true,
                'is_approved' => true,
                'is_featured' => true,
            ],
            [
                'name' => 'Harshvardhan Shah',
                'phone' => '9898012345',
                'rating' => 5.0,
                'review' => 'Incredible attention to detail on the leather rejuvenation and multi-stage paint correction. My Mercedes AMG looks better than day one from the showroom floor.',
                'car_model' => 'Mercedes-AMG G63',
                'is_verified' => true,
                'is_approved' => true,
                'is_featured' => true,
            ],
        ];

        foreach ($reviews as $rev) {
            \App\Models\CustomerReview::updateOrCreate(['name' => $rev['name']], $rev);
        }

        // Seed Galleries
        $galleries = [
            [
                'service' => 'Paint Protection Film (PPF)',
                'type' => 'BEFORE_AFTER',
                'title' => 'Porsche 911 GT3 Full Body Stealth TPU',
                'before_image_url' => 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
                'after_image_url' => 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
                'description' => 'Complete edge-wrapped gloss-to-satin transformation with hydrophobic topcoat.',
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'service' => 'Ceramic Coating',
                'type' => 'SINGLE',
                'title' => 'Mercedes-Maybach S-Class 10H Ceramic Infusion',
                'image_url' => 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1000&q=80',
                'description' => 'Obsidian Black obsidian mirror reflection with 115 degree hydrophobic contact angle.',
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'service' => 'Paint Correction & Restoration',
                'type' => 'BEFORE_AFTER',
                'title' => 'BMW M8 Competition Deep Defect Removal',
                'before_image_url' => 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1000&q=80',
                'after_image_url' => 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
                'description' => 'Eliminated 98% of aggressive dealership buffer swirls and micro marring.',
                'is_featured' => true,
                'is_active' => true,
            ],
        ];

        foreach ($galleries as $gal) {
            \App\Models\Gallery::updateOrCreate(['title' => $gal['title']], $gal);
        }

        // Seed Car Companies & Models
        $companies = [
            'BMW' => ['M3 Competition', 'M4 Competition', 'M5 CS', 'M8 Gran Coupe', 'X5 M', 'X7', 'i7'],
            'Mercedes-Benz' => ['AMG G63', 'AMG GT Black Series', 'S-Class Maybach', 'C63 AMG', 'GLE Coupe'],
            'Porsche' => ['911 GT3 RS', '911 Turbo S', 'Taycan Turbo', 'Panamera GTS', 'Macan GTS', 'Cayenne Coupe'],
            'Audi' => ['RS6 Avant', 'RS7 Sportback', 'R8 V10 Performance', 'RSQ8', 'e-tron GT'],
            'Land Rover' => ['Range Rover SV', 'Defender 110 V8', 'Range Rover Sport', 'Velar'],
        ];

        foreach ($companies as $compName => $models) {
            $company = \App\Models\CarCompany::updateOrCreate(
                ['name' => $compName],
                ['status' => 'ACTIVE']
            );

            foreach ($models as $mName) {
                \App\Models\CarModel::updateOrCreate(
                    ['company_id' => $company->id, 'name' => $mName],
                    ['status' => 'ACTIVE']
                );
            }
        }
    }
}
