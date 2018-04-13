import { path } from 'ramda';

const apiKey = process.env.YOUTUBE_DATA_API_KEY;

export const fetchViewCount = vid => fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${vid}&key=${apiKey}`)
  .then(res => res.json())
  .then(path(['items', 0, 'statistics', 'viewCount']))
  .then(v => parseInt(v, 10));

