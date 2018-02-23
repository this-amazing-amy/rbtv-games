import Gun from 'gun';

const gun = Gun(process.env.GUN_URL);
export const timer = gun.get('timer');

export const updateTimer = x => () => {
  timer.put({ value: x });
};

export const resetTimer = updateTimer(0);

window.timer = timer;
