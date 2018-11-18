import m from 'mithril';
import { addPlayer, defaultPlayer } from '../../state/players';

export default {
  view: () => m('button.button.add-player-button', {
    onclick: (e) => {
      e.preventDefault();
      addPlayer(defaultPlayer());
    },
  }, '+'),
};
