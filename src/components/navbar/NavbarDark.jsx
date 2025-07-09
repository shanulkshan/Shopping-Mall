import React, { useEffect, useState } from "react";
import CompanyLogo from "../CompanyLogo/CompanyLogo";
import Menu from "./Menu";
import Button from "../Button/Button";
import NavbarData from "../../data/NavbarData";

const NavbarDark = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative z-40 animate-fade">
      <nav
        className={`z-40 w-full fixed text-white ${
          !isMenuOpen === true ? "" : "bg-black"
        } ${
          scrolled ? "bg-black py-4" : "bg-black py-7"
        } transition-all duration-700 ease-in-out`}
      >

      {/* Menu for Large screen */}
        <div className="fl-container flex flex-row items-center justify-between px-4 xl:px-0">
          <div className="inline-flex items-center">
            <CompanyLogo
              imageClassName="w-auto"
              className="mr-8"
              size={NavbarData.logo.size}
              image={{
                url: NavbarData.logo.image.url,
                alt: NavbarData.logo.image.alt,
              }}
              link={NavbarData.logo.link}
            />
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Menu className="hidden md:flex" links={NavbarData?.menuItems} />
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <a href={"/employer"} className=" flex gap-2">
              <Button
                bgColor="transparent linear-gradient(105deg, #e9ad0d 0%, #e15603 100%) 0% 0% no-repeat padding-box"
                hoverColor="transparent linear-gradient(105deg, #e15603 0%, #e9ad0d 100%) 0% 0% no-repeat padding-box"
              >
                Register
              </Button>
            </a>
            <a href={"/login"} className=" flex gap-2">
              <Button>Login</Button>
            </a>
          </div>

          <div className="flex md:hidden">
            <button onClick={handleMenuOpen}>
              {!isMenuOpen === true ? (
                <img
                  src="/icons/menu.svg"
                  width={40}
                  height={40}
                  alt="hamburger-icon"
                  className=""
                />
              ) : (
                <img
                  src="/icons/close.svg"
                  width={40}
                  height={40}
                  alt="close-icon"
                />
              )}
            </button>
          </div>
        </div>

        {/* Menu for mobile devices / small screens */}
        {isMenuOpen && (
          <>
            <div className="bg-black absolute block w-full shadow-lg md:hidden">
              <Menu
                className="flex flex-col gap-y-0 pt-6 animate-fade"
                linkClassNames="hover:bg-blue-600 py-4 px-6 hover:text-black"
                links={NavbarData?.menuItems}
                onLinkClick={() => setIsMenuOpen(false)}
              />
              <div className="flex gap-2 pb-10 pl-6 pr-6 pt-4 *:w-full animate-fade">
                <a
                  onClick={handleMenuOpen}
                  href={"/employer"}
                  className="*:w-full"
                >
                  <Button>Reach out to us</Button>
                </a>
              </div>
            </div>
          </>
        )}
      </nav>
      {isMenuOpen && (
        <div
          onClick={handleMenuOpen}
          className="fixed top-20 -z-10 h-screen w-screen bg-black opacity-60 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default NavbarDark;
