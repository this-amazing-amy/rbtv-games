import m from 'mithril';
import { all } from 'ramda';
import { on, combine, stream } from 'flyd';
import { views, video, clearEstimates, newRandomVideo, updateWinnerScore } from '../../state/verflixxteklixx';
import { randomName, addPlayer, players, defaultPlayer } from '../../state/players';
import Player from './player';

import yeah from '../../sounds/yeah.mp3';

import './index.less';

const Yeah = new Audio(yeah);

const videoLoading = stream(false);
const errorFetching = stream(false);
const roundEnded = stream(false);

const isGerman = stream(false);
const isMultiplicator = stream(false);

const renderVideo = vid => m('iframe', {
  width: 1120,
  height: 630,
  src: `https://www.youtube.com/embed/${vid}`,
  frameborder: 0,
  allow: 'autoplay; encrypted-media',
  allowfullscreen: true,
  onload: () => videoLoading(false),
  onerror: () => {
    console.log('ERROR');
  },
});

const renderRevealButton = () => m('button.reveal-button', {
  tabindex: 2,
  onclick: () => {
    Yeah.play();
    roundEnded(true);
    views() && updateWinnerScore(isGerman(), isMultiplicator());
  }
}, 'Auflösen');

const renderNextRoundButton = () => m('button.next-round-button', {
  onclick: () => {
    roundEnded(false);
    errorFetching(false);
    newRandomVideo();
    video(null);
    views(null);
    videoLoading(true);
    clearEstimates();
  }
}, 'Nächste Runde');

const renderViews = views => m('span.views', views);
const renderPlayer = player => m(Player, { player });

const renderAddPlayerButton = () => m('button.add-player-button', {
  onclick: (e) => {
		e.preventDefault();
		addPlayer(defaultPlayer());
	},
}, '+');

export default {
  oninit: (vnode) => {
    vnode.state.redraw = combine(m.redraw, [video, views]);
    videoLoading(true);
    newRandomVideo();
  },
  onbeforeremove: (vnode) => {
    vnode.state.redraw.end(true);
  },
  view: () => {
    const shouldShowViews = !!views() && roundEnded();
    const shouldShowRevealButton = (video() && views() && !roundEnded()) || errorFetching();
    const shouldShowVideo = video();

    return m('.subapp.verflixxteklixx', [
      m('.video', [
        shouldShowVideo && renderVideo(video()),
        shouldShowViews && renderViews(views()),
        shouldShowRevealButton && renderRevealButton(),
        shouldShowViews && renderNextRoundButton(),
      ]),
      m('.players', [
        players().map(renderPlayer),
      ]),
      renderAddPlayerButton(),
    ]);
  },
};
