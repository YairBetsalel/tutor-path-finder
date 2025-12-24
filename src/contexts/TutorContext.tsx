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
    standardQualifications: ['PhD Mathematics', 'Calculus Specialist'],
    customQualifications: ['Award-winning Educator 2023'],
    imageColor: 'hsl(175, 75%, 25%)',
  },
  {
    id: '2',
    name: 'James Chen',
    bio: 'Expert in computer science and programming. Former software engineer at Google with a passion for teaching the next generation of developers.',
    position: 'Tutor',
    subject: 'Computer Science',
    standardQualifications: ['MSc Computer Science', 'Software Engineer'],
    customQualifications: ['Ex-Google Engineer', 'Open Source Contributor'],
    imageColor: 'hsl(220, 60%, 50%)',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    bio: 'Dedicated law tutor with experience in both academic and practical legal education. Helps students excel in their legal studies and bar preparations.',
    position: 'Tutor',
    subject: 'Law',
    standardQualifications: ['LLM', 'Bar Certified'],
    customQualifications: ['Specialist in Patent Law for Startups'],
    imageColor: 'hsl(340, 60%, 50%)',
  },
  {
    id: '4',
    name: 'Dr. Michael Thompson',
    bio: 'Medical educator specializing in pre-med preparation and UCAT coaching. Has helped hundreds of students achieve their dreams of medical school admission.',
    position: 'Tutor',
    subject: 'Medicine',
    standardQualifications: ['MD', 'UCAT Coach'],
    customQualifications: ['500+ Students Placed in Med School'],
    imageColor: 'hsl(150, 50%, 40%)',
  },
  {
    id: '5',
    name: 'Rachel Kim',
    bio: 'Cambridge curriculum specialist with expertise in sciences and mathematics. IB examiner with deep understanding of assessment criteria.',
    position: 'Tutor',
    subject: 'Chemistry',
    standardQualifications: ['PhD Chemistry', 'Lab Certified'],
    customQualifications: ['IB Examiner', 'Cambridge PGCE'],
    imageColor: 'hsl(43, 74%, 50%)',
  },
  {
    id: '6',
    name: 'David Patel',
    bio: 'NCEA and IB expert with a focus on Economics and Business Studies. Helps students develop critical thinking and analytical skills.',
    position: 'Management',
    subject: 'Economics',
    standardQualifications: ['MBA', 'CFA'],
    customQualifications: ['Former Investment Banker', 'Business Strategy Consultant'],
    imageColor: 'hsl(280, 50%, 50%)',
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
