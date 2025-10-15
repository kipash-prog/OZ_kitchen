import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PriceSelection() {
  const navigate = useNavigate();
  const [subscriptionType, setSubscriptionType] = useState<"monthly" | "weekly">("monthly");
  const [price, setPrice] = useState("");

  const handleNext = () => {
    if (price) {
      navigate("/packaging", { state: { subscriptionType, price } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-secondary flex items-center px-4 py-3 md:px-8 md:py-4">
        <div className="flex items-center gap-3 flex-1">
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/ca87422a8faf30fea1aaea80c57344f579cee4ef?width=258" 
            alt="OZ Kitchen" 
            className="w-20 h-20 md:w-24 md:h-24 object-contain"
          />
          <h1 className="text-oz-gray-light text-sm md:text-base lg:text-lg font-semibold leading-tight">
            Fresh, Affordable Lunchboxes<br />Delivered to You
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 py-6 md:px-8 md:py-12 max-w-5xl mx-auto w-full">
        <div className="w-full max-w-md bg-card rounded-2xl p-6 md:p-8 space-y-6">
          {/* Segmented Control */}
          <div className="relative bg-white border border-oz-gray-border rounded-full p-0.5 flex">
            <button
              onClick={() => setSubscriptionType("monthly")}
              className={`flex-1 py-3 px-8 rounded-full text-base font-semibold transition-all duration-200 ${
                subscriptionType === "monthly"
                  ? "bg-primary text-white"
                  : "text-oz-gray-text"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSubscriptionType("weekly")}
              className={`flex-1 py-3 px-8 rounded-full text-base font-semibold transition-all duration-200 ${
                subscriptionType === "weekly"
                  ? "bg-primary text-white"
                  : "text-oz-gray-text"
              }`}
            >
              Weekly
            </button>
          </div>

          {/* Description */}
          <p className="text-foreground text-base leading-relaxed">
            Get 5 fresh lunchboxes every week. Perfect for busy weekdays, at just ranging price of 799ETB - 1290ETB per week. Delivered daily, fresh and warm.
          </p>

          {/* Price Input */}
          <div className="space-y-3">
            <label htmlFor="price" className="block text-base font-medium text-foreground">
              Enter Price you afford
            </label>
            <input
              id="price"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Eg. 1000"
              className="w-full px-4 py-3.5 border border-oz-gray-border rounded-lg bg-card text-foreground placeholder:text-oz-gray-placeholder focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold text-base py-4 rounded-full transition-all duration-200 active:scale-95"
          >
            Next
          </button>
        </div>
      </main>

      {/* Bottom Navigation Dots */}
      <div className="py-6 flex flex-col items-center gap-3">
        <div className="flex gap-5">
          <div className="w-3 h-3 rounded-full bg-accent"></div>
          <div className="w-3 h-3 rounded-full bg-oz-gray-border"></div>
          <div className="w-3 h-3 rounded-full bg-oz-gray-border"></div>
          <div className="w-3 h-3 rounded-full bg-oz-gray-border"></div>
        </div>
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
}
