import m from 'mithril';

const route = (id) => () => new Promise((resolve) => {
  import(`./${id}`)
    .then(x => x.default)
    .then(resolve);
});

const app = () => {
  m.route(document.querySelector('#app'), '/', {
    '/': {
      onmatch: route('home'),
    },
    '/manage': {
      onmatch: route('manage'),
    },
  });
};

export default app;
