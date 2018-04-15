import m from 'mithril';
import filmfightslink from '../../images/fflogo.png';
import verflixxteklixxlink from '../../images/vklogo.png';

import './index.less';

export default {
  view: () => m('.portal', [
    m('a.portal__a', {
      href: '/filmfights',
      oncreate: m.route.link
    }, m('.filmfights-link', [
      m('img.portal__image', { src: filmfightslink }),
    ])),
    m('a.portal__a', {
      href: '/verflixxteklixx',
      oncreate: m.route.link
    }, m('.verflixxteklixx-link', [
      m('img.portal__image', { src: verflixxteklixxlink }),
    ])),
    m('footer', [
      'Made with 🚀 in Hamburg – Bildmaterial und Design © 2018 Rocket Beans GmbH – ',
      m('a.footer__link', {
        href: 'http://rocketbeans.tv',
        target: '_blank',
      }, 'rocketbeans.tv'),
      ' – ',
      m('a.footer__link', {
        href: 'https://www.youtube.com/channel/UCQvTDmHza8erxZqDkjQ4bQQ',
        target: '_blank'
      }, 'Abonnieren!'),
    ])
  ]),
};
