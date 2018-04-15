import m from 'mithril';
import './style.less';

const route = (id) => () => new Promise((resolve) => {
  import(`./${id}`)
    .then(x => x.default)
    .then(resolve);
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
  });
};

export default app;
