import { useEffect, useState, useLayoutEffect } from 'react';
import Card from '../../components/Card/Card';
import GameStats from '../../components/GameStats/GameStats';
import DrawPredictions from '../../components/DrawPredictions/DrawPredictions';
import './Snap.css';

const Snap = () => {
  const [deck, setDeck] = useState([]);
  const [cards, setCards] = useState([]);;
  const [currentCard, setCurrentCard] = useState(null);
  const [previousCard, setPreviousCard] = useState(null);
  const [snapSuitCount, setSnapSuitCount] = useState(0);
  const [snapValueCount, setSnapValueCount] = useState(0);
  const [snapStatus, setSnapStatus] = useState('');

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const deckResponse = await fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52');
        const fetchedDeck = await deckResponse.json();
        setDeck(fetchedDeck.cards);
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
        setSnapStatus('SNAP SUIT!');
      } else if (currentCard.value === previousCard.value) {
        setSnapValueCount(snapValueCount => snapValueCount + 1);
        setSnapStatus('SNAP VALUE!');
      } else {
        setSnapStatus('');
      }
    }

    if (currentCard && previousCard) {
      checkMatchingCards();
    }
  }, [currentCard, previousCard]);

  const drawCard = async () => {
    const drawnCard = deck[deck.length - 1];
    setCurrentCard(drawnCard);
    setPreviousCard(cards[cards.length - 1]);
    setDeck(deck.slice(0, deck.length - 1))
    setCards([...cards, drawnCard]);
  };

  const calculateNextSnapValueChance = () => {
    const sameValueOnHand = cards.filter(card => card.value === currentCard.value).length;
    const remaining = 4 - sameValueOnHand;
    return Math.round((remaining / deck.length) * 100);
  };

  const calculateNextSnapSuitChance = () => {
    const sameSuitOnHand = cards.filter(card => card.suit === currentCard.suit).length;
    const remaining = 13 - sameSuitOnHand;
    return Math.round((remaining / deck.length) * 100);
  }

  return (
    <>
      {deck && (
        <div className='snap-container'>
          <div className='upper-info'>
            {currentCard && <DrawPredictions
              snapSuitChance={calculateNextSnapSuitChance()}
              snapValueChance={calculateNextSnapValueChance()}
              currentCardIndex={cards.length}
              snapStatus={snapStatus} />}
          </div>

          <div className='cards-container'>
            <div className='card-frame'>
              {previousCard && <Card image={previousCard.image} code={previousCard.code} />}
            </div>
            <div className='card-frame'>
              {currentCard && <Card image={currentCard.image} code={currentCard.code} />}
            </div>
          </div>

          {deck.length === 0 ? (
            <GameStats snapValueCount={snapValueCount} snapSuitCount={snapSuitCount} />
          ) : (
            <button onClick={drawCard} className='draw-btn'>Draw card</button>
          )}
        </div>
      )}
    </>
  );
};

export default Snap;