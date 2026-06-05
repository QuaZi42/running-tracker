-- Run this in the Supabase SQL editor if bike rides don't persist after sync.
ALTER TABLE weekly_recaps
  ADD COLUMN IF NOT EXISTS bike_count integer NOT NULL DEFAULT 0;
