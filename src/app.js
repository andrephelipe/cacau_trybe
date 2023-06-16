const express = require('express');
const { readChocolates } = require('./utils/fsUtils');

const app = express();
app.use(express.json());

app.get('/chocolates', async (req, res) => {
  const resultChocolates = await readChocolates();

  return res.status(200).json({ chocolates: resultChocolates });
});

app.get('/chocolates/:id', async (req, res) => {
  const { id } = req.params;
  const resultChocolates = await readChocolates();

  const chocoId = resultChocolates.find((item) => item.id === Number(id));

  return res.status(200).json(chocoId);
});

app.get('/chocolates/brand/:brandId', async (req, res) => {
  const { brandId } = req.params;
  const resultChocolates = await readChocolates();

  const chocoBrandId = resultChocolates.filter((item) => item.brandId === Number(brandId));

  if (chocoBrandId.length === 0) {
    return res.status(404).json({ message: 'BRAND NAO ENCONTRADO!' });
  } 

  return res.status(200).json(chocoBrandId);
});

module.exports = {
  app,
};