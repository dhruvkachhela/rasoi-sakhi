-- ==============================================================
-- RASOI SAKHI - DATABASE RE-CREATION SCHEMA (PRODUCTION STACK)
-- Run this in the SQL Editor of your CLIENT'S Supabase Dashboard
-- WARNING: This will drop any existing tables to rebuild them cleanly.
-- ==============================================================

-- 1. Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS "pushSubscriptions" CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS payment_mappings CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;

-- 2. Create 'settings' table
CREATE TABLE IF NOT EXISTS settings (
  id INT8 PRIMARY KEY,
  "googleSheetsWebhookUrl" TEXT DEFAULT '',
  "whatsappNumber" TEXT DEFAULT '919876543210',
  "deliveryCharge" NUMERIC DEFAULT 30,
  "freeDeliveryThreshold" NUMERIC DEFAULT 299,
  "allowedPincodes" TEXT DEFAULT '392011'
);

-- 3. Create 'users' table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create 'products' table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT DEFAULT '',
  "freshnessInfo" TEXT DEFAULT '',
  "storageInstructions" TEXT DEFAULT '',
  price NUMERIC NOT NULL,
  "baseWeight" TEXT NOT NULL,
  "weightOptions" JSONB NOT NULL,
  image TEXT NOT NULL,
  popular BOOLEAN DEFAULT false
);

-- 5. Create 'orders' table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  "customerName" TEXT NOT NULL,
  "customerPhone" TEXT NOT NULL,
  "customerEmail" TEXT DEFAULT '',
  "deliveryAddress" TEXT NOT NULL,
  landmark TEXT DEFAULT '',
  "deliverySlot" TEXT NOT NULL,
  "paymentMethod" TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  "deliveryCharge" NUMERIC NOT NULL,
  "totalAmount" NUMERIC NOT NULL,
  status TEXT DEFAULT 'Pending',
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "isRead" BOOLEAN DEFAULT false
);

-- 6. Create 'testimonials' table
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  quote TEXT NOT NULL,
  rating INTEGER NOT NULL
);

-- 7. Create 'payment_mappings' table
CREATE TABLE IF NOT EXISTS payment_mappings (
  razorpay_order_id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create 'pushSubscriptions' table (camelCase table name and fields)
CREATE TABLE IF NOT EXISTS "pushSubscriptions" (
  endpoint TEXT PRIMARY KEY,
  "expirationTime" TEXT,
  keys JSONB,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Create 'contact_messages' table
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_resolved BOOLEAN DEFAULT false
);
