-- Create reactions table for social interactions
CREATE TABLE IF NOT EXISTS public.reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.shared_content(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('heart', 'thumbs_up', 'wave', 'otter')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add unique constraint to prevent duplicate reactions
CREATE UNIQUE INDEX IF NOT EXISTS reactions_user_content_unique ON public.reactions(user_id, content_id, reaction_type);

-- Enable RLS
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

-- Policies for reactions
CREATE POLICY "Users can view reactions on content they can see"
  ON public.reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.shared_content
      WHERE shared_content.id = reactions.content_id
      AND (
        shared_content.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.friendships
          WHERE (
            (friendships.user_id = auth.uid() AND friendships.friend_id = shared_content.user_id AND friendships.status = 'accepted')
            OR (friendships.friend_id = auth.uid() AND friendships.user_id = shared_content.user_id AND friendships.status = 'accepted')
          )
        )
      )
    )
  );

CREATE POLICY "Users can create their own reactions"
  ON public.reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions"
  ON public.reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Create activity_feed table for tracking social events
CREATE TABLE IF NOT EXISTS public.activity_feed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('login', 'shared_snack', 'shared_recipe', 'earned_badge', 'duo_streak', 'reaction', 'encouragement')),
  content_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;

-- Policy for viewing activity feed
CREATE POLICY "Users can view their own activity feed"
  ON public.activity_feed FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for creating activity
CREATE POLICY "Users can create activity for friends"
  ON public.activity_feed FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.friendships
      WHERE (
        (friendships.user_id = auth.uid() AND friendships.friend_id = activity_feed.user_id AND friendships.status = 'accepted')
        OR (friendships.friend_id = auth.uid() AND friendships.user_id = activity_feed.user_id AND friendships.status = 'accepted')
        OR auth.uid() = activity_feed.user_id
      )
    )
  );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_activity_feed_user_created ON public.activity_feed(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reactions_content ON public.reactions(content_id);