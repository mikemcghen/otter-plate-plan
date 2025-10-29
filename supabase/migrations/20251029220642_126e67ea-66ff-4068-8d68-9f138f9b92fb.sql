-- Add privacy settings to profiles table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'profile_visibility') THEN
    ALTER TABLE public.profiles ADD COLUMN profile_visibility text DEFAULT 'friends' CHECK (profile_visibility IN ('public', 'friends', 'private'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'auto_share_recipes') THEN
    ALTER TABLE public.profiles ADD COLUMN auto_share_recipes boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'show_badges_to_friends') THEN
    ALTER TABLE public.profiles ADD COLUMN show_badges_to_friends boolean DEFAULT true;
  END IF;
END $$;

-- Add CHECK constraints for friendship status and content type (if not already present)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'friendship_status_check') THEN
    ALTER TABLE public.friendships ADD CONSTRAINT friendship_status_check CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'content_type_check') THEN
    ALTER TABLE public.shared_content ADD CONSTRAINT content_type_check CHECK (content_type IN ('recipe', 'snack', 'meal', 'tip'));
  END IF;
END $$;

-- Recreate policies if they were dropped
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Shared content is viewable by friends' AND tablename = 'shared_content') THEN
    EXECUTE 'CREATE POLICY "Shared content is viewable by friends" ON public.shared_content FOR SELECT USING (
      auth.uid() = user_id OR
      EXISTS (
        SELECT 1 FROM friendships
        WHERE ((user_id = auth.uid() AND friend_id = shared_content.user_id) OR
               (friend_id = auth.uid() AND user_id = shared_content.user_id))
        AND status = ''accepted''
      )
    )';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their friendships' AND tablename = 'friendships') THEN
    EXECUTE 'CREATE POLICY "Users can view their friendships" ON public.friendships FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their friendships' AND tablename = 'friendships') THEN
    EXECUTE 'CREATE POLICY "Users can update their friendships" ON public.friendships FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_id)';
  END IF;
END $$;

-- Add validation constraints for shared_content
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'title_length') THEN
    ALTER TABLE public.shared_content ADD CONSTRAINT title_length CHECK (char_length(title) <= 100);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'description_length') THEN
    ALTER TABLE public.shared_content ADD CONSTRAINT description_length CHECK (char_length(description) <= 500);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'calories_range') THEN
    ALTER TABLE public.shared_content ADD CONSTRAINT calories_range CHECK (calories IS NULL OR (calories >= 0 AND calories <= 10000));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protein_range') THEN
    ALTER TABLE public.shared_content ADD CONSTRAINT protein_range CHECK (protein IS NULL OR (protein >= 0 AND protein <= 500));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'carbs_range') THEN
    ALTER TABLE public.shared_content ADD CONSTRAINT carbs_range CHECK (carbs IS NULL OR (carbs >= 0 AND carbs <= 1000));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fat_range') THEN
    ALTER TABLE public.shared_content ADD CONSTRAINT fat_range CHECK (fat IS NULL OR (fat >= 0 AND fat <= 500));
  END IF;
END $$;

-- Add helpful comments
COMMENT ON COLUMN profiles.profile_visibility IS 'Controls who can view user profile: public (everyone), friends (friends only), private (only self)';
COMMENT ON COLUMN profiles.auto_share_recipes IS 'Automatically share recipes to friends feed';
COMMENT ON COLUMN profiles.show_badges_to_friends IS 'Allow friends to see unlocked badges';