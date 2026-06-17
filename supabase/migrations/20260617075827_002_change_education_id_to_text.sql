-- Change education table id from SERIAL to TEXT to match all other tables
ALTER TABLE education DROP CONSTRAINT education_pkey;
ALTER TABLE education ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE education ADD PRIMARY KEY (id);
