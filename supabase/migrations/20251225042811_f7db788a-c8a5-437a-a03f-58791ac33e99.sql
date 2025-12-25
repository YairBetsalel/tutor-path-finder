-- Add 'parent' to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'parent';

-- Create parent-child bonds table
CREATE TABLE public.parent_child_bonds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (parent_id, child_id)
);

-- Enable RLS
ALTER TABLE public.parent_child_bonds ENABLE ROW LEVEL SECURITY;

-- Parents can view their own bonds
CREATE POLICY "Parents can view their bonds"
ON public.parent_child_bonds
FOR SELECT
USING (auth.uid() = parent_id);

-- Students can view bonds where they are the child
CREATE POLICY "Students can view their bonds"
ON public.parent_child_bonds
FOR SELECT
USING (auth.uid() = child_id);

-- Students can create bonds (invite parents)
CREATE POLICY "Students can create bonds"
ON public.parent_child_bonds
FOR INSERT
WITH CHECK (auth.uid() = child_id);

-- Students can delete their own bonds
CREATE POLICY "Students can delete their bonds"
ON public.parent_child_bonds
FOR DELETE
USING (auth.uid() = child_id);

-- Admins can manage all bonds
CREATE POLICY "Admins can manage bonds"
ON public.parent_child_bonds
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Parents can view profiles of their bonded children
CREATE POLICY "Parents can view bonded child profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.parent_child_bonds
    WHERE parent_id = auth.uid() AND child_id = profiles.id
  )
);

-- Parents can view lesson ratings of their bonded children
CREATE POLICY "Parents can view bonded child ratings"
ON public.lesson_ratings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.parent_child_bonds
    WHERE parent_id = auth.uid() AND child_id = lesson_ratings.student_id
  )
);