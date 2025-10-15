import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface MealCalendarProps {
  meal: {
    id: string;
    name: string;
    image: string;
    category?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToDate: (dates: Date[]) => void;
}

export default function MealCalendar({ meal, isOpen, onClose, onAddToDate }: MealCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  if (!isOpen || !meal) return null;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert to Monday = 0

    const days: (number | null)[] = [];
    
    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    // Add days from next month to fill the grid
    const remainingSlots = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= remainingSlots; i++) {
      days.push(i);
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const toggleDate = (day: number | null) => {
    if (day === null) return;
    
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = clickedDate.toISOString().split('T')[0];
    
    setSelectedDates(prev => {
      const exists = prev.some(d => d.toISOString().split('T')[0] === dateString);
      if (exists) {
        return prev.filter(d => d.toISOString().split('T')[0] !== dateString);
      } else {
        return [...prev, clickedDate];
      }
    });
  };

  const isDateSelected = (day: number | null) => {
    if (day === null) return false;
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = checkDate.toISOString().split('T')[0];
    return selectedDates.some(d => d.toISOString().split('T')[0] === dateString);
  };

  const handleAdd = () => {
    if (selectedDates.length > 0) {
      onAddToDate(selectedDates);
      setSelectedDates([]);
      onClose();
    }
  };

  const getDaysInCurrentMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  };

  const isNextMonth = (index: number) => {
    const daysInMonth = getDaysInCurrentMonth();
    const startingDayOfWeek = (new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() + 6) % 7;
    return index >= startingDayOfWeek + daysInMonth;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-4 pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Meal Header */}
        <div className="bg-white rounded-lg shadow-sm p-2 flex items-center gap-2.5 mb-2.5">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-foreground">{meal.name}</h3>
            {meal.category && (
              <p className="text-xs text-foreground">{meal.category}</p>
            )}
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-oz-gray-light rounded-md p-4 mb-2">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={goToPreviousMonth}
              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold text-foreground">{monthYear}</h3>
            <button
              onClick={goToNextMonth}
              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs text-foreground/50 font-normal">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.slice(0, 35).map((day, index) => {
              const isSelected = isDateSelected(day);
              const isNext = isNextMonth(index);
              
              return (
                <button
                  key={index}
                  onClick={() => toggleDate(day)}
                  disabled={day === null}
                  className={`
                    aspect-square flex items-center justify-center text-sm rounded-full transition-all
                    ${day === null ? 'invisible' : ''}
                    ${isNext ? 'opacity-50' : ''}
                    ${isSelected 
                      ? 'bg-primary text-white font-medium' 
                      : 'text-foreground hover:bg-gray-200'
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="px-2 mb-2">
          <p className="text-sm text-foreground mb-1">
            Choose a date and add {meal.name} on your meal plan
          </p>
          <p className="text-sm text-oz-gray-placeholder">
            {selectedDates.length} added
          </p>
        </div>

        {/* Add Button */}
        <div className="flex justify-end px-2">
          <button
            onClick={handleAdd}
            disabled={selectedDates.length === 0}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-3 py-2.5 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Add</span>
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
