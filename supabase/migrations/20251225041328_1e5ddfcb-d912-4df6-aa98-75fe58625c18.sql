CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  random_colors TEXT[] := ARRAY['#0A4D4A', '#E07A5F', '#3D5A80', '#81B29A', '#F4A261', '#E76F51'];
  first_letter TEXT;
  random_color TEXT;
BEGIN
  -- Get first letter of first_name, default to 'U' if not provided
  first_letter := UPPER(LEFT(COALESCE(NEW.raw_user_meta_data ->> 'first_name', 'U'), 1));
  IF first_letter = '' THEN
    first_letter := 'U';
  END IF;
  
  random_color := random_colors[1 + floor(random() * array_length(random_colors, 1))::int];
  
  INSERT INTO public.profiles (id, first_name, last_name, avatar_color, avatar_letter)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    random_color,
    first_letter
  );
  
  -- Assign default student role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$function$;