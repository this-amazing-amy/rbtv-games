import { update, lensPath, add, path, map, isNil, and, assoc, filter, isEmpty, compose, propEq, over, range, always, lensIndex } from 'ramda';
import { on, stream, combine } from 'flyd';
import ffilter from 'flyd/module/filter';

import { addNerdQuizScore, players, answeringPlayer, updatePlayer, resetPlayerAnswering, resetScores } from './players';

const emptyCategory = () => ({
  title: '???',
  questions: range(1, 6).map(always(false)),
});

const quizFromLocalStorage = JSON.parse(localStorage.quiz || false)
    || range(1, 6).map(emptyCategory);

export const quiz = stream(quizFromLocalStorage);

on((q) => {
  localStorage.quiz = JSON.stringify(q);
}, quiz);

export const isPlaying = stream(false);

const resetGame = () => {
  resetPlayerAnswering();
  resetScores();
};

on(() => {
  resetGame();
}, ffilter(Boolean, isPlaying));

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
  addNerdQuizScore(deltaScore, p);
  const q = currentQuestion();
  markQuestionAsDone(q.categoryIndex, q.questionIndex);
  currentQuestion(null);
  resetPlayerAnswering();
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
  compose(isEmpty, filter(isNil), map(path(['nerdquiz', 'keyCode'])))(p()),
), [quiz, players]);

export const changeCategoryTitle = index => (title) => {
  quiz(over(lensIndex(index), assoc('title', title), quiz()));
};

