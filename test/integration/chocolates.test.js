const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../../src/app');

// const { readChocolates } = require('../../src/utils/fsUtils');

const { expect } = chai;
chai.use(chaiHttp);

describe('Usando o metodo GET em /chocolates', function () {
  it('Retorna o status 200 na requisicao e retorna a lista de chocolates', async function () {
    const response = await chai.request(app).get('/chocolates');

    const output = [
      { id: 1, name: 'Mint Intense', brandId: 1 },
      { id: 2, name: 'White Coconut', brandId: 1 },
      { id: 3, name: 'Mon Chéri', brandId: 2 },
      { id: 4, name: 'Mounds', brandId: 3 },
    ];

    expect(response.status).to.be.equal(200);
    expect(response.body.chocolates).to.deep.equal(output);
  });
});