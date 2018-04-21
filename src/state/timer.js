import { on, stream } from 'flyd';
import keepWhen from 'flyd/module/keepwhen';
import filter from 'flyd/module/filter';
import every from 'flyd/module/every';
import { flip, gt } from 'ramda';

const when = flip(on);

export const isRunning = stream(false);
export const time = stream(0);

export const secondElapsed = keepWhen(isRunning, every(1000));
export const timerEnded = keepWhen(isRunning, filter(gt(1), time));

export const decrementTime = () => time(time() - 1);
export const startTimer = () => isRunning(true);
export const pauseTimer = () => isRunning(false);
export const stopTimer = () => {
  pauseTimer();
  time(0);
};

when(secondElapsed, decrementTime);
when(timerEnded, stopTimer);
