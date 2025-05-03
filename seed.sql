-- Clear existing data (optional)
DO $$
DECLARE
    join_table_name text;
BEGIN
    -- Find the actual join table name between post and tag
    SELECT table_name INTO join_table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name LIKE '%post%tag%';

    IF join_table_name IS NOT NULL THEN
        EXECUTE 'DELETE FROM ' || quote_ident(join_table_name);
    END IF;
END $$;

DELETE FROM post;
DELETE FROM tag;
DELETE FROM "user";
DELETE FROM profile;

-- Reset sequences (optional)
ALTER SEQUENCE tag_id_seq RESTART WITH 1;
ALTER SEQUENCE post_id_seq RESTART WITH 1;
ALTER SEQUENCE user_id_seq RESTART WITH 1;
ALTER SEQUENCE profile_id_seq RESTART WITH 1;

-- Insert Tags
INSERT INTO tag (name) VALUES
  ('Technology'),
  ('Programming'),
  ('GraphQL'),
  ('NestJS'),
  ('TypeScript'),
  ('JavaScript'),
  ('Database'),
  ('Web Development'),
  ('API'),
  ('Security');

-- Insert Users and Profiles
DO $$
DECLARE
  user_id integer;
  profile_id integer;
  join_table_name text;
  post_tag_pairs text[][];  -- Track inserted post-tag pairs
  random_tag_id integer;
  pair_exists boolean;
BEGIN
  -- First create profiles
  FOR i IN 1..10 LOOP
    -- Insert Profile
    INSERT INTO profile (bio, avatar)
    VALUES (
      'Bio for user ' || i,
      'https://randomuser.me/api/portraits/' || (CASE WHEN i % 2 = 0 THEN 'men' ELSE 'women' END) || '/' || i || '.jpg'
    )
    RETURNING id INTO profile_id;
    
    -- Then insert User with profile_id (with proper enum casting)
    INSERT INTO "user" (username, email, password, role, "profileId")
    VALUES (
      'user' || i,
      'user' || i || '@example.com',
      '$2b$10$3euPcmQFCiblsZeEu5s7p.9mSF5Hg7yIw0QmjuUDDJFXkXXMh/20W', -- pre-hashed 'password123'
      CASE WHEN i = 1 THEN 'ADMIN'::user_role_enum ELSE 'USER'::user_role_enum END,
      profile_id
    )
    RETURNING id INTO user_id;
  END LOOP;
  
  -- Insert Posts
  FOR i IN 1..10 LOOP
    -- Insert Post with random user
    INSERT INTO post (title, content, "userId")
    VALUES (
      'Post ' || i || ' Title',
      'This is the content of post ' || i || '. It contains some dummy text for demonstration purposes.',
      floor(random() * 10) + 1
    );
  END LOOP;
  
  -- Find the join table name for post-tag many-to-many relationship
  SELECT table_name INTO join_table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name LIKE '%post%tag%';
  
  IF join_table_name IS NOT NULL THEN
    -- Initialize empty array to track pairs
    post_tag_pairs := ARRAY[]::text[][];
    
    -- Add tags to posts (many-to-many) avoiding duplicates
    FOR i IN 1..10 LOOP -- For each post
      FOR j IN 1..floor(random() * 3) + 2 LOOP -- Add 2-4 tags
        -- Keep trying until we get a unique tag for this post
        LOOP
          random_tag_id := floor(random() * 10) + 1;
          
          -- Check if this pair already exists
          pair_exists := FALSE;
          IF array_length(post_tag_pairs, 1) > 0 THEN
            FOR k IN 1..array_length(post_tag_pairs, 1) LOOP
              IF post_tag_pairs[k][1] = i::text AND post_tag_pairs[k][2] = random_tag_id::text THEN
                pair_exists := TRUE;
                EXIT;
              END IF;
            END LOOP;
          END IF;
          
          -- If pair doesn't exist, add it and exit loop
          IF NOT pair_exists THEN
            post_tag_pairs := array_cat(post_tag_pairs, ARRAY[[i::text, random_tag_id::text]]);
            
            -- Insert into join table
            EXECUTE format('INSERT INTO %I ("postId", "tagId") VALUES ($1, $2)', join_table_name)
            USING i, random_tag_id;
            
            EXIT; -- Exit the loop after successful insert
          END IF;
          
          -- If we've tried all tags for this post, exit anyway
          IF j > 10 THEN
            EXIT;
          END IF;
        END LOOP;
      END LOOP;
    END LOOP;
  END IF;
END $$;