interface ProgressBarProps {
  label: string;
  value: number;
  maxValue?: number;
}

export function ProgressBar({ label, value, maxValue = 5 }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-body text-sm font-medium text-foreground">{label}</span>
        <span className="font-body text-sm text-muted-foreground">{value}/{maxValue}</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: maxValue }).map((_, index) => (
          <div
            key={index}
            className={`h-3 flex-1 rounded-sm transition-all duration-500 ${
              index < value
                ? 'bg-primary'
                : 'bg-muted'
            }`}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
