import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function AnimatedToggle({
  checked,
  onCheckedChange,
  label,
  disabled = false,
  className,
}: AnimatedToggleProps) {
  return (
    <label
      className={cn(
        "group flex cursor-pointer items-center gap-3",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <motion.button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onCheckedChange(!checked)}
        className={cn(
          "relative h-7 w-12 rounded-full p-1 transition-colors duration-300",
          checked
            ? "bg-primary shadow-glow"
            : "bg-muted"
        )}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          className="block h-5 w-5 rounded-full bg-card shadow-md"
          initial={false}
          animate={{
            x: checked ? 20 : 0,
            scaleX: 1,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          whileTap={{
            scaleX: 1.2,
            scaleY: 0.9,
          }}
        />
      </motion.button>
      {label && (
        <span className="font-body text-sm text-foreground transition-colors group-hover:text-primary">
          {label}
        </span>
      )}
    </label>
  );
}
