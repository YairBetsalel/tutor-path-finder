import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isBefore, 
  startOfDay,
  addMonths,
  subMonths,
  getDay,
  isToday
} from 'date-fns';
import { cn } from '@/lib/utils';
import { AvailabilityDisplay } from '@/components/calendar/AvailabilityDisplay';
import { useTutorAvailability } from '@/hooks/useTutorAvailability';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfDay(new Date());

  const { availability, isLoading } = useTutorAvailability(currentMonth);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get the day of week the month starts on (0 = Sunday)
  const startDayOfWeek = getDay(monthStart);

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const isPastDay = (date: Date) => {
    return isBefore(date, today);
  };

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">Calendar Management</h1>
            <p className="mt-2 font-body text-muted-foreground">
              View tutor availability and manage lesson bookings.
            </p>
          </div>

          <Card className="shadow-medium">
            <CardContent className="p-6">
              {/* Month Navigation */}
              <div className="mb-6 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousMonth}
                  className="h-10 w-10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <div className="flex items-center gap-4">
                  <h2 className="font-display text-2xl font-semibold text-foreground">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToToday}
                    className="text-primary hover:text-primary/80"
                  >
                    Today
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextMonth}
                  className="h-10 w-10"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Weekday Headers */}
              <div className="mb-2 grid grid-cols-7 gap-1">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="py-2 text-center font-body text-sm font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: startDayOfWeek }).map((_, index) => (
                  <div key={`empty-start-${index}`} className="aspect-square" />
                ))}
                
                {/* Day cells */}
                {daysInMonth.map((day) => {
                  const isPast = isPastDay(day);
                  const isTodayDate = isToday(day);
                  const dateKey = format(day, 'yyyy-MM-dd');
                  const daySlots = availability[dateKey] || [];
                  
                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "min-h-[100px] rounded-lg border p-2 transition-colors",
                        isPast 
                          ? "border-transparent bg-muted/30" 
                          : "border-border bg-card hover:border-primary/50 hover:bg-accent/50 cursor-pointer",
                        isTodayDate && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex h-7 w-7 items-center justify-center rounded-full font-body text-sm",
                          isPast && "text-muted-foreground/50",
                          isTodayDate && "bg-primary text-primary-foreground font-semibold"
                        )}
                      >
                        {format(day, 'd')}
                      </span>
                      
                      {/* Show availability */}
                      {daySlots.length > 0 && (
                        <AvailabilityDisplay slots={daySlots} compact />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 flex flex-wrap items-center gap-6 border-t pt-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-muted/30" />
                  <span className="font-body text-sm text-muted-foreground">Past</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border border-border bg-card" />
                  <span className="font-body text-sm text-muted-foreground">Available for scheduling</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-primary" />
                  <span className="font-body text-sm text-muted-foreground">Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
