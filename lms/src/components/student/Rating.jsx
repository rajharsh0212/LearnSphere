import React, { useEffect, useState } from "react";

const RatingDisplay = ({ rating = 0, onRate }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating);

  useEffect(() => {
    setSelectedRating(rating);
  }, [rating]);

  const activeRating = hoveredRating || selectedRating || rating;

  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= activeRating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => {
              setSelectedRating(starValue);
              onRate?.(starValue);
            }}
            onMouseEnter={() => setHoveredRating(starValue)}
            onMouseLeave={() => setHoveredRating(0)}
            className={`text-xl sm:text-2xl leading-none transition-all duration-150 ${
              onRate ? "cursor-pointer hover:scale-110" : "cursor-default"
            } ${isActive ? "text-yellow-400" : "text-gray-300"}`}
            aria-label={`Rate ${starValue} out of 5`}
          >
            &#9733;
          </button>
        );
      })}
    </div>
  );
};

export default RatingDisplay;