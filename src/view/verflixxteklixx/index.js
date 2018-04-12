import m from 'mithril';
import { views, video, fetchRandomVideo } from '../../state/verflixxteklixx';

const renderVideo = vid => m('iframe', {
  width: 560,
  height: 315,
  src: `https://www.youtube.com/embed/${vid}`,
  frameborder: 0,
  allow: 'autoplay; encrypted-media',
  allowfullscreen: true
});

const renderViews = views => m('h2', views);

export default {
  oninit: fetchRandomVideo,
  view: () => {
    return m('.subapp.verflixxteklixx', [
      video() ? renderVideo(video()) : null,
      views() ? renderViews(views()) : null
    ]);
  },
};
