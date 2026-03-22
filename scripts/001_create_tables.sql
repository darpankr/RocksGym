-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Trainers table (public, viewable by all)
CREATE TABLE IF NOT EXISTS public.trainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  experience_years INT DEFAULT 0,
  certifications TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "trainers_select_all" ON public.trainers FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Exercises table (public library)
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  muscle_group TEXT NOT NULL,
  equipment TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  instructions TEXT[],
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "exercises_select_all" ON public.exercises FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Workout plans table
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "workout_plans_select_own" ON public.workout_plans FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "workout_plans_insert_own" ON public.workout_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "workout_plans_update_own" ON public.workout_plans FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "workout_plans_delete_own" ON public.workout_plans FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Workout plan exercises (junction table)
CREATE TABLE IF NOT EXISTS public.workout_plan_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_plan_id UUID NOT NULL REFERENCES public.workout_plans(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  sets INT DEFAULT 3,
  reps INT DEFAULT 10,
  rest_seconds INT DEFAULT 60,
  order_index INT DEFAULT 0
);

ALTER TABLE public.workout_plan_exercises ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "workout_plan_exercises_select" ON public.workout_plan_exercises FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.workout_plans WHERE id = workout_plan_id AND (user_id = auth.uid() OR is_public = TRUE))
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "workout_plan_exercises_insert" ON public.workout_plan_exercises FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.workout_plans WHERE id = workout_plan_id AND user_id = auth.uid())
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "workout_plan_exercises_update" ON public.workout_plan_exercises FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.workout_plans WHERE id = workout_plan_id AND user_id = auth.uid())
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "workout_plan_exercises_delete" ON public.workout_plan_exercises FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.workout_plans WHERE id = workout_plan_id AND user_id = auth.uid())
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Workout logs table
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_plan_id UUID REFERENCES public.workout_plans(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  notes TEXT,
  duration_minutes INT,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "workout_logs_select_own" ON public.workout_logs FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "workout_logs_insert_own" ON public.workout_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "workout_logs_update_own" ON public.workout_logs FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "workout_logs_delete_own" ON public.workout_logs FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Exercise logs (individual exercise entries within a workout)
CREATE TABLE IF NOT EXISTS public.exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_log_id UUID NOT NULL REFERENCES public.workout_logs(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  sets_completed INT DEFAULT 0,
  reps_per_set INT[],
  weight_per_set DECIMAL[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "exercise_logs_select" ON public.exercise_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.workout_logs WHERE id = workout_log_id AND user_id = auth.uid())
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "exercise_logs_insert" ON public.exercise_logs FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.workout_logs WHERE id = workout_log_id AND user_id = auth.uid())
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "exercise_logs_update" ON public.exercise_logs FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.workout_logs WHERE id = workout_log_id AND user_id = auth.uid())
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "exercise_logs_delete" ON public.exercise_logs FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.workout_logs WHERE id = workout_log_id AND user_id = auth.uid())
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Profile trigger for auto-creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
