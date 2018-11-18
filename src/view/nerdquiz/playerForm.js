import m from 'mithril';
import { updatePlayerKeyCode, updatePlayerName, removePlayer } from '../../state/players';

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

const changeKey = player => (e) => {
  e.target.innerText = 'Press any key...';

  const assignKey = (evt) => {
    updatePlayerKeyCode(evt.keyCode, player);
    e.target.innerText = String.fromCharCode(evt.keyCode);
    document.removeEventListener('keyup', assignKey);
  };

  document.addEventListener('keyup', assignKey);
};

export default {
  view: ({ attrs: { player } }) => m('.player.player-form', [
    m('input.player__name', {
      value: player.name,
      onchange: changeName(player),
      tabindex: -1,
    }),
    m('button.button', {
      onclick: changeKey(player),
    }, `Key: ${String.fromCharCode(player.nerdquiz.keyCode)}` || 'No key assigned!'),
    m('button.button.remove-player', {
      tabindex: -1,
      onclick: confirmDeletion(player),
    }, '☠'),

  ]),
};
