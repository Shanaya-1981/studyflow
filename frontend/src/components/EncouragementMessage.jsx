import PropTypes from 'prop-types';

function EncouragementMessage({ streak }) {
  if (streak > 0) return null;

  return (
    <div className="encouragement">
      <h3>💙 You missed yesterday</h3>
      <p>That's totally okay! Life happens. Here's how to get back on track:</p>
      <ul>
        <li>Try studying on the weekend when you have more time</li>
        <li>Use your commute (bus/train) to review flashcards</li>
        <li>Even 30 minutes counts - you don't need the full 2 hours</li>
      </ul>
      <p style={{marginTop: '15px', fontWeight: '600'}}>
        Ready to restart your streak? You've got this! 💪
      </p>
    </div>
  );
}

EncouragementMessage.propTypes = {
  streak: PropTypes.number.isRequired
};

export default EncouragementMessage;