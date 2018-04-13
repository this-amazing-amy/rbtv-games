import { prop } from 'ramda';

const randomYoutubeAPIURL = `https://randomyoutube.net/api/getvid?api_token=${process.env.RANDOMYOUTUBE_API_KEY}`;
const corsProxyURL = `https://${process.env.CORS_HOST}${process.env.CORS_PORT ? (':' + process.env.CORS_PORT) : ''}/`;

export const fetchRandomVideo = () => fetch(`${corsProxyURL}${randomYoutubeAPIURL}`)
  .then(res => res.json())
  .then(prop('vid'));

