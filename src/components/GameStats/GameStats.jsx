import PropTypes from 'prop-types';
import './GameStats.css';

const GameStats = ({ snapValueCount, snapSuitCount }) => {
  return (
    <>
      <h2 className='no-margin'>GAME OVER!</h2>
      <h2 className='no-margin'>VALUE MATCHES: {snapValueCount}</h2>
      <h2 className='no-margin'>SUIT MATCHES: {snapSuitCount}</h2>
    </>
  )
};

GameStats.propTypes = {
  snapValueCount: PropTypes.number,
  snapSuitCount: PropTypes.number
};

export default GameStats;