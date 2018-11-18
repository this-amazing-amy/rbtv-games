import m from 'mithril';
import { find, head, path, assocPath, append, lensIndex, findIndex, and, propEq, both, isNil, has, over, assoc, compose, complement } from 'ramda';
import { on, stream } from 'flyd';
import ffilter from 'flyd/module/filter';

export const randomName = () => {
  const fragments = [
    'Willi', 'Wonka', 'Lillo', 'Lollo', 'Paulinger', 'Lars', 'Florentin', 'Paulsen', 'Will', 'Bronko', 'Wonko',
    'La fuente', 'de la Cortullo', 'Larry', 'Lobster',
  ];
  const randomFragment = () => fragments[Math.floor(Math.random() * fragments.length)];
  return `${randomFragment()} ${randomFragment()}`;
};

const isPlayer = both(complement(isNil), has('name'));
const playersFromLocalStorage = JSON.parse(localStorage.players || '[]').filter(isPlayer);
export const players = stream(playersFromLocalStorage);
on((p) => {
  localStorage.players = JSON.stringify(p);
}, players);

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

export const updatePlayerKeyCode = (keyCode, player) => {
  if (player.keyCode === keyCode) return;
  updatePlayer(assocPath(['nerdquiz', 'keyCode'], keyCode), player);
};

export const setPlayerAnswering = (player) => {
  updatePlayer(assocPath(['nerdquiz', 'isAnswering'], true), player);
};

export const resetPlayerAnswering = () => {
  players().map((player) => {
    updatePlayer(assocPath(['nerdquiz', 'isAnswering'], false), player);
  });
};

export const resetScores = (game) => {
  if (!(game in ['nerdquiz', 'verflixxteklixx'])) return;
  players().map((player) => {
    updatePlayer(assocPath([game, 'score'], 0), player);
  });
};

export const answeringPlayer = players.map(find(path(['nerdquiz', 'isAnswering'])));

export const removePlayer = (player) => {
  const isPlayer = and(
    propEq('name', player.name),
    propEq('score', player.score),
  );
  const isNotPlayer = complement(isPlayer);

  players(players().filter(isNotPlayer));
};


export const defaultPlayer = () => ({
  name: randomName(),
  verflixxteklixx: {
    estimate: 0,
    score: 0,
    fischkarte: false,
  },
  nerdquiz: {
    score: 0,
    keyCode: false,
    isAnswering: false,
  },
});

