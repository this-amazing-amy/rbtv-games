import m from 'mithril';
import { updatePlayerEstimate, updatePlayerName, removePlayer } from '../../state/verflixxteklixx';

const changeEstimate = player => (e) => {
	if (parseInt(e.target.value, 10)) {
		updatePlayerEstimate(player, e.target.value);
	}
};

const changeName = player => (e) => {
	updatePlayerName(player, e.target.value);
};

const confirmDeletion = (player) => () => {
	if (confirm('O rly?')) {
		removePlayer(player);
	}
};

export default {
  view: ({ attrs: { player }}) => m('.player', [
		m('button.remove-player', {
      tabindex: -1,
			onclick: confirmDeletion(player),
		}, '☠'),
    m('input.player__name', {
			value: player.name,
			onchange: changeName(player),
			tabindex: -1
		}),
    m('.player__score', player.score),
		m('.player__views-text', 'VIEWS'),
		m('.player__estimate', [
			m('input.player__estimate-input', {
				onchange: changeEstimate(player),
				value: player.estimate,
        tabindex: 1
			}),
		]),
  ]),
};
