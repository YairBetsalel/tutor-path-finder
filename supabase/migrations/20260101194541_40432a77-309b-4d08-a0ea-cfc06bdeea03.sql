-- Allow everyone to view tutor and admin roles (for Our Team page)
CREATE POLICY "Anyone can view tutor and admin roles"
ON public.user_roles
FOR SELECT
USING (role IN ('tutor', 'admin'));

-- Allow everyone to view profiles of tutors and admins (for Our Team page)
CREATE POLICY "Anyone can view tutor and admin profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = profiles.id
    AND user_roles.role IN ('tutor', 'admin')
  )
);