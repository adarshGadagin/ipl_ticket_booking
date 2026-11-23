function MatchCard({ match }) {
  const matchTitle = match.teams || `${match.team1} vs ${match.team2}`;
  const isSoldOut = match.available_seats <= 0;
  const bookingUrl = `booking.html?match=${encodeURIComponent(matchTitle)}`;

  return (
    <div className="match-card">
      <div className="match-card-header">
        <span className="match-badge">Match {match.id}</span>
        <span className="match-date">{match.date}</span>
      </div>
      <h3 className="match-teams">{matchTitle}</h3>
      <p className="match-venue">{match.venue}</p>
      <div className="match-prices">
        <span className="price-chip">Price: ₹{match.price}</span>
        <span className="price-chip">Seats: {match.available_seats}</span>
      </div>
      {isSoldOut ? (
        <button className="book-btn" disabled>
          Sold Out
        </button>
      ) : (
        <a href={bookingUrl} className="btn book-btn">
          Book Tickets
        </a>
      )}
    </div>
  );
}

export default MatchCard;
