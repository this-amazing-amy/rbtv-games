import m from 'mithril';
import { stream, on, combine } from 'flyd';
import film from '../../images/film.png';
import fights from '../../images/fights.png';

import bell from '../../sounds/bell.mp3';
import ticktock from '../../sounds/ticktock.mp3';
import buzzer from '../../sounds/buzzer.mp3';
import airhorn from '../../sounds/airhorn.mp3';

import '../style.less';

const Bell = new Audio(bell);
const TickTock = new Audio(ticktock);
TickTock.loop = true;
const Buzzer = new Audio(buzzer);
const Airhorn = new Audio(airhorn);

const time = stream(0);
const isRunning = stream(false);
const interval = stream(null);

document.addEventListener('keyup', (e) => {
  if (e.keyCode === 187) {
    Airhorn.play();
  }
});

const decrementTime = () => {
  time(time() - 1);
  m.redraw();
};

const stop = () => {
    clearInterval(interval());
    interval(null);
    TickTock.pause();
};

const done = () => {
  if (interval()) {
    Buzzer.play();
    stop();
  }
};

on((t) => { if (t <= 0) { done(); } }, time);
on((shouldRun) => { if (!shouldRun) { stop(); } }, isRunning);
combine((running, t) => {
  if (running() && t() > 0 && !interval()) {
    interval(setInterval(decrementTime, 1000));
    Bell.play();
    TickTock.play();
  }
}, [isRunning, time]);

const padSeconds = s => s > 9 ? s : `0${s}`;

const MinuteButton = (minutes) => m('button.minute-button', {
  onclick: () => { time(minutes * 60); },
}, `${minutes} Minute${minutes > 1 ? 'n' : ''}`);

export default {
  view: () => {
    const seconds = padSeconds(time());

    return [
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
          m('button.play', { onclick: () => { isRunning(true); }, }, m('.material-icons', 'play_arrow')),
          m('button.pause', { onclick: () => { isRunning(false); time(0); }, }, m('.material-icons', 'stop')),
        ]),
        m('.minute-buttons', [
          MinuteButton(1), MinuteButton(2), MinuteButton(5),
        ]),
      ]),
      m('.media', [
        m('audio'),
      ]),
    ];
  },
};
