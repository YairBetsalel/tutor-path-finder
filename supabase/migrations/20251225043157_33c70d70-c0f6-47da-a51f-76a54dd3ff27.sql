-- Create a function to find a parent by email
CREATE OR REPLACE FUNCTION public.find_parent_by_email(parent_email TEXT)
RETURNS TABLE (id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.id
  FROM auth.users u
  INNER JOIN public.user_roles ur ON ur.user_id = u.id
  WHERE u.email = parent_email
    AND ur.role = 'parent'
$$;