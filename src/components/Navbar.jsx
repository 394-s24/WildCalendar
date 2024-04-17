import * as React from "react";
import { useState, useEffect } from "react";
import {
  Avatar,
  Tooltip,
  MenuItem,
  Box,
  IconButton,
  Typography,
  Menu,
} from "@mui/material";
import Logo from "@/assets/CalendarIcon.png";
import { Button } from "@/components/Button";
import { Link } from "react-router-dom";

const ButtonLink = ({ href, variant, children }) => (
  <Link
    to={href}
    className="hidden sm:flex rounded-full hover:opacity-90 transition-all duration-300"
  >
    <Button variant={variant}>{children}</Button>
  </Link>
);

const NavLink = ({ href, className, children }) => (
  <Link
    to={href}
    className={`flex justify-center items-center hover:opacity-90 transition-all duration-300 w-full ${className}`}
    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  >
    {children}
  </Link>
);

const userMenu = ["Profile", "Account", "Dashboard", "Logout"];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    console.log(isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    // add event listener
    window.addEventListener("scroll", handleScroll);

    // clean up the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed w-full bg-white border-b z-50 px-6 sm:px-8 ${
        scrolled && "border-b-2"
      } ${scrolled && !isMobileMenuOpen && "py-2"} ${
        !scrolled && isMobileMenuOpen ? "" : "transition-colors duration-300"
      } ${!scrolled && isMobileMenuOpen && "border-b-2"} ${
        scrolled || isMobileMenuOpen ? "py-4" : "py-4"
      }`}
    >
      <div className="mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex gap-4 items-center w-10 order-3 sm:order-1"
        >
          <img src={Logo} alt="WildCalendar" />
          <p className="hidden sm:block text-2xl font-montserrat">
            WildCalendar
          </p>
        </Link>

        {/* Hamburger Icon */}
        <button
          className={`menu-btn order-1 sm:order-3 sm:hidden ${
            isMobileMenuOpen ? "open" : ""
          }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
        </button>

        <div className="flex sm:gap-6 order-3">
          <div className="flex gap-4 justify-evenly">
            <ButtonLink href="/todo" variant="default">
              Todo
            </ButtonLink>
            <ButtonLink href="/calendar" variant="outline">
              Calendar
            </ButtonLink>
            <ButtonLink href="/about" variant="outline">
              About
            </ButtonLink>
          </div>

          <Box sx={{ flexGrow: 0 }} className="">
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {userMenu.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </div>
      </div>
      <div
        className={`sm:hidden justify-center relative z-0 top-full gap-2 sm:gap-0 right-0 left-0 text-viridian flex flex-col items-center transition-all ${
          isMobileMenuOpen ? "pt-5 pb-0" : ""
        }`}
        style={{
          transition: "height 0.3s ease-in-out, opacity 0.3s ease-in-out",
          height: isMobileMenuOpen ? "12em" : "0",
          opacity: isMobileMenuOpen ? 1 : 0,
          overflow: "hidden",
        }}
      >
        <NavLink href="/calendar" className="bg-violet-950 text-white rounded-full px-5 py-2">
          Calendar
        </NavLink>
        <NavLink href="/todo" className="bg-gray-300 text-black rounded-full px-5 py-2">
          Todo List
        </NavLink>
        <div className="flex w-full justify-between gap-2">
          <NavLink
            href="/#get-notified"
            className="border border-gray-500 rounded-xl"
          >
            <p className="text-gray-500">How it Works</p>
          </NavLink>
          <NavLink
            href="/#get-notified"
            className="border border-gray-500 rounded-xl"
          >
            <p className="text-gray-500">Get Notified</p>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
