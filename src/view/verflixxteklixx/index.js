import m from 'mithril';
import { all } from 'ramda';
import { on, combine, stream } from 'flyd';
import { views, video, players, clearEstimates, newRandomVideo, updateWinnerScore } from '../../state/verflixxteklixx';
import NewPlayerForm from './newPlayerForm';
import Player from './player';

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
});

const renderRevealButton = () => m('button', {
  onclick: () => {
    roundEnded(true);
    views() && updateWinnerScore(isGerman(), isMultiplicator());
  }
}, 'Auflösen');

const renderNextRoundButton = () => m('button', {
  onclick: () => {
    roundEnded(false);
    errorFetching(false);
    newRandomVideo();
    videoLoading(true);
    clearEstimates();
  }
}, 'Nächste Runde');

const renderViews = views => m('h2', views);

const renderPlayer = player => m(Player, { player });

export default {
  oninit: () => {
    videoLoading(true);
    newRandomVideo();
  },
  view: () => {
    const shouldShowViews = views() && roundEnded();
    const shouldShowRevealButton = (video() && views() && !roundEnded()) || errorFetching();
    const shouldShowVideo = video();

    return m('.subapp.verflixxteklixx', [
      shouldShowVideo && renderVideo(video()),
      shouldShowViews && renderViews(views()),
      shouldShowRevealButton && renderRevealButton(),
      shouldShowViews && renderNextRoundButton(),
      players().map(renderPlayer),
      m(NewPlayerForm)
    ]);
  },
};
