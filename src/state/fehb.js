import { update, lensPath, path, map, isNil, and, assoc, filter, isEmpty, compose, propEq, over, range, always, lensIndex } from 'ramda';
import { on, stream, combine } from 'flyd';

import { addFEHBScore, players, answeringPlayer, resetPlayerFEHBAnswering, resetScores } from './players';
import { time } from './timer';

const emptyCategory = () => ({
  title: '???',
  questions: range(1, 5).map(always(false)),
});

const initialQuiz = range(1, 5).map(emptyCategory);

const quizFromLocalStorage = JSON.parse(localStorage.fehb || false) || initialQuiz;

export const quiz = stream(quizFromLocalStorage);
on((q) => {
  localStorage.fehb = JSON.stringify(q);
}, quiz);


export const multiplicator = stream(1);
export const toggleDouble = () => {
  multiplicator(multiplicator() === 2 ? 1 : 2);
};

export const isPlaying = stream(false);
export const isFinale = stream(false);

export const toggleFinale = () => {
  time(90);
  isFinale(!isFinale());
};

export const resetGame = () => {
  resetPlayerFEHBAnswering();
  resetScores();
  quiz(initialQuiz);
};

export const currentQuestion = stream(null);

export const startCurrentQuestion = (category, categoryIndex, questionIndex, score) => {
  currentQuestion({
    category, categoryIndex, questionIndex, score,
  });
};

export const markQuestionAsDone = (categoryIndex, questionIndex) => {
  quiz(over(lensPath([categoryIndex, 'questions']), update(questionIndex, true), quiz()));
};

export const answer = (deltaScore) => {
  const p = answeringPlayer();
  if (!p) return;
  const q = currentQuestion();
  currentQuestion(null);
  addFEHBScore(deltaScore, p);
  markQuestionAsDone(q.categoryIndex, q.questionIndex);
  resetPlayerFEHBAnswering();
};

export const answerWrong = () => {
  const q = currentQuestion();
  if (!q) return;
  answer(-q.score);
};

export const answerCorrect = () => {
  const q = currentQuestion();
  if (!q) return;
  answer(q.score);
};

export const cancelAnswer = () => {
  const q = currentQuestion();
  if (!q) return;
  answer(0);
};

export const isReadyToPlay = combine((q, p) => and(
  compose(isEmpty, filter(propEq('title', '???')))(q()),
  compose(isEmpty, filter(isNil), map(path(['fehb', 'keyCode'])))(p()),
), [quiz, players]);

export const changeCategoryTitle = index => (title) => {
  quiz(over(lensIndex(index), assoc('title', title), quiz()));
};

