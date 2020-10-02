import m from 'mithril';
import { stream } from 'flyd';

import { quiz, isFinale, isPlaying } from '../../state/fehb';

import './index.less';
import FormView from './formView';
import PlayView from './playView';
import FinaleView from './finaleView';

const keyEvents = stream();

export default {
  oninit: () => {
    document.addEventListener('keyup', keyEvents);
  },
  onbeforeremove: () => {
    document.removeEventListener('keyup', keyEvents);
  },
  view: () => m('.subapp.fehb', [
    m('.board', [
      isFinale()
        ? m(FinaleView)
        : isPlaying()
          ? m(PlayView, { quiz: quiz() })
          : m(FormView, { quiz: quiz() }),
    ]),

  ]),
};
