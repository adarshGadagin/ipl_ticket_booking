import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MatchCard from './components/MatchCard';
import './App.css';

function App() {
  const matches = [
    {
      id: 1,
      teams: 'RCB vs CSK',
      date: '10 April 2026',
      time: '7:30 PM',
      venue: 'Bengaluru',
      price: '₹800'
    },
    {
      id: 2,
      teams: 'MI vs KKR',
      date: '12 April 2026',
      time: '7:30 PM',
      venue: 'Mumbai',
      price: '₹1000'
    },
    {
      id: 3,
      teams: 'CSK vs RR',
      date: '14 April 2026',
      time: '3:30 PM',
      venue: 'Chennai',
      price: '₹700'
    }
  ];

  return (
    <div>
      <Navbar />
      <Hero />

      <section className="container" id="matches">
        <h2>Match Schedule</h2>
        <div className="matches-list">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              teams={match.teams}
              date={match.date}
              time={match.time}
              venue={match.venue}
              price={match.price}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
