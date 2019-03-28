import m from 'mithril';

import PlayerView from './playerView';

import { players, setPlayerAnswering, answeringPlayer } from '../../state/players';
import { isPlaying, toggleFinale, multiplicator, toggleDouble, startCurrentQuestion, currentQuestion, answerCorrect, answerWrong, cancelAnswer } from '../../state/nerdquiz';

const indexToSimpleScore = (i) => {
  switch (i) {
    case 0: return 100;
    case 1: return 200;
    case 2: return 300;
    case 3: return 600;
    case 4: return 1000;
    default: return 0;
  }
};

const indexToScore = (i) => {
  return multiplicator() * indexToSimpleScore(i);
};

const addKeyListener = () => {
  const answer = (e) => {
    players().forEach((player) => {
      if (e.keyCode === player.nerdquiz.keyCode) {
        setPlayerAnswering(player);
        m.redraw();
        document.removeEventListener('keydown', answer);
      }
    });
  };

  document.addEventListener('keydown', answer);
};

const startAnswer = (category, categoryIndex, questionIndex, score) => () => {
  startCurrentQuestion(category.title, categoryIndex, questionIndex, score);
  addKeyListener();
};

const renderCategory = (category, i) => m('.category', [
  m('h2', category.title),
  category.questions.map((q, j) => (
    m('.question', {
      class: q ? 'question--answered' : 'question--unanswered',
      onclick: startAnswer(category, i, j, indexToScore(j)),
    }, indexToScore(j)))),
]);

export default {
  view: ({ attrs: { quiz } }) => m('.play-view', [
    currentQuestion()
      ? [
        m(`.current-question current-question--${currentQuestion().categoryIndex}`, [
          m('.current-question__category', currentQuestion().category),
          m('.current-question__score', currentQuestion().score),
          !answeringPlayer() ? null
            : m('.answer-controls', [
              m('button.button--correct', {
                onclick: answerCorrect,
              }, '✔️'),
              m('button.button--wrong', {
                onclick: answerWrong,
              }, '❌'),
              m('button.button--correct', {
                onclick: cancelAnswer,
              }, '🚮'),
            ]),
        ]),
        m('.players', players().map(player => m(PlayerView, { player }))),
      ]
      : [
        m('.side-controls', [
          m('button', {
            onclick: toggleDouble,
          }, 'x2'),
          m('button', {
            onclick: toggleFinale,
          }, '🏁'),
          m('button', {
            onclick: () => {
              isPlaying(false);
            },
          }, '✏️'),
        ]),
        m('.questions', [quiz.map(renderCategory)]),
        m('.players', players().map(player => m(PlayerView, { player }))),
      ],
  ]),
};
