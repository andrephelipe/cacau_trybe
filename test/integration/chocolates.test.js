const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const fs = require('fs');
const { app } = require('../../src/app');

const { expect } = chai;
chai.use(chaiHttp);

const mockFile = JSON.stringify([
  { id: 1, name: 'Mint Intense', brandId: 1 },
  { id: 2, name: 'White Coconut', brandId: 1 },
  { id: 3, name: 'Mon Chéri', brandId: 2 },
  { id: 4, name: 'Mounds', brandId: 3 },
  { id: 5, name: 'Kit Kat', brandId: 2 },
  { id: 6, name: 'Sonho de Valsa', brandId: 2 },
  { id: 7, name: 'Sonho de lambaris', brandId: 2 },
  { id: 8, name: 'Biz', brandId: 3 },
]);

describe('Testa a rota /chocolates', function () {
  describe.only('Usando o metodo GET em /chocolates', function () {
    it('Retorna o status 200 na requisicao e retorna a lista de chocolates', async function () {
      sinon.stub(fs.promises, 'readFile').resolves(mockFile);
      
      const response = await chai.request(app).get('/chocolates');
      // console.log(response.body);
      
      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal(mockFile);
      // expect(response.body).to.have.lengthOf(8);
      // expect(response.body).to.haveOwnProperty('chocolates');
      // expect(response.body.chocolates).to.be.instanceof(Array);
      
      // sinon.restore();
    });
  });

  describe('Usando o metodo GET em /chocolates/:id para buscar o id 4', function () {
    it('Retorna o chocolate Mounds', async function () {
      sinon.stub(fs.promises, 'readFile').resolves(mockFile);
      const response = await chai.request(app).get('/chocolates/4');
      
      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal({
        id: 4,
        name: 'Mounds',
        brandId: 3,
      });

      sinon.restore();
    });
  });

  describe('Usando o método GET em /chocolates/brand/:brandId busca o brandId 1', function () {
    it('Retorna os chocolates da marca Lindt & Sprungli', async function () {
      sinon.stub(fs.promises, 'readFile').resolves(mockFile);
      const response = await chai.request(app).get('/chocolates/brand/1');
      
      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal([

        {
          id: 1,
          name: 'Mint Intense',
          brandId: 1,
        },
        {
          id: 2,
          name: 'White Coconut',
          brandId: 1,
        },
      ]);

      sinon.restore();
    });
  });

  describe('Usando o método GET em /chocolates/:id para buscar o ID 99', function () {
    it('Retorna status 404 com a mensagem "Chocolate not found"', async function () {
      sinon.stub(fs.promises, 'readFile').resolves(mockFile);
      const response = await chai.request(app).get('/chocolates/99');
      
      expect(response.status).to.be.equal(404);
      expect(response.body).to.deep.equal({ message: 'Chocolate not found' });
      
      sinon.restore();
    });
  });
  
  describe('Testando o metodo post', function () {
    beforeEach(function () {
      sinon.stub(fs.promises, 'writeFile').resolves();
    });
    
    afterEach(function () {
      sinon.restore();
    });
    
    const mockChocolates = {
      name: 'Prestigio',
      brandId: 5,
    };
    
    it('Retorna se e acrescentado um novo chocolate e o status', async function () {
      const response = await chai.request(app).post('/chocolates').send(mockChocolates);
      
      expect(response.status).to.be.equal(201);
      expect(response.body).to.haveOwnProperty('chocolate');
      expect(response.body.chocolate).to.haveOwnProperty('id');
      expect(response.body.chocolate.name).to.equal(mockChocolates.name);
    });
    
    it('Escreve o novo chocolate no arquivo de chocolates', async function () {
      await chai.request(app).post('/chocolates').send(mockChocolates);
      
      expect(fs.promises.writeFile.called).to.be.equal(true);
    });
  });

  describe('Testa o endpoint total', function () {
    it('Testa se esta contando certo o numero de chocolates', async function () {
      sinon.stub(fs.promises, 'readFile').resolves(mockFile);
      const response = await chai.request(app).get('/chocolates/total');

      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal({ totalChocolates: 6 });

      sinon.restore();
    });
  });
});
