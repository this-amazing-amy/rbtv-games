import m from 'mithril';
import { updatePlayerEstimate } from '../../state/verflixxteklixx';
import { updatePlayerName, removePlayer } from '../../state/players';

const changeEstimate = player => (e) => {
  if (parseInt(e.target.value, 10)) {
    updatePlayerEstimate(e.target.value, player);
  }
};

const changeName = player => (e) => {
  const name = e.target.value;
  if (player.name != name) {
    updatePlayerName(name, player);
  }
};

const confirmDeletion = player => () => {
  if (confirm('O rly?')) {
    removePlayer(player);
  }
};

export default {
  view: ({ attrs: { player } }) => m('.player', [
    m('button.remove-player', {
      tabindex: -1,
      onclick: confirmDeletion(player),
    }, '☠'),
    m('input.player__name', {
      value: player.name,
      onchange: changeName(player),
      tabindex: -1,
    }),
    m('.player__score', player.verflixxteklixx.score),
    m('.player__views-text', 'VIEWS'),
    m('.player__estimate', [
      m('input.player__estimate-input', {
        onchange: changeEstimate(player),
        value: player.verflixxteklixx.estimate,
        tabindex: 1,
      }),
    ]),
  ]),
};
