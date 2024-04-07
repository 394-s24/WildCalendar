/* eslint-disable react/no-unknown-property */
import { useState, useEffect } from 'react';
import Logo from "@/assets/CalendarIcon.png"
import { Button } from "@/components/ui/button"

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    console.log(isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    // add event listener
    window.addEventListener('scroll', handleScroll);

    // clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`bg-white border-b z-50 px-6 sm:px-8 ${scrolled && "border-b-2"} ${scrolled && !isMobileMenuOpen && "py-2"} ${!scrolled && isMobileMenuOpen ? "" : "transition-colors duration-300"} ${!scrolled && isMobileMenuOpen && "border-b-2"} ${scrolled || isMobileMenuOpen ? 'py-4' : 'py-4'}`}>
      {/* Mobile Menu */}
      <div className={`sm:hidden justify-center relative z-0 top-full gap-4 sm:gap-0 right-0 left-0 text-viridian flex flex-row items-center py-4 transition-all ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-[100%] opacity-0 max-h-[0px]'}`}>
        <a href="/#how-it-works" className="border-2 rounded-full px-4 py-1 mx-4 hover:opacity-75 transition-all duration-300" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>How it Works</a>
        <a href="/#get-notified" className="flex justify-center items-center bg-black text-white rounded-full px-5 py-2 mx-4 hover:opacity-90 transition-all duration-300" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <p className='text-white'>Get Notified</p>
        </a>
      </div>

      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a href="/" className='flex gap-4 items-center w-10'>
          <img src={Logo} alt="WildCalendar" />
          <p>WildCalendar</p>
        </a>


        {/* Navbar Buttons */}
        <div className="hidden sm:flex gap-2 items-center">
          <a href="/todo">
            <Button variant="outline">Todo</Button>
          </a>
          <a href="/calendar" className="flex justify-center items-center rounded-full hover:opacity-90 transition-all duration-300">
            <Button>Calendar</Button>
          </a>
        </div>

        {/* Hamburger Icon */}
        <button className={`menu-btn sm:hidden ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
