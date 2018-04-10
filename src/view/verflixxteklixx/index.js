import m from 'mithril';
import { video, fetchRandomVideo } from '../../state/verflixxteklixx';

export default {
  oninit: fetchRandomVideo,
  view: () => {
    const vid = video();
    return m('.subapp.verflixxteklixx', [
      m('h1', vid),
    ]);
  },
};
