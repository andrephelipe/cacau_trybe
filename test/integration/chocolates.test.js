const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../../src/app');

// const { readChocolates } = require('../../src/utils/fsUtils');

const { expect } = chai;
chai.use(chaiHttp);

describe('Testa a rota /chocolates', function () {
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

  describe.only('Testando o metodo post', function () {
    it('Retorna se e acrescentado um novo chocolate e o status', async function () {
      const mockChocolates = {
        name: 'Prestigio',
        brandId: 5,
      };

      const response = await chai.request(app).post('/chocolates').send(mockChocolates);

      expect(response.status).to.be.equal(201);
      expect(response.body).to.haveOwnProperty('chocolate');
      expect(response.body.chocolate).to.haveOwnProperty('id');
      expect(response.body.chocolate.name).to.equal(mockChocolates.name);
    });
  });
});
