// Predefined qualifications mapped to subjects
export const SUBJECT_QUALIFICATIONS: Record<string, readonly string[]> = {
  Law: [
    "Bar Certified",
    "JD",
    "LLM",
    "Legal Writing Specialist",
    "LLB",
    "Paralegal Certified",
  ],
  Biology: [
    "Lab Certified",
    "Pre-Med Mentor",
    "PhD Biology",
    "AP Bio Certified",
    "BSc Biology",
    "MSc Biology",
  ],
  Math: [
    "IMO Participant",
    "Calculus Specialist",
    "Statistics Pro",
    "PhD Mathematics",
    "MSc Mathematics",
    "AP Calculus Certified",
  ],
  Physics: [
    "PhD Physics",
    "MSc Physics",
    "BSc Physics",
    "AP Physics Certified",
    "Lab Experience",
  ],
  Chemistry: [
    "PhD Chemistry",
    "MSc Chemistry",
    "Lab Certified",
    "AP Chemistry Certified",
    "Organic Chemistry Specialist",
  ],
  "Computer Science": [
    "BSc Computer Science",
    "MSc Computer Science",
    "PhD Computer Science",
    "Software Engineer",
    "Full Stack Developer",
    "Data Scientist",
  ],
  Medicine: [
    "MD",
    "MBBS",
    "Pre-Med Specialist",
    "UCAT Coach",
    "MCAT Coach",
    "Clinical Experience",
  ],
  Economics: [
    "MBA",
    "MA Economics",
    "PhD Economics",
    "CFA",
    "Financial Analyst",
  ],
  English: [
    "MA English Literature",
    "PhD English",
    "Creative Writing MFA",
    "IELTS Certified",
    "Essay Specialist",
  ],
  General: [
    "Teaching Certification",
    "IB Examiner",
    "Cambridge Certified",
    "NCEA Specialist",
    "Curriculum Developer",
  ],
};

export type Subject = keyof typeof SUBJECT_QUALIFICATIONS;

export const SUBJECTS = Object.keys(SUBJECT_QUALIFICATIONS) as Subject[];

export function getQualificationsForSubject(subject: Subject | null): string[] {
  if (!subject) {
    return [...SUBJECT_QUALIFICATIONS.General];
  }
  return [...SUBJECT_QUALIFICATIONS[subject]];
}
