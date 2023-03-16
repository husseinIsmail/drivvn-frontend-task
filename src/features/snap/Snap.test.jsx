/* eslint-disable testing-library/no-unnecessary-act */

import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import fakeDeck from '../../pages/test-data/fakeDeck';

describe('Snap Card Game', () => {
  beforeEach(() => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve(fakeDeck)
      }));
  });

  it('renders initial state', async () => {
    await act(async () => render(<App />));

    const firstCard = screen.queryByAltText(fakeDeck.cards[fakeDeck.cards.length - 1].code);
    const drawButton = screen.getByText('Draw card');
    const GameStats = screen.queryByText('GAME OVER!');
    const CardCount = screen.queryByText('Card 1 of 52');
    const snapSuitPred = screen.queryByText('Next Snap Suit Chance: 24%');
    const snapValuePred = screen.queryByText('Next Snap Value Chance: 6%');
    const snapSuitStatus = screen.queryByText('SNAP SUIT!');
    const snapValueStatus = screen.queryByText('SNAP Value!');

    expect(firstCard).not.toBeInTheDocument();
    expect(drawButton).toBeTruthy();
    expect(GameStats).not.toBeInTheDocument();
    expect(CardCount).not.toBeInTheDocument();
    expect(snapSuitPred).not.toBeInTheDocument();
    expect(snapValuePred).not.toBeInTheDocument();
    expect(snapSuitStatus).not.toBeInTheDocument();
    expect(snapValueStatus).not.toBeInTheDocument();
  });

  it('draws a card', async () => {
    await act(async () => {
      render(<App />);
    });

    await act(async () => {
      userEvent.click(await screen.findByText('Draw card'));
    });

    const firstCard = await screen.findByAltText(fakeDeck.cards[fakeDeck.cards.length - 1].code);
    const drawButton = screen.getByText('Draw card');
    const GameStats = screen.queryByText('GAME OVER!');
    const CardCount = await screen.findByText('Card 1 of 52');
    const snapSuitPred = screen.queryByText('Next Snap Suit Chance: 24%');
    const snapValuePred = screen.queryByText('Next Snap Value Chance: 6%');
    const snapSuitStatus = screen.queryByText('SNAP SUIT!');
    const snapValueStatus = screen.queryByText('SNAP Value!');

    expect(firstCard).toBeTruthy();
    expect(drawButton).toBeTruthy();
    expect(GameStats).not.toBeInTheDocument();
    expect(CardCount).toBeTruthy();
    expect(snapSuitPred).toBeTruthy();
    expect(snapValuePred).toBeTruthy();
    expect(snapSuitStatus).not.toBeInTheDocument();
    expect(snapValueStatus).not.toBeInTheDocument();
  });

  it('non matching cards', async () => {
    await act(async () => {
      render(<App />);
    });

    for (let i = 0; i < 2; i++) {
      await act(async () => {
        userEvent.click(await screen.findByText('Draw card'));
      });
    }

    const firstCard = await screen.findByAltText(fakeDeck.cards[fakeDeck.cards.length - 1].code);
    const secondCard = await screen.findByAltText(fakeDeck.cards[fakeDeck.cards.length - 2].code);
    const snapSuitStatus = screen.queryByText('SNAP SUIT!');
    const snapValueStatus = screen.queryByText('SNAP Value!');

    expect(firstCard).toBeTruthy();
    expect(secondCard).toBeTruthy();
    expect(snapSuitStatus).not.toBeInTheDocument();
    expect(snapValueStatus).not.toBeInTheDocument();
  });

  it('suite matching cards', async () => {
    await act(async () => {
      render(<App />);
    });

    for (let i = 0; i < 3; i++) {
      await act(async () => {
        userEvent.click(await screen.findByText('Draw card'));
      });
    }

    const firstCard = await screen.findByAltText(fakeDeck.cards[fakeDeck.cards.length - 2].code);
    const secondCard = await screen.findByAltText(fakeDeck.cards[fakeDeck.cards.length - 3].code);
    const snapSuitStatus = await screen.findByText('SNAP SUIT!');
    const snapValueStatus = screen.queryByText('SNAP Value!');

    expect(firstCard).toBeTruthy();
    expect(secondCard).toBeTruthy();
    expect(snapSuitStatus).toBeTruthy();
    expect(snapValueStatus).not.toBeInTheDocument();
  });

  it('value matching cards', async () => {
    await act(async () => {
      render(<App />);
    });

    for (let i = 0; i < 4; i++) {
      await act(async () => {
        userEvent.click(await screen.findByText('Draw card'));
      });
    }

    const firstCard = await screen.findByAltText(fakeDeck.cards[fakeDeck.cards.length - 3].code);
    const secondCard = await screen.findByAltText(fakeDeck.cards[fakeDeck.cards.length - 4].code);
    const snapSuitStatus = screen.queryByText('SNAP SUIT!');
    const snapValueStatus = await screen.findByText('SNAP VALUE!');

    expect(firstCard).toBeTruthy();
    expect(secondCard).toBeTruthy();
    expect(snapSuitStatus).not.toBeInTheDocument();
    expect(snapValueStatus).toBeTruthy();
  });

  it('renders final state', async () => {
    await act(async () => {
      render(<App />);
    });

    for (let i = 0; i < 52; i++) {
      await act(async () => {
        userEvent.click(await screen.findByText('Draw card'));
      });
    }

    const lastCard = screen.queryByAltText(fakeDeck.cards[0].code);
    const beforeLastCard = screen.queryByAltText(fakeDeck.cards[1].code);
    const drawButton = screen.queryByText('Draw card');
    const GameStats = await screen.findByText('GAME OVER!');
    const CardCount = await screen.findByText('Card 52 of 52');
    const snapSuitCount = await screen.findByText('VALUE MATCHES: 3');
    const snapValueCount = await screen.findByText('SUIT MATCHES: 19');
    const snapSuitPred = screen.queryByText('Next Snap Suit Chance: 24%');
    const snapValuePred = screen.queryByText('Next Snap Value Chance: 6%');
    const snapSuitStatus = screen.queryByText('SNAP SUIT!');
    const snapValueStatus = screen.queryByText('SNAP Value!');

    expect(lastCard).toBeTruthy();
    expect(beforeLastCard).toBeTruthy();
    expect(drawButton).not.toBeInTheDocument();
    expect(GameStats).toBeTruthy();
    expect(CardCount).toBeTruthy();
    expect(snapSuitCount).toBeTruthy();
    expect(snapValueCount).toBeTruthy();
    expect(snapSuitPred).not.toBeInTheDocument();
    expect(snapValuePred).not.toBeInTheDocument();
    expect(snapSuitStatus).not.toBeInTheDocument();
    expect(snapValueStatus).not.toBeInTheDocument();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
})