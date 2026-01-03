-- users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL
);

-- chat_messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  question TEXT,
  answer TEXT,
  tokens INT,
  created_at TIMESTAMP DEFAULT now()
);

-- subscription_bundles
CREATE TABLE subscription_bundles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  tier TEXT CHECK (tier IN ('BASIC', 'PRO', 'ENTERPRISE')),
  max_messages INT,
  used_messages INT DEFAULT 0,
  price NUMERIC,
  start_date DATE,
  end_date DATE,
  renewal_date DATE,
  auto_renew BOOLEAN,
  active BOOLEAN DEFAULT true,
  billing_cycle TEXT CHECK (billing_cycle IN ('MONTHLY', 'YEARLY'))
);

-- free_quota_tracking
CREATE TABLE free_quotas (
  user_id UUID PRIMARY KEY,
  used_messages INT,
  month INT,
  year INT
);

-- test user
\set user_id '11111111-1111-1111-1111-111111111111'
