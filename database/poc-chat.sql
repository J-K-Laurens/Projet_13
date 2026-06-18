DROP TABLE IF EXISTS "ChatMessage" CASCADE;
DROP TABLE IF EXISTS "ChatSession" CASCADE;
DROP TABLE IF EXISTS "SupportMessage" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
CREATE TABLE "User" (
id SERIAL PRIMARY KEY,
email VARCHAR(255) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
first_name VARCHAR(100),
last_name VARCHAR(100),
date_of_birth DATE,
phone VARCHAR(50),
address_line1 VARCHAR(255),
city VARCHAR(100),
postal_code VARCHAR(20),
country VARCHAR(100),
email_verified BOOLEAN NOT NULL DEFAULT FALSE,
created_at TIMESTAMP NOT NULL DEFAULT NOW(),
updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
deleted_at TIMESTAMP
);

CREATE TABLE "ChatSession" (
id SERIAL PRIMARY KEY,
user_id INT NOT NULL,
started_at TIMESTAMP NOT NULL DEFAULT NOW(),
ended_at TIMESTAMP,
status VARCHAR(50) NOT NULL DEFAULT 'active',

CONSTRAINT fk_chatsession_user
FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE

);

CREATE TABLE "ChatMessage" (
id SERIAL PRIMARY KEY,
session_id INT NOT NULL,
sender_type VARCHAR(50) NOT NULL, -- ex: 'user', 'agent', 'bot'
sender_id INT NOT NULL,
content TEXT NOT NULL,
sent_at TIMESTAMP NOT NULL DEFAULT NOW(),
CONSTRAINT fk_chatmessage_session
FOREIGN KEY (session_id) REFERENCES "ChatSession"(id) ON DELETE CASCADE
);
CREATE TABLE "SupportMessage" (
id SERIAL PRIMARY KEY,
user_id INT NOT NULL,
subject VARCHAR(255),
content TEXT NOT NULL,
is_read_by_agent BOOLEAN NOT NULL DEFAULT FALSE,
agent_response TEXT,
responded_at TIMESTAMP,
created_at TIMESTAMP NOT NULL DEFAULT NOW(),
CONSTRAINT fk_supportmessage_user
FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE
);

--Indexes pour amélirer les performances des requêtes
CREATE INDEX idx_chatsession_user_id ON "ChatSession"(user_id);
CREATE INDEX idx_chatmessage_session_id ON "ChatMessage"(session_id);
CREATE INDEX idx_supportmessage_user_id ON "SupportMessage"(user_id);
CREATE INDEX idx_user_email ON "User"(email);

-- Trigger -> Evite de gérer updated_at manuellement côté applicatif
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;

LANGUAGE plpgsql;
CREATE TRIGGER trg_user_updated_at
BEFORE UPDATE ON "User"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();