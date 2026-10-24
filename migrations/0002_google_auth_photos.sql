CREATE TABLE sessions (token_hash TEXT PRIMARY KEY, owner TEXT NOT NULL, expires INTEGER NOT NULL);
CREATE INDEX sessions_expiry ON sessions(expires);
CREATE TABLE photo_chunks (photo_key TEXT NOT NULL, part INTEGER NOT NULL, content_type TEXT NOT NULL, data BLOB NOT NULL, PRIMARY KEY(photo_key,part));
