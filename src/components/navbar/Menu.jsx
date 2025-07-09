import React from "react";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext";

const Menu = (props) => {
  const { isDarkMode } = useDarkMode();

  return (
    <ul className={`flex flex-row gap-16 ${props.className}`}>
      {props.links.map((link, index) => (
        <Link
          key={index}
          className={`text-lg font-poppins font-semibold transition-all duration-300 lg:hover:text-blue-600 lg:hover:border-b-2 lg:hover:border-blue-600 lg:hover:pb-1 lg:hover:scale-105 ${
            isDarkMode ? 'text-gray-200' : 'text-h1-black'
          } ${props.linkClassNames}`}
          to={link.link}
          onClick={props.onLinkClick}
        >
          <li className="tracking-wide">{link.title}</li>
        </Link>
      ))}
    </ul>
  );
};

export default Menu;
