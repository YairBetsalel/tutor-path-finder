import * as React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface QualificationChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  className?: string;
}

export function QualificationChip({
  label,
  selected,
  onToggle,
  className,
}: QualificationChipProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 font-body text-sm transition-colors",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5",
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <motion.span
        initial={false}
        animate={{
          width: selected ? "auto" : 0,
          opacity: selected ? 1 : 0,
          marginRight: selected ? 0 : -8,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <Check className="h-3.5 w-3.5" />
      </motion.span>
      {label}
    </motion.button>
  );
}
