/*
# Create orders table for Yum Bakers realtime order tracking

1. New Tables
- `orders`
  - `id` (text, primary key) — e.g. 'YUM-1001'
  - `customer_phone` (text, not null)
  - `address` (text, not null)
  - `items` (jsonb, not null) — array of {id, name, quantity, price}
  - `total_amount` (numeric, not null)
  - `status` (text, not null, default 'Pending') — Pending/Preparing/Ready/Out for Delivery/Delivered
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `orders`.
- This is a single-tenant app (no sign-in for customers; staff use passkeys in-app, not Supabase auth).
- Allow anon + authenticated full CRUD since the data is intentionally shared across all staff dashboards.

3. Realtime
- Enable realtime replication on the orders table so the chef/delivery/owner dashboards get live updates.
*/

CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  customer_phone text NOT NULL,
  address text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Seed initial orders matching the in-memory seed data
INSERT INTO orders (id, customer_phone, address, items, total_amount, status, created_at) VALUES
  ('YUM-1001', '0301-2345678', 'House 12, Street 5, Wah Cantt',
    '[{"id":"celebration-cake","name":"Celebration Cake","quantity":1,"price":3200},{"id":"gulab-jamun","name":"Gulab Jamun","quantity":2,"price":900}]'::jsonb,
    5000, 'Pending', now() - interval '15 minutes'),
  ('YUM-1002', '0333-9876543', 'Flat 4B, Nawababad, Wah',
    '[{"id":"combo-2pc","name":"2-Piece Signature Combo","quantity":3,"price":650}]'::jsonb,
    1950, 'Preparing', now() - interval '8 minutes'),
  ('YUM-1003', '0345-5550192', 'Bank Road, Main Bazar, Hazro',
    '[{"id":"mixed-barfi","name":"Mixed Barfi / Mithai","quantity":1,"price":1400},{"id":"rasgulla","name":"Rasgulla & Cham Cham","quantity":1,"price":1000}]'::jsonb,
    2400, 'Ready', now() - interval '22 minutes'),
  ('YUM-1004', '0321-7778899', 'Kamra Road, Attock',
    '[{"id":"bucket-8pc","name":"8-Piece Family Bucket","quantity":1,"price":2100},{"id":"spicy-wings","name":"Spicy Wings","quantity":2,"price":560}]'::jsonb,
    3220, 'Out for Delivery', now() - interval '35 minutes'),
  ('YUM-1005', '0300-1112233', 'Ameen Plaza, G.T Road, Haripur',
    '[{"id":"organic-honey","name":"Pure Organic Honey","quantity":2,"price":850}]'::jsonb,
    1700, 'Delivered', now() - interval '90 minutes')
ON CONFLICT (id) DO NOTHING;
