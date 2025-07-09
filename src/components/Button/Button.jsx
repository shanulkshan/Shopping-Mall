

import React, { useState } from "react";

function Button({
  children,
  bgColor = "var(--primary-gradient)",
  hoverColor = "var(--primary-gradient)",
  textColor = "white",
  onClick,
  className,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverColorNew, setHoverColor] = useState(bgColor);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setHoverColor(hoverColor); // Change to the hover color
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setHoverColor(bgColor); // Change back to the original color
  };

  return (
    <button
      className={`min-w-40 rounded-2xl px-8 py-3 text-md font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 border border-transparent hover:border-white/20 ${className}`}
      style={{
        background: hoverColorNew,
        color: textColor,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        backdropFilter: "blur(10px)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
