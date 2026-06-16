require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_KEY in env variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DB_PATH = path.join(__dirname, 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

async function seed() {
  console.log("Starting automatic cloud database seeding...");

  // 1. Seed settings
  if (dbData.settings) {
    console.log("Seeding settings table...");
    const { error } = await supabase.from('settings').upsert({ id: 1, ...dbData.settings });
    if (error) {
      console.error("Error seeding settings:", error.message);
    } else {
      console.log("Settings seeded successfully.");
    }
  }

  // 2. Seed users
  if (dbData.users && dbData.users.length) {
    console.log("Seeding users table...");
    const { error } = await supabase.from('users').upsert(dbData.users);
    if (error) {
      console.error("Error seeding users:", error.message);
    } else {
      console.log("Users seeded successfully.");
    }
  }

  // 3. Seed testimonials
  if (dbData.testimonials && dbData.testimonials.length) {
    console.log("Seeding testimonials table...");
    const { error } = await supabase.from('testimonials').upsert(dbData.testimonials);
    if (error) {
      console.error("Error seeding testimonials:", error.message);
    } else {
      console.log("Testimonials seeded successfully.");
    }
  }

  // 4. Seed products
  if (dbData.products && dbData.products.length) {
    console.log("Seeding products table...");
    // Ensure data structures are clean and correct
    const productsToSeed = dbData.products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description || "",
      freshnessInfo: p.freshnessInfo || "",
      storageInstructions: p.storageInstructions || "",
      price: Number(p.price),
      baseWeight: p.baseWeight,
      weightOptions: p.weightOptions,
      image: p.image,
      popular: !!p.popular
    }));

    const { error } = await supabase.from('products').upsert(productsToSeed);
    if (error) {
      console.error("Error seeding products:", error.message);
    } else {
      console.log("Products seeded successfully.");
    }
  }

  console.log("Cloud database seeding finished.");
}

seed();
