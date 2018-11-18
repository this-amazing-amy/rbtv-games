import m from 'mithril';
import './style.less';

const route = (id) => () => new Promise((resolve) => {
  import(`./${id}`)
    .then(x => x.default)
    .then(resolve)
    .catch(console.error);
});

const app = () => {
  m.route(document.querySelector('#app'), '/', {
    '/': {
      onmatch: route('portal'),
    },
    '/filmfights': {
      onmatch: route('filmfights'),
    },
    '/verflixxteklixx': {
      onmatch: route('verflixxteklixx'),
    },
    '/nerdquiz': {
      onmatch: route('nerdquiz'),
    },
  });
};

export default app;
