import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function StreakCounter({ userName, onStreakLoaded }) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    async function fetchStreak() {
      const response = await fetch(`/api/progress/streak/${userName}`);
      const data = await response.json();
      setStreak(data.streak);
      
      // ADD THIS PART - Pass streak to parent
      if (onStreakLoaded) {
        onStreakLoaded(data.streak);
      }
    }
    
    fetchStreak();
  }, [userName, onStreakLoaded]);

  return (
    <div className="streak">
      <span className="streak-number">🔥 {streak}</span>
      <span className="streak-text">DAY STREAK</span>
    </div>
  );
}

StreakCounter.propTypes = {
  userName: PropTypes.string.isRequired,
  onStreakLoaded: PropTypes.func
};

export default StreakCounter;