-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  oauth_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  osm_relation_id VARCHAR(100) NOT NULL,
  osm_relation_name VARCHAR(100) NOT NULL,
  text VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, osm_relation_id)
);

-- Create layers table
CREATE TABLE IF NOT EXISTS layers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- Create layers to relations reference
CREATE TABLE IF NOT EXISTS layer_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layer_id UUID REFERENCES layers(id) ON DELETE CASCADE,
  osm_relation_id VARCHAR(100) NOT NULL,
  osm_relation_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(layer_id, osm_relation_id)
)