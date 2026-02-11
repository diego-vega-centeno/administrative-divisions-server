-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  oauth_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create layers table
CREATE TABLE IF NOT EXISTS layers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, title)
);

-- Create layers to relations reference
CREATE TABLE IF NOT EXISTS layer_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layer_id UUID REFERENCES layers(id) ON DELETE CASCADE,
  osm_relation_id VARCHAR(100) NOT NULL,
  osm_relation_name VARCHAR(255) NOT NULL,
  parents_names TEXT NOT NULL,
  admin_level VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(layer_id, osm_relation_id)
);

-- Layer_relations indexes

-- this one is automatically created by the UNIQUE constraint
-- CREATE INDEX idx_layer_relations_layer_id ON layer_relations(layer_id);

CREATE INDEX idx_layer_relations_osm_id ON layer_relations(osm_relation_id);