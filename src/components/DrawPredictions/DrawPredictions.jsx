import PropTypes from 'prop-types';
import './DrawPredictions.css';

const DrawPredictions = ({ snapSuitChance, snapValueChance, currentCardIndex, snapStatus }) => {
  return (
    <>
      <h2 className='snap-status'>{snapStatus}</h2>
      <div className='draw-predictions'>
        <span>Card {currentCardIndex} of 52</span>
        {currentCardIndex < 52 && (
          <>
            <span>Next Snap Suit Chance: {snapSuitChance}%</span>
            <span>Next Snap Value Chance: {snapValueChance}%</span>
          </>
        )}
      </div>
    </>
  )
};

DrawPredictions.propTypes = {
  snapSuitChance: PropTypes.number,
  snapValueChance: PropTypes.number,
  currentCardIndex: PropTypes.number,
  snapStatus: PropTypes.string
};

export default DrawPredictions;