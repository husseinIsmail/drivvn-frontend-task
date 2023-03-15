import { useEffect, useState } from 'react';
import Card from '../../components/card/Card';
import './Snap.css';

const Snap = () => {
  const [deck, setDeck] = useState([]);
  const [cards, setCards] = useState([]);;
  const [currentCard, setCurrentCard] = useState(null);
  const [previousCard, setPreviousCard] = useState(null);

  useEffect(() => {
    const fetchDeck = async () => {
      // const deckResponse = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      // const fetchedDeck = await deckResponse.json();
      const fetchedDeck = { "success": true, "deck_id": "jcmouwp3wrt6", "remaining": 52, "shuffled": true };
      setDeck(fetchedDeck);
    };
    fetchDeck();
  }, []);

  const fetchCard = async () => {
    const drawResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);
    const fetchedDraw = await drawResponse.json();
    setCurrentCard(fetchedDraw.cards[0]);
    setPreviousCard(cards[cards.length - 1]);
    setCards([fetchedDraw.cards[0]]);
  };

  return (
    <div className='snap-container'>
      <div className='card-container'>
        <div className='card-frame'>
          {previousCard && <Card image={previousCard.image} code={previousCard.code} />}
        </div>
        <div className='card-frame'>
          {currentCard && <Card image={currentCard.image} code={currentCard.code} />}
        </div>
      </div>
      <div className='draw-btn'>
        <button onClick={fetchCard}>Draw card</button>
      </div>
    </div>
  );
};

export default Snap;