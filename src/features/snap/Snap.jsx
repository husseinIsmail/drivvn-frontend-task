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
      try {
        const deckResponse = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const fetchedDeck = await deckResponse.json();
        setDeck(fetchedDeck);
      } catch (error) {
        alert('Error fetching data from deckofcardsapi.com');
        console.log(error);
      }
    };
    fetchDeck();
  }, []);

  useLayoutEffect(() => {
    const checkMatchingCards = () => {
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
    const isLastCard = cards.length === 52;

    if (isLastCard) setAllCardsWithdrawn(true);
    setCurrentCard(fetchedCard);
    setPreviousCard(cards[cards.length - 1]);
    setCards([...cards, fetchedCard]);
  };

  const fetchDraw = async () => {
    try {
      const drawResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);
      const fetchedDraw = await drawResponse.json();
      return fetchedDraw;
    } catch (error) {
      alert('Error fetching data from deckofcardsapi.com');
      console.log(error);
    }
  };

  const calculateNextSnapValueChance = () => {
    const sameValueOnHand = cards.filter(card => card.value === currentCard.value).length;
    const remaining = 4 - sameValueOnHand;
    return Math.round((remaining / (52 - cards.length)) * 100);
  };

  const calculateNextSnapSuitChance = () => {
    const sameSuitOnHand = cards.filter(card => card.suit === currentCard.suit).length;
    const remaining = 13 - sameSuitOnHand;
    return Math.round((remaining / (52 - cards.length)) * 100);
  }

  return (
    <div className='snap-container'>
      <div className='snap-status'>
        <h2>{matchStatus}</h2>
        {currentCard && (
          <div className='draw-predictions'>
            <span>Card {cards.length} of 52</span>
            <span>Next Snap Suit Chance: {calculateNextSnapSuitChance()}%</span>
            <span>Next Snap Value Chance: {calculateNextSnapValueChance()}%</span>
            <span></span>
          </div>
        )}
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
        <>
          <h2>VALUE MATCHES: {snapValueCount}</h2>
          <h2>SUIT MATCHES: {snapSuitCount}</h2>
        </>
      ) : (
        <button onClick={debounce(drawCard, 500)} className='draw-btn'>Draw card</button>
      )}
    </div>
  );
};

export default Snap;