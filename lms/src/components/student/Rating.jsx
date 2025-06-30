import React from "react";

const RatingDisplay = ({ rating }) => {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            className={`text-xl sm:text-2xl transition-colors ${
              starValue <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

export default RatingDisplay;