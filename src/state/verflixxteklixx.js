import m from 'mithril';
import { stream, fromPromise, combine, on, chain } from 'flyd';
import { prop } from 'ramda';

import { fetchViewCount } from '../lib/youtube-api';

const randomYoutubeAPIURL = `http://randomyoutube.net/api/getvid?api_token=${process.env.RANDOMYOUTUBE_API_KEY}`;
const corsProxyURL = `http://${process.env.CORS_HOST}:${process.env.CORS_PORT}/`;

export const fetchRandomVideo = () => fetch(`${corsProxyURL}${randomYoutubeAPIURL}`)
  .then(res => res.json())
  .then(prop('vid'))
  .then(vid => {
    video(vid);
    return vid;
  });

export const video = stream('');
export const views = video
  .pipe(chain(v => fromPromise(fetchViewCount(v))));

combine(m.redraw, [video, views]);
