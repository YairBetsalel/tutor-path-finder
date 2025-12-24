-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  avatar_color TEXT DEFAULT '#0A4D4A',
  avatar_letter TEXT DEFAULT 'U',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create lesson ratings table
CREATE TABLE public.lesson_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  focus INTEGER NOT NULL DEFAULT 1 CHECK (focus >= 1 AND focus <= 5),
  skill INTEGER NOT NULL DEFAULT 1 CHECK (skill >= 1 AND skill <= 5),
  revision INTEGER NOT NULL DEFAULT 1 CHECK (revision >= 1 AND revision <= 5),
  attitude INTEGER NOT NULL DEFAULT 1 CHECK (attitude >= 1 AND attitude <= 5),
  potential INTEGER NOT NULL DEFAULT 1 CHECK (potential >= 1 AND potential <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.lesson_ratings ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for lesson_ratings
CREATE POLICY "Students can view their own ratings"
  ON public.lesson_ratings FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Admins can view all ratings"
  ON public.lesson_ratings FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create ratings"
  ON public.lesson_ratings FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update ratings"
  ON public.lesson_ratings FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  random_colors TEXT[] := ARRAY['#0A4D4A', '#E07A5F', '#3D5A80', '#81B29A', '#F4A261', '#E76F51'];
  random_letter TEXT;
  random_color TEXT;
BEGIN
  random_letter := chr(65 + floor(random() * 26)::int);
  random_color := random_colors[1 + floor(random() * array_length(random_colors, 1))::int];
  
  INSERT INTO public.profiles (id, first_name, last_name, avatar_color, avatar_letter)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    random_color,
    random_letter
  );
  
  -- Assign default student role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();