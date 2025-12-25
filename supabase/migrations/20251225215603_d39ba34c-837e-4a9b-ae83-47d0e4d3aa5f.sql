-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create tutor_profiles table for storing tutor/admin qualifications and bios
CREATE TABLE public.tutor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  bio TEXT,
  subject TEXT,
  standard_qualifications TEXT[] DEFAULT '{}',
  custom_qualifications TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tutor_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view all tutor profiles (for Our Team page)
CREATE POLICY "Anyone can view tutor profiles"
ON public.tutor_profiles
FOR SELECT
USING (true);

-- Tutors can update their own profile
CREATE POLICY "Tutors can update their own profile"
ON public.tutor_profiles
FOR UPDATE
USING (auth.uid() = user_id AND has_role(auth.uid(), 'tutor'::app_role));

-- Tutors can insert their own profile
CREATE POLICY "Tutors can insert their own profile"
ON public.tutor_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id AND has_role(auth.uid(), 'tutor'::app_role));

-- Admins can update their own profile
CREATE POLICY "Admins can update their own profile"
ON public.tutor_profiles
FOR UPDATE
USING (auth.uid() = user_id AND has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert their own profile
CREATE POLICY "Admins can insert their own profile"
ON public.tutor_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id AND has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage all tutor profiles
CREATE POLICY "Admins can manage all tutor profiles"
ON public.tutor_profiles
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger
CREATE TRIGGER update_tutor_profiles_updated_at
BEFORE UPDATE ON public.tutor_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();