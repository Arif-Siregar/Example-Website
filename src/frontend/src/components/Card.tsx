import React from "react";
import { ReactNode } from "react";

interface CustomCardProps {
  children: ReactNode;
}

// Component is used to display card like information (i..e, texts etc.)
const Card: React.FC<CustomCardProps> = ({ children }) => {
  return (
    <div
        className="paper-bg hide-scroll shadow-md rounded-tr-lg rounded-bl-lg overflow-y-auto min-h-min p-4"
      >
       {children}
    </div>
  );
};

export default Card;
