import m from 'mithril';
import { updatePlayerEstimate } from '../../state/verflixxteklixx';

const changeEstimate = player => (e) => {
  updatePlayerEstimate(player, e.target.value);
};

export default {
  view: ({ attrs: { player }}) => m('.player', [
    m('.player__name', player.name),
    m('input[type="number"]', { onchange: changeEstimate(player), value: player.estimate }),
    m('.player__score', player.score)
  ]),
};
