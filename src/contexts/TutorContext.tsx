import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Tutor {
  id: string;
  name: string;
  bio: string;
  position: 'Tutor' | 'Management';
  subject: string;
  standardQualifications: string[];
  customQualifications: string[];
  imageColor: string;
}

interface TutorContextType {
  tutors: Tutor[];
  addTutor: (tutor: Omit<Tutor, 'id' | 'imageColor'>) => void;
  updateTutor: (id: string, tutor: Omit<Tutor, 'id' | 'imageColor'>) => void;
  deleteTutor: (id: string) => void;
}

const TutorContext = createContext<TutorContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

const generateColor = () => {
  const colors = [
    'hsl(175, 75%, 25%)',
    'hsl(14, 65%, 55%)',
    'hsl(43, 74%, 50%)',
    'hsl(220, 60%, 50%)',
    'hsl(280, 50%, 50%)',
    'hsl(340, 60%, 50%)',
    'hsl(150, 50%, 40%)',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const initialTutors: Tutor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell',
    bio: 'Passionate educator with 15 years of experience in mathematics and physics. Specializes in making complex concepts accessible and engaging for students of all levels.',
    position: 'Management',
    subject: 'Math',
    standardQualifications: ['PhD Mathematics', 'Calculus Specialist', 'Teaching Certification'],
    customQualifications: ['Award-winning Educator 2023'],
    imageColor: 'hsl(175, 75%, 25%)',
  },
  {
    id: '2',
    name: 'James Chen',
    bio: 'Expert in computer science and programming. Former software engineer at Google with a passion for teaching the next generation of developers.',
    position: 'Tutor',
    subject: 'Computer Science',
    standardQualifications: ['MSc Computer Science', 'Software Engineer', 'Full Stack Developer'],
    customQualifications: ['Ex-Google Engineer', 'Open Source Contributor'],
    imageColor: 'hsl(220, 60%, 50%)',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    bio: 'Dedicated law tutor with experience in both academic and practical legal education. Helps students excel in their legal studies and bar preparations.',
    position: 'Tutor',
    subject: 'Law',
    standardQualifications: ['LLM', 'Bar Certified', 'Legal Writing Specialist'],
    customQualifications: ['Specialist in Patent Law for Startups'],
    imageColor: 'hsl(340, 60%, 50%)',
  },
  {
    id: '4',
    name: 'Dr. Michael Thompson',
    bio: 'Medical educator specializing in pre-med preparation and UCAT coaching. Has helped hundreds of students achieve their dreams of medical school admission.',
    position: 'Tutor',
    subject: 'Medicine',
    standardQualifications: ['MD', 'UCAT Coach', 'Pre-Med Specialist'],
    customQualifications: ['500+ Students Placed in Med School'],
    imageColor: 'hsl(150, 50%, 40%)',
  },
  {
    id: '5',
    name: 'Rachel Kim',
    bio: 'Cambridge curriculum specialist with expertise in sciences and mathematics. IB examiner with deep understanding of assessment criteria.',
    position: 'Tutor',
    subject: 'Chemistry',
    standardQualifications: ['PhD Chemistry', 'Lab Certified', 'IB Examiner'],
    customQualifications: ['Cambridge PGCE'],
    imageColor: 'hsl(43, 74%, 50%)',
  },
  {
    id: '6',
    name: 'David Patel',
    bio: 'NCEA and IB expert with a focus on Economics and Business Studies. Helps students develop critical thinking and analytical skills.',
    position: 'Management',
    subject: 'Economics',
    standardQualifications: ['MBA', 'CFA', 'PhD Economics'],
    customQualifications: ['Former Investment Banker', 'Business Strategy Consultant'],
    imageColor: 'hsl(280, 50%, 50%)',
  },
  {
    id: '7',
    name: 'Dr. Olivia Harper',
    bio: 'Renowned physicist with research experience at CERN. Passionate about making quantum mechanics and theoretical physics accessible to high school and university students.',
    position: 'Tutor',
    subject: 'Physics',
    standardQualifications: ['PhD Physics', 'MSc Physics', 'Lab Experience'],
    customQualifications: ['Former CERN Researcher', 'Published Author'],
    imageColor: 'hsl(200, 65%, 45%)',
  },
  {
    id: '8',
    name: 'Marcus Williams',
    bio: 'Biology specialist with a background in genetics and molecular biology. Expert at preparing students for pre-med pathways and research careers.',
    position: 'Tutor',
    subject: 'Biology',
    standardQualifications: ['PhD Biology', 'Lab Certified', 'Pre-Med Mentor'],
    customQualifications: ['Genetics Research Fellow', 'Science Olympiad Coach'],
    imageColor: 'hsl(120, 45%, 40%)',
  },
  {
    id: '9',
    name: 'Sofia Andersson',
    bio: 'English literature expert with a focus on creative writing and academic essay development. Helps students find their unique voice and excel in written communication.',
    position: 'Tutor',
    subject: 'English',
    standardQualifications: ['MA English Literature', 'Creative Writing MFA', 'Essay Specialist'],
    customQualifications: ['Published Novelist', 'Writing Workshop Leader'],
    imageColor: 'hsl(320, 55%, 50%)',
  },
  {
    id: '10',
    name: 'Dr. Ahmed Hassan',
    bio: 'Mathematics prodigy and former International Mathematical Olympiad medalist. Specializes in competition mathematics and advanced calculus for gifted students.',
    position: 'Tutor',
    subject: 'Math',
    standardQualifications: ['PhD Mathematics', 'IMO Participant', 'Statistics Pro'],
    customQualifications: ['IMO Gold Medalist', 'Math Olympiad Coach'],
    imageColor: 'hsl(25, 70%, 50%)',
  },
  {
    id: '11',
    name: 'Jennifer Liu',
    bio: 'Data science expert with industry experience at major tech companies. Bridges the gap between theoretical computer science and real-world applications.',
    position: 'Tutor',
    subject: 'Computer Science',
    standardQualifications: ['PhD Computer Science', 'Data Scientist', 'Software Engineer'],
    customQualifications: ['Ex-Meta AI Team', 'Machine Learning Specialist'],
    imageColor: 'hsl(260, 50%, 55%)',
  },
  {
    id: '12',
    name: 'William O\'Connor',
    bio: 'Constitutional law expert and former Supreme Court clerk. Provides unparalleled insight into legal reasoning and judicial processes.',
    position: 'Tutor',
    subject: 'Law',
    standardQualifications: ['JD', 'LLM', 'Bar Certified'],
    customQualifications: ['Former Supreme Court Clerk', 'Constitutional Law Expert'],
    imageColor: 'hsl(0, 50%, 45%)',
  },
  {
    id: '13',
    name: 'Dr. Priya Sharma',
    bio: 'Surgeon and medical educator with 20 years of clinical experience. Specializes in MCAT preparation and medical school interview coaching.',
    position: 'Tutor',
    subject: 'Medicine',
    standardQualifications: ['MD', 'MCAT Coach', 'Clinical Experience'],
    customQualifications: ['Practicing Surgeon', 'Medical School Admissions Committee Member'],
    imageColor: 'hsl(355, 60%, 45%)',
  },
  {
    id: '14',
    name: 'Thomas Berg',
    bio: 'Organic chemistry specialist who makes complex reactions intuitive. Known for his innovative teaching methods and memorable mnemonics.',
    position: 'Tutor',
    subject: 'Chemistry',
    standardQualifications: ['PhD Chemistry', 'Organic Chemistry Specialist', 'Lab Certified'],
    customQualifications: ['Pharmaceutical Industry Consultant', 'Chemistry Curriculum Developer'],
    imageColor: 'hsl(45, 80%, 45%)',
  },
  {
    id: '15',
    name: 'Grace Nakamura',
    bio: 'Economics and finance educator with Wall Street experience. Helps students understand global markets and develop analytical thinking skills.',
    position: 'Tutor',
    subject: 'Economics',
    standardQualifications: ['MBA', 'CFA', 'Financial Analyst'],
    customQualifications: ['Former Goldman Sachs Analyst', 'Economic Policy Advisor'],
    imageColor: 'hsl(180, 50%, 40%)',
  },
  {
    id: '16',
    name: 'Dr. Robert Clarke',
    bio: 'Curriculum development specialist with expertise across multiple subjects. Leads our academic program design and quality assurance initiatives.',
    position: 'Management',
    subject: 'General',
    standardQualifications: ['Teaching Certification', 'Curriculum Developer', 'IB Examiner'],
    customQualifications: ['Education PhD', 'Former School Principal'],
    imageColor: 'hsl(210, 40%, 50%)',
  },
];

export function TutorProvider({ children }: { children: React.ReactNode }) {
  const [tutors, setTutors] = useState<Tutor[]>(initialTutors);

  const addTutor = useCallback((tutor: Omit<Tutor, 'id' | 'imageColor'>) => {
    const newTutor: Tutor = {
      ...tutor,
      id: generateId(),
      imageColor: generateColor(),
    };
    setTutors((prev) => [...prev, newTutor]);
  }, []);

  const updateTutor = useCallback((id: string, tutor: Omit<Tutor, 'id' | 'imageColor'>) => {
    setTutors((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...tutor } : t))
    );
  }, []);

  const deleteTutor = useCallback((id: string) => {
    setTutors((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <TutorContext.Provider value={{ tutors, addTutor, updateTutor, deleteTutor }}>
      {children}
    </TutorContext.Provider>
  );
}

export function useTutors() {
  const context = useContext(TutorContext);
  if (context === undefined) {
    throw new Error('useTutors must be used within a TutorProvider');
  }
  return context;
}
