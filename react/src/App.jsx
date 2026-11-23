import { useState, useEffect } from 'react';
import supabase from './supabase.js';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MatchCard from './components/MatchCard';
import './App.css';

function formatBookingId(booking) {
  const match = (booking.match_title || 'IPL').toUpperCase().replace(/\s+/g, '');
  let teams = 'IPL';
  let venue = 'STAD';

  if (match.includes('RCB') && match.includes('CSK')) {
    teams = 'RCB-CSK';
    venue = 'BLR';
  } else if (match.includes('RCB') && match.includes('KKR')) {
    teams = 'RCB-KKR';
    venue = 'BLR';
  } else if (match.includes('MI') && match.includes('KKR')) {
    teams = 'MI-KKR';
    venue = 'MUM';
  } else if (match.includes('CSK') && match.includes('MI')) {
    teams = 'CSK-MI';
    venue = 'MUM';
  } else if (match.includes('CSK') && match.includes('RR')) {
    teams = 'CSK-RR';
    venue = 'CHE';
  } else if (match.includes('GT') && match.includes('RR')) {
    teams = 'GT-RR';
    venue = 'AHM';
  } else if (match.includes('SRH') && match.includes('DC')) {
    teams = 'SRH-DC';
    venue = 'HYD';
  } else if (match.includes('LSG') && match.includes('PBKS')) {
    teams = 'LSG-PBKS';
    venue = 'LKN';
  } else {
    teams = (booking.match_title || 'IPL').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase();
  }

  const idNum = booking.id || 1;
  const cnfCode = 10000 + (idNum * 389) % 90000;
  return `IPL26-${teams}-${venue}-TXN${cnfCode}`;
}

function App() {
  const [matches, setMatches] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  async function fetchMatches() {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      setErrorMessage(error.message);
    } else if (data) {
      setMatches(data);
      setErrorMessage('');
    }
  }

  async function fetchBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data) {
      setBookings(data);
    }
  }

  useEffect(() => {
    fetchMatches();
    fetchBookings();

    const matchesChannel = supabase
      .channel('matches-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches' },
        () => {
          fetchMatches();
        }
      )
      .subscribe();

    const bookingsChannel = supabase
      .channel('bookings-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(matchesChannel);
      supabase.removeChannel(bookingsChannel);
    };
  }, []);

  return (
    <div>
      <Navbar />
      <Hero />

      <section className="container">
        <h2>About IPL 2026</h2>
        <p>
          Indian Premier League is one of the most exciting cricket tournaments in the world.
        </p>

        <h3>Popular Teams</h3>
        <ul>
          <li>Royal Challengers Bengaluru</li>
          <li>Chennai Super Kings</li>
          <li>Mumbai Indians</li>
          <li>Kolkata Knight Riders</li>
          <li>Rajasthan Royals</li>
          <li>Sunrisers Hyderabad</li>
        </ul>

        <h3>Major Match Venues</h3>
        <ul>
          <li>M. Chinnaswamy Stadium, Bengaluru</li>
          <li>Wankhede Stadium, Mumbai</li>
          <li>MA Chidambaram Stadium, Chennai</li>
          <li>Eden Gardens, Kolkata</li>
          <li>Narendra Modi Stadium, Ahmedabad</li>
        </ul>
      </section>

      <section className="container" id="matches">
        <h2>Match Schedule</h2>
        {errorMessage && (
          <div className="booking-alert" style={{ backgroundColor: '#f8d7da', color: '#721c24', borderColor: '#f5c6cb' }}>
            Database Error: {errorMessage}
          </div>
        )}
        <div className="matches-grid">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
            />
          ))}
        </div>
      </section>

      <section className="container" id="mybookings">
        <h2>My Ticket Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings available yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Match</th>
                <th>Name</th>
                <th>Tickets</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td><strong>{formatBookingId(b)}</strong></td>
                  <td>{b.match_title}</td>
                  <td>{b.user_name}</td>
                  <td>{b.tickets}</td>
                  <td>₹{b.total_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="container" id="guidelines">
        <h2>Stadium Guidelines</h2>
        <div className="guidelines">
          <div className="card">
            <h3>Ticket Verification</h3>
            <p>Carry your valid ticket for entry into the stadium.</p>
          </div>
          <div className="card">
            <h3>ID Proof Requirement</h3>
            <p>Bring a valid government-issued ID proof.</p>
          </div>
          <div className="card">
            <h3>Prohibited Items</h3>
            <p>Weapons, alcohol, and dangerous items are not allowed.</p>
          </div>
        </div>
      </section>

      <footer>
        <p>© 2026 IPL Ticket Booking. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
