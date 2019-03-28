import m from 'mithril';
import { setNerdQuizScore } from '../../state/players';

export default {
  view: ({ attrs: { player } }) => m('.player', {
    class: player.nerdquiz.isAnswering ? 'player--answering' : '',
  }, [
    m('span.player__name', player.name),
    m('span.player__key', String.fromCharCode(player.nerdquiz.keyCode)),
    m('input.player__score', {
      value: player.nerdquiz.score,
      onchange: (e) => {
        setNerdQuizScore(e.target.value, player);
      },
    }),
  ]),
};
