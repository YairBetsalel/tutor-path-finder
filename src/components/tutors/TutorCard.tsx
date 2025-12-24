import { motion } from "framer-motion";
import { Tutor } from '@/contexts/TutorContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface TutorCardProps {
  tutor: Tutor;
}

export function TutorCard({ tutor }: TutorCardProps) {
  const allQualifications = [...tutor.standardQualifications, ...tutor.customQualifications];

  return (
    <motion.div
      whileHover={{ 
        y: -5,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
    >
      <Card className="group h-full overflow-hidden shadow-soft transition-all duration-300 hover:shadow-medium">
        <CardHeader className="relative pb-0">
          <motion.div
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full font-display text-3xl font-bold text-primary-foreground"
            style={{ backgroundColor: tutor.imageColor }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {tutor.name.charAt(0)}
          </motion.div>
        </CardHeader>
        <CardContent className="pt-4 text-center">
          <h3 className="font-display text-lg font-semibold text-foreground">{tutor.name}</h3>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5">
            <Badge
              variant={tutor.position === 'Management' ? 'default' : 'secondary'}
            >
              {tutor.position}
            </Badge>
            <Badge variant="outline" className="bg-accent/10 text-accent-foreground">
              {tutor.subject}
            </Badge>
          </div>
          <p className="mt-3 font-body text-sm text-muted-foreground line-clamp-3">{tutor.bio}</p>
          
          {/* Standard Qualifications */}
          <div className="mt-4 flex flex-wrap justify-center gap-1">
            {tutor.standardQualifications.slice(0, 3).map((qual, index) => (
              <motion.span
                key={`std-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-full bg-primary/10 px-2 py-1 font-body text-xs text-primary"
              >
                {qual}
              </motion.span>
            ))}
          </div>
          
          {/* Custom Qualifications */}
          {tutor.customQualifications.length > 0 && (
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              {tutor.customQualifications.slice(0, 2).map((qual, index) => (
                <motion.span
                  key={`custom-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  className="rounded-full bg-secondary/20 px-2 py-1 font-body text-xs text-secondary"
                >
                  ✦ {qual}
                </motion.span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
