import m from 'mithril';
import { stream, on, combine } from 'flyd';
import filter from 'flyd/module/filter';
import { propEq, not, identity } from 'ramda';
import { toggleFinale } from '../../state/nerdquiz';
import { time, timerEnded, isRunning, startTimer, stopTimer } from '../../state/timer';

import bell from '../../sounds/bell.mp3';
import ticktock from '../../sounds/nerdquizticktock.mp3';
import buzzer from '../../sounds/buzzer.mp3';

const Bell = new Audio(bell);
const TickTock = new Audio(ticktock);
TickTock.loop = true;
const Buzzer = new Audio(buzzer);

on(() => {
  Buzzer.play();
}, timerEnded);

on(() => {
  Bell.play();
  TickTock.play();
}, filter(identity, isRunning));

on(() => {
  TickTock.pause();
}, filter(not, isRunning));


const padSeconds = s => (s > 9 ? s : `0${s}`);

const MinuteButton = minutes => m('button.minute-button', {
  onclick: () => { time(minutes * 60); },
}, `${minutes} Minute${minutes > 1 ? 'n' : ''}`);

const SecondButton = seconds => m('button.minute-button', {
  onclick: () => { time(seconds); },
}, `${seconds} Sekunde${seconds > 1 ? 'n' : ''}`);

export default {
  oninit: (vnode) => {
    vnode.state.redraw = on(m.redraw, time);
  },
  onbeforeremove: (vnode) => {
    vnode.state.redraw.end(true);
  },
  view: () => {
    const seconds = padSeconds(time());

    return m('.finale-view', [
      m('input.time__seconds', {
        onchange: (e) => { time(e.target.value); },
        className: `${seconds > 30 ? 'seconds--yellow' : 'seconds--red'}`,
        value: seconds,
      }),
      m('.inputs', [
        m('.playpause', [
          m('button.play', {
            onclick: () => {
              time(90);
              startTimer();
            },
          }, m('.material-icons', 'play_arrow')),
          m('button.pause', { onclick: stopTimer }, m('.material-icons', 'stop')),
        ]),
        m('button.back', { onclick: toggleFinale }, m('.material-icons', 'arrow_back')),
      ]),
    ]);
  },
};
