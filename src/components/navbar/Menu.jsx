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
          className={`font-light transition-colors lg:hover:text-blue-600 ${
            isDarkMode ? 'text-gray-200' : 'text-h1-black'
          } ${props.linkClassNames}`}
          to={link.link}
          onClick={props.onLinkClick}
        >
          <li>{link.title}</li>
        </Link>
      ))}
    </ul>
  );
};

export default Menu;
