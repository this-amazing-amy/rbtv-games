import m from 'mithril';
import { stream, fromPromise, combine, on, chain } from 'flyd';
import filter from 'flyd/module/filter';
import { __, pathEq, assocPath, minBy, compose, append, path, lensPath, reduce, assoc, over, findIndex, propEq, lensIndex, prop, lensProp, add, identity, filter as ffilter } from 'ramda';

import { fetchRandomVideo } from '../lib/randomYoutube';
import { fetchViewCount } from '../lib/youtube-api';

import { players, updatePlayer } from './players';


// VIDEOS

export const video = stream('');
export const views = filter(identity, video)
  .pipe(chain(v => fromPromise(fetchViewCount(v))));

export const videoErrors = filter(v => isNaN(v), views);

export const newRandomVideo = () => fetchRandomVideo().then(video);


// CONFIGURE DATASTRUCTURE

const estimatePath = ['verflixxteklixx', 'estimate'];
const scorePath = ['verflixxteklixx', 'score'];
const fischkartePath = ['verflixxteklixx', 'fischkarte'];


// ESTIMATES

export const updatePlayerEstimate = (estimate, player) => {
  updatePlayer(assocPath(estimatePath, parseInt(estimate, 10)), player);
};

export const clearEstimates = () => {
  players(players().map(assocPath(estimatePath, 0)))
};


// SCORING

const minimumDelta = compose(
  path(estimatePath),
  reduce(minBy(p => Math.abs(path(estimatePath, p) - views())), {verflixxteklixx: {estimate: Infinity}})
);

const winners = players => ffilter(pathEq(estimatePath, minimumDelta(players)), players);

const score = (isGerman, multiplicator) => player => {
    const isExactHit = path(estimatePath, player) === views();
    const german = isGerman ? 2 : 0;
    const fischkarte = path(fischkartePath, player) ? 2 : 1;

    return isExactHit
      ? views()
      : (1 + german) * multiplicator * fischkarte;
};

export const updateWinnerScore = (isGerman, multiplicator) => {
  const getScore = score(isGerman, multiplicator);
  winners(players()).forEach(winner => {
    updatePlayer(over(lensPath(scorePath), add(getScore(winner))), winner);
  });
};

