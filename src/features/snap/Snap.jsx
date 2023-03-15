import { useEffect, useLayoutEffect, useState } from 'react';
import Card from '../../components/card/Card';
import { debounce } from 'lodash';
import './Snap.css';

const Snap = () => {
  const [deck, setDeck] = useState([]);
  const [cards, setCards] = useState([]);;
  const [currentCard, setCurrentCard] = useState(null);
  const [previousCard, setPreviousCard] = useState(null);
  const [matchStatus, setMatchStatus] = useState(null);
  const [snapSuitCount, setSnapSuitCount] = useState(0);
  const [snapValueCount, setSnapValueCount] = useState(0);
  const [allCardsWithdrawn, setAllCardsWithdrawn] = useState(false);

  useEffect(() => {
    const fetchDeck = async () => {
      // const deckResponse = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      // const fetchedDeck = await deckResponse.json();
      const fetchedDeck = { "success": true, "deck_id": "jcmouwp3wrt6", "remaining": 52, "shuffled": true };
      setDeck(fetchedDeck);
    };
    fetchDeck();
  }, []);

  useLayoutEffect(() => {
    const checkMatchingCards = () => {
      console.log('here', currentCard, previousCard);
      if (currentCard.suit === previousCard.suit) {
        setSnapSuitCount(snapSuitCount => snapSuitCount + 1);
        setMatchStatus('SNAP SUIT!');
      } else if (currentCard.value === previousCard.value) {
        setSnapValueCount(snapValueCount => snapValueCount + 1);
        setMatchStatus('SNAP VALUE!');
      } else {
        setMatchStatus('');
      }
    }

    if (currentCard && previousCard) {
      checkMatchingCards();
    }

  }, [currentCard, previousCard]);


  const drawCard = async () => {
    const fetchedDraw = await fetchDraw();
    const fetchedCard = fetchedDraw.cards[0];
    const isLastCard = fetchedDraw.remaining === 0;

    if (isLastCard) setAllCardsWithdrawn(true);
    setCurrentCard(fetchedCard);
    setPreviousCard(cards[cards.length - 1]);
    setCards([...cards, fetchedCard]);
  };

  const fetchDraw = async () => {
    const drawResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);
    const fetchedDraw = await drawResponse.json();
    return fetchedDraw;
  };

  return (
    <div className='snap-container'>
      <div className='snap-status'>
        <h2>{matchStatus}</h2>
      </div>

      <div className='cards-container'>
        <div className='card-frame'>
          {previousCard && <Card image={previousCard.image} code={previousCard.code} />}
        </div>
        <div className='card-frame'>
          {currentCard && <Card image={currentCard.image} code={currentCard.code} />}
        </div>
      </div>

      {allCardsWithdrawn ? (
        <div className='snap-count'>
          <h2>VALUE MATCHES: {snapValueCount}</h2>
          <h2>SUIT MATCHES: {snapSuitCount}</h2>
        </div>
      ) : (
        <button onClick={debounce(drawCard, 500)} className='draw-btn'>Draw card</button>
      )}
    </div>
  );
};

export default Snap;