import React from "react";
import { useDarkMode } from "../../context/DarkModeContext";

const CompanyLogo = ({
  image,
  link,
  title,
  className,
  imageClassName,
}) => {
  const { isDarkMode } = useDarkMode();
  return (
    <a href={link} className={`flex items-center gap-3 ${className}`}>
      <img
        src={image.url}
        alt={image.alt}
        className={imageClassName}
      />
      {title && (
        <span className={`text-3xl font-bold tracking-tighter whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </span>
      )}
    </a>
  );
};

export default CompanyLogo;
