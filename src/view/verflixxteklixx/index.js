import m from 'mithril';
import { all, identity } from 'ramda';
import { on, combine, stream } from 'flyd';
import filter from 'flyd/module/filter';
import { views, video, videoErrors, clearEstimates, newRandomVideo, updateWinnerScore } from '../../state/verflixxteklixx';
import { randomName, addPlayer, players, defaultPlayer } from '../../state/players';
import Player from './player';

import yeah from '../../sounds/yeah.mp3';

import './index.less';

const Yeah = new Audio(yeah);

const videoLoading = stream(false);
const roundEnded = stream(false);

const isGerman = stream(false);
const isMultiplicator = stream(false);
const multiplicator = stream(1);

const renderVideo = vid => m('iframe', {
  width: 1120,
  height: 630,
  src: `https://www.youtube.com/embed/${vid}`,
  frameborder: 0,
  allow: 'autoplay; encrypted-media',
  allowfullscreen: true,
  onload: () => videoLoading(false),
});

const renderRevealButton = () => m('button.reveal-button', {
  tabindex: 2,
  onclick: () => {
    Yeah.play();
    roundEnded(true);
    views() && updateWinnerScore(isGerman(), multiplicator());
  }
}, 'Auflösen');

const renderNextRoundButton = () => m('button.next-round-button', {
  onclick: () => {
    roundEnded(false);
    newRandomVideo();
    video(null);
    views(null);
    videoLoading(true);

    if (!isMultiplicator() && multiplicator() > 1) {
      multiplicator(1);
    }

    if (isMultiplicator()) {
      multiplicator(multiplicator() * 2);
      isMultiplicator(false);
    }

    isGerman(false);
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

const renderIndicators = () => m('.indicators', [
  multiplicator() > 1 && m('.indicator__multi', [
    `x${multiplicator()}`,
  ]),
]);

export default {
  oninit: (vnode) => {
    vnode.state.redraw = combine(m.redraw, [video, views]);
    vnode.state.videoError = on(() => isMultiplicator(true), videoErrors);
    vnode.state.multiplicatorSound = on(() => {
    }, filter(identity, isMultiplicator));
    videoLoading(true);
    newRandomVideo();
  },
  onbeforeremove: (vnode) => {
    vnode.state.redraw.end(true);
    vnode.state.onVideoError.end(true);
  },
  view: ({ state }) => {
    const { videoError } = state;

    const shouldShowViews = !!views() && roundEnded();
    const shouldShowRevealButton = (video() && views() && !roundEnded()) || videoError();
    const shouldShowNextRoundButton = shouldShowViews || isMultiplicator();
    const shouldShowVideo = video();

    return m('.subapp.verflixxteklixx', [
      m('.video', [
        renderIndicators(),
        shouldShowVideo && renderVideo(video()),
        shouldShowViews && renderViews(views()),
        shouldShowRevealButton && renderRevealButton(),
        shouldShowNextRoundButton && renderNextRoundButton(),
      ]),
      m('.players', [
        players().map(renderPlayer),
      ]),
      renderAddPlayerButton(),
    ]);
  },
};
