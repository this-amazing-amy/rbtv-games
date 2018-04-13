import m from 'mithril';
import { stream, fromPromise, combine, on, chain } from 'flyd';
import filter from 'flyd/module/filter';
import { minBy, compose, append, reduce, assoc, over, findIndex, propEq, lensIndex, prop, identity } from 'ramda';

import { fetchRandomVideo } from '../lib/randomYoutube';
import { fetchViewCount } from '../lib/youtube-api';

export const video = stream('');
export const views =  filter(identity, video)
  .pipe(chain(v => fromPromise(fetchViewCount(v))));

export const players = stream(JSON.parse(localStorage.players || '[]'));
on(p => localStorage.players = JSON.stringify(p), players);


export const newRandomVideo = () => fetchRandomVideo().then(video);


const playerLens = player => lensIndex(findIndex(propEq('name', player.name), players()));

export const addPlayer = (player) => {
  players(append(player, players()));
};

export const updatePlayerEstimate = (player, estimate) => {
  const newPlayers = over(playerLens(player), assoc('estimate', parseInt(estimate, 10)), players());
  players(newPlayers);
};

export const clearEstimates = () => {
  players(players().map(assoc('estimate', 0)))
};

const winners = (players) => {
  const minimumDelta = reduce(minBy(p => Math.abs(p.estimate - views())), {estimate: Infinity}, players);
  console.log(minimumDelta);
  return players.filter(propEq('estimate', minimumDelta.estimate));
};

export const updateWinnerScore = (isGerman, isMultiplicator) => {
  winners(players()).forEach(winner => {
    const isExactHit = winner.estimate === views();
    console.log(winner.estimate, views());
    const score = isExactHit ? views()
      : (1 + (isGerman ? 2 : 0)) * (isMultiplicator ? 2 : 1) * (winner.fischkarte ? 2 : 1);

    const newPlayers = over(playerLens(winner), assoc('score', winner.score + score), players());
    players(newPlayers);
  });
}

export const addPlayerScore = (player, score) => {
  const newPlayers = over(playerLens(player), over(lensProp('score'), add(score)), players());
  players(newPlayers);
}

combine(m.redraw, [video, views, players]);
