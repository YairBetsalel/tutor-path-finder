import * as React from "react";
import { motion } from "framer-motion";
import { Search, FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  type?: "search" | "empty";
  className?: string;
}

export function EmptyState({
  title = "No results found",
  description = "Try adjusting your filters or search terms.",
  type = "search",
  className,
}: EmptyStateProps) {
  const Icon = type === "search" ? Search : FileQuestion;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        className="mb-6 rounded-full bg-muted p-6"
      >
        <Icon className="h-12 w-12 text-muted-foreground" />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-display text-xl font-semibold text-foreground"
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-2 max-w-sm font-body text-muted-foreground"
      >
        {description}
      </motion.p>
    </motion.div>
  );
}
