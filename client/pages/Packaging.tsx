import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, Minus, Plus, ChevronLeft } from "lucide-react";
import { format, parseISO } from "date-fns";
import MealCalendar from "@/components/MealCalendar";

interface MealOption {
  id: string;
  name: string;
  image: string;
  price: number;
  category?: string;
}

interface PlannedMeal {
  id: string;
  optionId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  dateISO: string;
  category?: string;
}

const mealOptions: MealOption[] = [
  {
    id: "1",
    name: "Shiro Ena Gomen",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop",
    price: 170,
    category: "Fasting",
  },
  {
    id: "2",
    name: "Misir Ena Shiro",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop",
    price: 170,
    category: "Fasting",
  },
  {
    id: "3",
    name: "Dinech Ena Gomen",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200&h=200&fit=crop",
    price: 170,
    category: "Regular",
  },
  {
    id: "4",
    name: "Tibs",
    image:
      "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=200&h=200&fit=crop",
    price: 170,
    category: "Regular",
  },
  {
    id: "5",
    name: "Firfir",
    image:
      "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=200&h=200&fit=crop",
    price: 170,
    category: "Fasting",
  },
];

const initialPlannedMeals: PlannedMeal[] = [
  {
    id: "1-2025-10-05",
    optionId: "1",
    name: "Shiro Ena Gomen",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop",
    price: 170,
    quantity: 1,
    dateISO: "2025-10-05",
    category: "Fasting",
  },
  {
    id: "2-2025-10-06",
    optionId: "2",
    name: "Misir Ena Shiro",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop",
    price: 170,
    quantity: 1,
    dateISO: "2025-10-06",
    category: "Fasting",
  },
  {
    id: "3-2025-10-07",
    optionId: "3",
    name: "Dinech Ena Gomen",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200&h=200&fit=crop",
    price: 170,
    quantity: 1,
    dateISO: "2025-10-07",
    category: "Regular",
  },
  {
    id: "4-2025-10-08",
    optionId: "4",
    name: "Tibs",
    image:
      "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=200&h=200&fit=crop",
    price: 170,
    quantity: 1,
    dateISO: "2025-10-08",
    category: "Regular",
  },
  {
    id: "3-2025-10-09",
    optionId: "3",
    name: "Dinech Ena Gomen",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200&h=200&fit=crop",
    price: 170,
    quantity: 1,
    dateISO: "2025-10-09",
    category: "Regular",
  },
];

const sortMealsByDate = (meals: PlannedMeal[]) =>
  [...meals].sort(
    (a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime(),
  );

export default function Packaging() {
  const navigate = useNavigate();
  const location = useLocation();
  const [subscriptionType, setSubscriptionType] = useState<
    "monthly" | "weekly"
  >("weekly");
  const [plannedMeals, setPlannedMeals] =
    useState<PlannedMeal[]>(initialPlannedMeals);
  const [selectedMealOption, setSelectedMealOption] =
    useState<MealOption | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const openCalendarForMeal = (meal: MealOption) => {
    setSelectedMealOption(meal);
    setIsCalendarOpen(true);
  };

  const closeCalendar = () => {
    setIsCalendarOpen(false);
    setSelectedMealOption(null);
  };

  const handleAddMealToDates = (dates: Date[]) => {
    if (!selectedMealOption) return;

    setPlannedMeals((prev) => {
      const updated = [...prev];

      dates.forEach((date) => {
        const iso = date.toISOString().split("T")[0];
        const existingIndex = updated.findIndex(
          (item) =>
            item.optionId === selectedMealOption.id && item.dateISO === iso,
        );

        if (existingIndex >= 0) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + 1,
          };
        } else {
          updated.push({
            id: `${selectedMealOption.id}-${iso}`,
            optionId: selectedMealOption.id,
            name: selectedMealOption.name,
            image: selectedMealOption.image,
            price: selectedMealOption.price,
            quantity: 1,
            dateISO: iso,
            category: selectedMealOption.category,
          });
        }
      });

      return sortMealsByDate(updated);
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setPlannedMeals((prev) =>
      sortMealsByDate(
        prev
          .map((meal) =>
            meal.id === id
              ? { ...meal, quantity: Math.max(0, meal.quantity + delta) }
              : meal,
          )
          .filter((meal) => meal.quantity > 0),
      ),
    );
  };

  const totalMeals = useMemo(
    () => plannedMeals.reduce((sum, meal) => sum + meal.quantity, 0),
    [plannedMeals],
  );

  const totalPrice = useMemo(
    () =>
      plannedMeals.reduce((sum, meal) => sum + meal.quantity * meal.price, 0),
    [plannedMeals],
  );

  const handleNext = () => {
    if (totalMeals > 0) {
      navigate("/receipt", {
        state: {
          subscriptionType: location.state?.subscriptionType,
          price: location.state?.price,
          meals: plannedMeals,
          totalPrice,
          totalMeals,
        },
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3FAFB]">
      {/* Header */}
      <header className="bg-[#19464C] flex items-center justify-between px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-9 h-9 text-[#E8E8E8]" strokeWidth={3} />
        </button>
        <div className="flex items-center gap-2.5">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/ca87422a8faf30fea1aaea80c57344f579cee4ef?width=258"
            alt="OZ Kitchen"
            className="w-32 h-32 object-contain"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center gap-1 px-4">
          <h1 className="text-[#F6F6F6] text-2xl font-medium">Meal Plan</h1>
          <p className="text-[#F6F6F6] text-base">Weekly Meal plan</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Meal Images Carousel */}
        <div className="flex gap-2.5 overflow-x-auto p-2 scrollbar-hide">
          {mealOptions.map((meal) => (
            <button
              key={`thumb-${meal.id}`}
              type="button"
              onClick={() => openCalendarForMeal(meal)}
              className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`Add ${meal.name}`}
            >
              <img
                src={meal.image}
                alt={meal.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Segmented Control */}
        <div className="px-2 py-2">
          <div className="relative bg-[#FEFAF6] border border-[#BDBDBD] rounded-full p-0.5 flex">
            <button
              onClick={() => setSubscriptionType("monthly")}
              className={`flex-1 py-3 px-8 rounded-full text-base font-semibold transition-all duration-200 ${
                subscriptionType === "monthly"
                  ? "bg-[#E9A044] text-[#F6F6F6]"
                  : "text-[#BDBDBD]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSubscriptionType("weekly")}
              className={`flex-1 py-3 px-8 rounded-full text-base font-semibold transition-all duration-200 ${
                subscriptionType === "weekly"
                  ? "bg-[#E9A044] text-[#F6F6F6]"
                  : "text-[#BDBDBD]"
              }`}
            >
              Weekly
            </button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="px-4 py-2">
          <div className="bg-white rounded-lg p-2.5 flex items-center justify-center">
            <div className="bg-[#E9A044] rounded-lg px-2 py-1">
              <span className="text-sm text-black">Oct 5 - 9</span>
            </div>
          </div>
        </div>

        {/* Meal List */}
        <div className="flex flex-col gap-2.5 px-4 py-2">
          {plannedMeals.length === 0 ? (
            <div className="bg-white rounded-lg p-4 text-sm text-foreground/70 text-center">
              Tap a meal above to add it to your plan.
            </div>
          ) : (
            plannedMeals.map((meal) => {
              const formattedDate = format(
                parseISO(meal.dateISO),
                "EEEE MMM d",
              );

              return (
                <div
                  key={meal.id}
                  className="bg-white rounded-lg p-2 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-11 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="text-sm font-medium text-black">
                        {meal.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5 text-[#1E1E1E]" />
                        <span className="text-xs text-black">
                          {formattedDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2">
                    <button
                      onClick={() => updateQuantity(meal.id, -1)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      aria-label={`Decrease ${meal.name}`}
                    >
                      <Minus className="w-6 h-6 text-[#1E1E1E]" />
                    </button>
                    <button
                      onClick={() => updateQuantity(meal.id, 1)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      aria-label={`Increase ${meal.name}`}
                    >
                      <Plus className="w-7 h-7 text-[#1E1E1E]" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Bottom Bar */}
      <div className="py-3 px-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col py-2 px-4">
            <span className="text-base font-medium text-black">
              {totalPrice} br
            </span>
            <span className="text-xs text-black">{totalMeals} meals</span>
          </div>
          <button
            onClick={handleNext}
            className="flex-1 bg-[#E9A044] hover:bg-[#E9A044]/90 text-white font-bold text-base py-3 px-8 rounded-xl transition-all duration-200 active:scale-95"
          >
            Next
          </button>
        </div>

        {/* Navigation Dots */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-5">
            <div className="w-3 h-3 rounded-full bg-[#5DB075]"></div>
            <div className="w-3 h-3 rounded-full bg-[#E8E8E8]"></div>
            <div className="w-3 h-3 rounded-full bg-[#E8E8E8]"></div>
            <div className="w-3 h-3 rounded-full bg-[#E8E8E8]"></div>
          </div>
          <div className="w-32 h-1.5 bg-black rounded-full"></div>
        </div>
      </div>

      {/* Meal Calendar Modal */}
      <MealCalendar
        meal={selectedMealOption}
        isOpen={isCalendarOpen}
        onClose={closeCalendar}
        onAddToDate={handleAddMealToDates}
      />
    </div>
  );
}
