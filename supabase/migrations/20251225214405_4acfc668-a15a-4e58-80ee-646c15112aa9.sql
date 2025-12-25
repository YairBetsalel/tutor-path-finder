-- Update RLS policies for lesson_ratings to allow tutors to view all ratings
CREATE POLICY "Tutors can view all ratings"
ON public.lesson_ratings
FOR SELECT
USING (public.has_role(auth.uid(), 'tutor'::app_role));

-- Allow tutors to create ratings
CREATE POLICY "Tutors can create ratings"
ON public.lesson_ratings
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'tutor'::app_role));

-- Allow tutors to update their own ratings
CREATE POLICY "Tutors can update their own ratings"
ON public.lesson_ratings
FOR UPDATE
USING (public.has_role(auth.uid(), 'tutor'::app_role) AND admin_id = auth.uid());

-- Allow tutors to view all profiles (for student ratings)
CREATE POLICY "Tutors can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'tutor'::app_role));

-- Allow tutors to view user_roles to check student status
CREATE POLICY "Tutors can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'tutor'::app_role));