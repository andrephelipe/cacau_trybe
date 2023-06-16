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

module.exports = {
  readChocolates,
};