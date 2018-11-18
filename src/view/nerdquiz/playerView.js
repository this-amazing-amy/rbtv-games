import m from 'mithril';

export default {
  view: ({ attrs: { player } }) => m('.player', {
    class: player.nerdquiz.isAnswering ? 'player--answering' : '',
  }, [
    m('span.player__name', player.name),
    m('span.player__key', String.fromCharCode(player.nerdquiz.keyCode)),
    m('span.player__score', player.nerdquiz.score),
  ]),
};
