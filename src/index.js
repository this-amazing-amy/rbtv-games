const express = require('express');
require('dotenv').config();


const app = express();

app.get('*', (req, res) => {
  res.send('Filmfights!');
});

app.listen(process.env.PORT, () => {
  console.log(`Listening!`);
});
