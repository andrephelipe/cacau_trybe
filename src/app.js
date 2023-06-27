const express = require('express');
const { readChocolates, writeChocolates } = require('./utils/fsUtils');
const { validateId, validateBody } = require('./middleware/middlewares');

const app = express();
app.use(express.json());

app.get('/hello', (req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

app.get('/chocolates', async (req, res) => {
  try {
    const resultChocolates = await readChocolates();
    
    return res.status(200).json({ chocolates: resultChocolates });
  } catch (error) {
    // console.log(console.error);
    return res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
});

app.get('/chocolates/total', async (req, res) => {
  const resultChocolates = await readChocolates();

  return res.status(200).json({ totalChocolates: resultChocolates.length });
});

app.get('/chocolates/:id', validateId, async (req, res) => {
  const { id } = req.params;
  const resultChocolates = await readChocolates();

  const chocoId = resultChocolates.find((item) => item.id === Number(id));

  if (!chocoId) return res.status(404).json({ message: 'Chocolate not found' });
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

app.post('/chocolates', validateBody, async (req, res) => {
  const { name, brandId } = req.body;

  const newChocolateWithId = await writeChocolates(name, brandId);
  return res.status(201).json(newChocolateWithId);
});

module.exports = {
  app,
};