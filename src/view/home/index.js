import m from 'mithril';
import { stream, on, combine } from 'flyd';
import film from '../../images/film.png';
import fights from '../../images/fights.png';
import '../style.less';

const time = stream(0);
const isRunning = stream(false);
const interval = stream(null);

const decrementTime = () => {
  time(time() - 1);
  m.redraw();
};

const stop = () => {
    clearInterval(interval());
    interval(null);
};

const done = () => {
  if (interval()) {
    alert('zero');
    stop();
  }
};

on((t) => { if (t <= 0) { done(); } }, time);
on((shouldRun) => { if (!shouldRun) { stop(); } }, isRunning);
combine((running, t) => {
  if (running() && t() > 0 && !interval()) {
    interval(setInterval(decrementTime, 1000));
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
