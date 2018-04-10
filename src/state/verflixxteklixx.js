import m from 'mithril';
import { stream } from 'flyd';
import { prop } from 'ramda';

const randomYoutubeAPIURL = `http://randomyoutube.net/api/getvid?api_token=${process.env.RANDOMYOUTUBE_API_KEY}`;
const corsProxyURL = `http://${process.env.CORS_HOST}:${process.env.CORS_PORT}/`;

export const fetchRandomVideo = () => fetch(`${corsProxyURL}${randomYoutubeAPIURL}`)
  .then(res => res.json())
  .then(prop('vid'))
  .then(video)
  .then(m.redraw);

export const video = stream('');
