const fs = require('fs').promises;
const path = require('path');

const CHOCOLATES = '../../data/data.json';

const readChocolates = async () => {
  try {
    const data = await fs.readFile(path.resolve(__dirname, CHOCOLATES));
    const chocolates = JSON.parse(data);
    return chocolates;
  } catch (error) {
    console.error(`Erro na leitura do arquivo ${error.message}`);
  }
};

const writeChocolates = async (newChocolate) => {
  try {
    const allChocolates = await readChocolates();
    const nextId = allChocolates.length > 0 ? allChocolates[allChocolates.length - 1].id : 0;
    const newChocolateWithId = {
      id: nextId + 1,
      ...newChocolate,
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