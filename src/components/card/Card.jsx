import PropTypes from 'prop-types';
import './Card.css';

const Card = ({ image, code }) => {
  return (
    <img src={image} alt={code} />
  );
};

Card.proptTypes = {
  image: PropTypes.string,
  code: PropTypes.string
};

export default Card;