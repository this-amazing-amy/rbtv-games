import { curry, append, lensIndex, findIndex, and, propEq, both, isNil, has, over, assoc, compose, complement } from 'ramda';
import { on, stream } from 'flyd';

const isPlayer = both(complement(isNil), has('name'));
const playersFromLocalStorage = JSON.parse(localStorage.players || '[]').filter(isPlayer);
export const players = stream(playersFromLocalStorage);
on(p => localStorage.players = JSON.stringify(p), players);

const playerLens = player => lensIndex(findIndex(propEq('name', player.name), players()));

export const addPlayer = (player) => {
  players(append(player, players()));
};

export const updatePlayer = (f, player) => {
  players(over(playerLens(player), f, players()));
};

export const updatePlayerName = (name, player) => {
  if (player.name === name) return;
  updatePlayer(assoc('name', name || randomName()), player);
};

export const removePlayer = (player) => {
  const isPlayer = and(
    propEq('name', player.name),
    propEq('score', player.score)
  );
  const isNotPlayer = complement(isPlayer);

	players(players().filter(isNotPlayer));
};

export const randomName = () => {
	const fragments = [
    'Willi', 'Wonka', 'Lillo', 'Lollo', 'Paulinger', 'Lars', 'Florentin', 'Paulsen', 'Will', 'Bronko', 'Wonko',
    'La fuente', 'de la Cortullo', 'Larry', 'Lobster'
  ];
	const randomFragment = () => fragments[Math.floor(Math.random() * fragments.length)];
	return `${randomFragment()} ${randomFragment()}`;
};

export const defaultPlayer = () => ({
  name: randomName(),
  verflixxteklixx: {
    estimate: 0,
    score: 0,
    fischkarte: false
  },
});

