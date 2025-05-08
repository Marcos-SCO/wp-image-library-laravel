<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'recruiter@test.com'],
            ['name' => 'Recruiter', 'password' => Hash::make(env('USER_SEEDER_PASSWORD', 'password'))]
        );
        
        User::firstOrCreate(
            ['email' => 'marcos@test.com'],
            ['name' => 'Marcos', 'password' => Hash::make(env('USER_SEEDER_PASSWORD', 'password'))]
        );

        /* User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]); */
    }
}
