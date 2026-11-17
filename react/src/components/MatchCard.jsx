import { useState } from 'react';

function MatchCard(props) {
  const [booked, setBooked] = useState(false);

  function handleBooking() {
    setBooked(!booked);
  }

  return (
    <div className="card">
      <h3>{props.teams}</h3>
      <p><strong>Date:</strong> {props.date}</p>
      <p><strong>Time:</strong> {props.time}</p>
      <p><strong>Venue:</strong> {props.venue}</p>
      <p><strong>Price:</strong> {props.price}</p>
      <button className="book-btn" onClick={handleBooking}>
        {booked ? 'Booked' : 'Book'}
      </button>
    </div>
  );
}

export default MatchCard;

