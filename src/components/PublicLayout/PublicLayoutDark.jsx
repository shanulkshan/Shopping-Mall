import React from "react";
import Footer from "../footer/Footer";
import NavbarDark from "../navbar/NavbarDark";

const PublicLayoutDark = ({ children }) => {
  return (
    <>
      <NavbarDark />
      <div className="pt-20 min-h-[65vh]">{children}</div>
      <Footer />
    </>
  );
};

export default PublicLayoutDark;
