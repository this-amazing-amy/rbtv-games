import m from 'mithril';
import { toggleFinale } from '../../state/fehb';
import { addFEHBScore, players } from '../../state/players';

import PlayerView from './playerView';

const addFinaleScore = player => addFEHBScore(100, player);

export default {
  view: () => m('.finale-view', [
    m('.inputs', [
      m('.player-buttons', players().map(player => m('button', { onclick: () => addFinaleScore(player) }, player.name))),
      m('button.back', { onclick: toggleFinale }, m('.material-icons', 'arrow_back')),
    ]),
    m('.players', players().map(player => m(PlayerView, { player }))),
  ]),
};
