import { useState } from 'react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header>
      <nav>
        <h2 className="pghead">IPL 2026</h2>
        <button
          className={`hamburger ${isOpen ? 'open' : ''}`}
          id="hamburger"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <ul id="nav-links" className={`nav-links ${isOpen ? 'active' : ''}`}>
          <li><a href="#matches" onClick={() => setIsOpen(false)}>Matches</a></li>
          <li><a href="booking.html" onClick={() => setIsOpen(false)}>Book Ticket</a></li>
          <li><a href="#mybookings" onClick={() => setIsOpen(false)}>My Bookings</a></li>
          <li><a href="#guidelines" onClick={() => setIsOpen(false)}>Guidelines</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
