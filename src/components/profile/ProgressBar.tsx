interface ProgressBarProps {
  label: string;
  value: number;
  maxValue?: number;
}

export function ProgressBar({ label, value, maxValue = 5 }: ProgressBarProps) {
  const displayValue = value.toFixed(1);
  const filledBars = Math.floor(value);
  const partialFill = (value - filledBars) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-body text-sm font-medium text-foreground">{label}</span>
        <span className="font-body text-sm text-muted-foreground">{displayValue}/{maxValue}</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: maxValue }).map((_, index) => (
          <div
            key={index}
            className="relative h-3 flex-1 overflow-hidden rounded-sm bg-muted"
          >
            <div
              className="absolute inset-0 bg-primary transition-all duration-500"
              style={{
                width: index < filledBars 
                  ? '100%' 
                  : index === filledBars 
                    ? `${partialFill}%` 
                    : '0%',
                animationDelay: `${index * 100}ms`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
