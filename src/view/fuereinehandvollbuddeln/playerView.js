import m from 'mithril';
import { setFEHBScore } from '../../state/players';

export default {
  view: ({ attrs: { player } }) => m('.player', {
    class: player.fehb.isAnswering ? 'player--answering' : '',
  }, [
    m('span.player__name', player.name),
    m('span.player__key', String.fromCharCode(player.fehb.keyCode)),
    m('input.player__score', {
      value: player.fehb.score,
      onchange: (e) => {
        setFEHBScore(e.target.value, player);
      },
    }),
  ]),
};
