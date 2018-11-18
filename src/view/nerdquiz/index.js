import m from 'mithril';
import { stream } from 'flyd';

import { quiz, isPlaying } from '../../state/nerdquiz';

import './index.less';
import FormView from './formView';
import PlayView from './playView';

const keyEvents = stream();

export default {
  oninit: (vnode) => {
    document.addEventListener('keyup', keyEvents);
  },
  onbeforeremove: (vnode) => {
    document.removeEventListener('keyup', keyEvents);
  },
  view: () => m('.subapp.nerdquiz', [
    m('.board', [
      isPlaying()
        ? m(PlayView, { quiz: quiz() })
        : m(FormView, { quiz: quiz() }),
    ]),

  ]),
};
