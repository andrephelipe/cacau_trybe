const express = require('express');
const { readChocolates } = require('./utils/fsUtils');

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
  const resultChocolates = await readChocolates();

  res.status(200).json(resultChocolates);
});

module.exports = {
  app,
};