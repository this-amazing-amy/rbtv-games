import m from 'mithril';
import { stream, on, combine } from 'flyd';
import filter from 'flyd/module/filter';
import { propEq, not, identity } from 'ramda';
import { time, timerEnded, isRunning, startTimer, stopTimer } from '../../state/timer';

import film from '../../images/film.png';
import fights from '../../images/fights.png';

import bell from '../../sounds/bell.mp3';
import ticktock from '../../sounds/ticktock.mp3';
import buzzer from '../../sounds/buzzer.mp3';
import airhorn from '../../sounds/airhorn.mp3';

import './index.less';

const Bell = new Audio(bell);
const TickTock = new Audio(ticktock);
TickTock.loop = true;
const Buzzer = new Audio(buzzer);
const Airhorn = new Audio(airhorn);

const keyEvents = stream();
const plusEvents = filter(propEq('keyCode', 187), keyEvents);

on(() => {
  Airhorn.play();
}, plusEvents);

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
    document.addEventListener('keyup', keyEvents);
  },
  onbeforeremove: (vnode) => {
    vnode.state.redraw.end(true);
    document.removeEventListener('keyup', keyEvents);
  },
  view: () => {
    const seconds = padSeconds(time());

    return m('.subapp.filmfights', [
      m('.time-container', [
        m('img.film', { src: film }),
        m('div.time', [
          m('input.time__seconds', {
            onchange: (e) => { time(e.target.value); },
            className: `${seconds > 30 ? 'seconds--yellow' : 'seconds--red'}`,
            value: seconds,
          }),
        ]),
        m('img.fights', { src: fights }),
      ]),
      m('.inputs', [
        m('.playpause', [
          m('button.play', { onclick: startTimer }, m('.material-icons', 'play_arrow')),
          m('button.pause', { onclick: stopTimer }, m('.material-icons', 'stop')),
        ]),
        m('.minute-buttons', [
          SecondButton(15), SecondButton(30),
          MinuteButton(1), MinuteButton(2), MinuteButton(8),
        ]),
      ]),
      m('.media', [
        m('audio'),
      ]),
    ]);
  },
};
