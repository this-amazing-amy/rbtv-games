
export default deo = vid => m('iframe', {
  width: 1120,
  height: 630,
  src: `https://www.youtube.com/embed/${vid}`,
  frameborder: 0,
  allow: 'autoplay; encrypted-media',
  allowfullscreen: true,
  onload: () => videoLoading(false),
});

