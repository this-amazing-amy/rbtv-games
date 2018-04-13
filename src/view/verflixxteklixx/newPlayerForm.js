import m from 'mithril';
import { stream } from 'flyd';
import { assoc } from 'ramda';

import { addPlayer } from '../../state/verflixxteklixx';

const defaultPlayer = () => ({
  name: '',
  estimate: 0,
  score: 0,
  fischkarte: false
});

const addingPlayer = stream(false);
const newPlayer = stream(defaultPlayer());

const updateNewPlayerName = (e) => {
  newPlayer(assoc('name', e.target.value, newPlayer()));
};

const submitNewPlayer = (e) => {
  e.preventDefault();
  addPlayer(newPlayer());
  newPlayer(defaultPlayer());
  addingPlayer(false);
};

const startAddingPlayer = () => {
  addingPlayer(true);
};

const renderAddPlayerButton = () => m('button', {
  onclick: startAddingPlayer
}, '+');

const renderNewPlayerForm = () => m('form.new-player', {
  onsubmit: submitNewPlayer,
}, [
  m('input', { onchange: updateNewPlayerName, value: newPlayer().name}),
  m('input[type="submit"]',  '✔')
]);

export default {
  view: () => {
    return addingPlayer()
      ? renderNewPlayerForm()
      : renderAddPlayerButton();
  }
}
