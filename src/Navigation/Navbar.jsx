import React, {useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';


const Navbar = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
      setMenuOpen(!isMenuOpen);
    };
    
    return (
     

        <main>

        <div className = 'menu-container'>
          <div className = 'menu-button-left'>
          <button className = 'menu-button'>
          <Link to="/">WildCalendar</Link>
          </button>
          </div>
  
          <div className='menu-button-right'>
            <button onClick={toggleMenu} className="menu-button">
              menu
            </button>
            {/* <svg width="20px" height="20px" viewBox="0 -2 20 20" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#0000FF" fillRule="evenodd" d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"></path> </g></svg>           */}
  
            {isMenuOpen && (
              <div className='menu'>
                <Link to="/calendar">calendar</Link>

                <Link to="/todo">todo</Link>
              </div>
            )}
          </div>
        </div>
      </main>
    );
}

export default Navbar