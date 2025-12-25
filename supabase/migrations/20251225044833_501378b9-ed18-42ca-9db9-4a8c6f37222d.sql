-- Create bond_requests table for pending parent-child bonds
CREATE TABLE public.bond_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (parent_id, child_id)
);

-- Enable RLS
ALTER TABLE public.bond_requests ENABLE ROW LEVEL SECURITY;

-- Parents can view their own requests
CREATE POLICY "Parents can view their requests"
ON public.bond_requests
FOR SELECT
USING (auth.uid() = parent_id);

-- Parents can create requests
CREATE POLICY "Parents can create requests"
ON public.bond_requests
FOR INSERT
WITH CHECK (auth.uid() = parent_id AND has_role(auth.uid(), 'parent'));

-- Students can view requests for them
CREATE POLICY "Students can view their requests"
ON public.bond_requests
FOR SELECT
USING (auth.uid() = child_id);

-- Students can update (approve/deny) their requests
CREATE POLICY "Students can update their requests"
ON public.bond_requests
FOR UPDATE
USING (auth.uid() = child_id);

-- Admins can manage all requests
CREATE POLICY "Admins can manage requests"
ON public.bond_requests
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Function to find student by exact name or email
CREATE OR REPLACE FUNCTION public.find_student_by_name_or_email(search_term text)
RETURNS TABLE(id uuid, first_name text, last_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.first_name, p.last_name
  FROM public.profiles p
  INNER JOIN public.user_roles ur ON ur.user_id = p.id
  INNER JOIN auth.users u ON u.id = p.id
  WHERE ur.role = 'student'
    AND (
      LOWER(u.email) = LOWER(search_term)
      OR LOWER(CONCAT(p.first_name, ' ', p.last_name)) = LOWER(search_term)
    )
$$;