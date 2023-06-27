const fs = require('fs').promises;
const path = require('path');

const CHOCOLATES = '../../data/data.json';

const readChocolates = async () => {
  try {
    const data = await fs.readFile(path.resolve(__dirname, CHOCOLATES), 'utf-8');
    const chocolates = JSON.parse(data);

    return chocolates;
  } catch (error) {
    throw new Error('INTERNAL SERVER ERROR');
  }
};

const writeChocolates = async (name, brandId) => {
  try {
    const allChocolates = await readChocolates();
    const nextId = allChocolates.length > 0 ? allChocolates[allChocolates.length - 1].id : 0;
    const newChocolateWithId = {
      id: nextId + 1,
      name,
      brandId,
    };

    const newListChoco = JSON.stringify([
      ...allChocolates,
      newChocolateWithId,
    ]);

    await fs.writeFile(path.resolve(__dirname, CHOCOLATES), newListChoco);

    return newChocolateWithId;
  } catch (error) {
    console.log(console.error);
  }
};

module.exports = {
  readChocolates,
  writeChocolates,
};