-- Create tutor_availability table
CREATE TABLE public.tutor_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Create index for faster queries
CREATE INDEX idx_tutor_availability_date ON public.tutor_availability(date);
CREATE INDEX idx_tutor_availability_tutor ON public.tutor_availability(tutor_id);

-- Enable RLS
ALTER TABLE public.tutor_availability ENABLE ROW LEVEL SECURITY;

-- Tutors can view all availability (so they can see other tutors)
CREATE POLICY "Tutors can view all availability"
ON public.tutor_availability
FOR SELECT
USING (has_role(auth.uid(), 'tutor'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Tutors can insert their own availability
CREATE POLICY "Tutors can insert own availability"
ON public.tutor_availability
FOR INSERT
WITH CHECK (auth.uid() = tutor_id AND has_role(auth.uid(), 'tutor'::app_role));

-- Tutors can update their own availability
CREATE POLICY "Tutors can update own availability"
ON public.tutor_availability
FOR UPDATE
USING (auth.uid() = tutor_id AND has_role(auth.uid(), 'tutor'::app_role));

-- Tutors can delete their own availability
CREATE POLICY "Tutors can delete own availability"
ON public.tutor_availability
FOR DELETE
USING (auth.uid() = tutor_id AND has_role(auth.uid(), 'tutor'::app_role));

-- Admins can manage all availability
CREATE POLICY "Admins can manage all availability"
ON public.tutor_availability
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_tutor_availability_updated_at
BEFORE UPDATE ON public.tutor_availability
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();