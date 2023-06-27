/* eslint-disable max-len */
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const fs = require('fs');
const { app } = require('../../src/app');

const { expect } = chai;
chai.use(chaiHttp);

const mockFile = [
  { id: 1, name: 'Mint Intense', brandId: 1 },
  { id: 2, name: 'White Coconut', brandId: 1 },
  { id: 3, name: 'Mon Chéri', brandId: 2 },
  { id: 4, name: 'Mounds', brandId: 3 },
  { id: 5, name: 'Kit Kat', brandId: 2 },
  { id: 6, name: 'Sonho de Valsa', brandId: 2 },
  { id: 7, name: 'Sonho de lambaris', brandId: 2 },
  { id: 8, name: 'Biz', brandId: 3 },
];

const CHOCOLATES = '/chocolates';

describe('testa a rota /chocolates', function () {
  describe('Usando o metodo GET em /chocolates', function () {
    it(
'Retorna o status 200 na requisicao e retorna a lista de chocolates', 
      async function () {
        sinon.stub(fs.promises, 'readFile').resolves(JSON.stringify(mockFile));
        
        const response = await chai.request(app).get(CHOCOLATES);
        
        expect(response.status).to.be.equal(200);
        expect(response.body.chocolates).to.deep.equal(mockFile);
        expect(response.body.chocolates).to.have.lengthOf(8);
        expect(response.body).to.haveOwnProperty('chocolates');
        expect(response.body.chocolates).to.be.instanceof(Array);
        
        sinon.restore();
      },
    );
  });
    
  describe('Testa se der ruim a requisicao', function () {
      it('Retorna status 500 e mensagem de erro', async function () {
        const readFileStub = sinon.stub(fs.promises, 'readFile').rejects();
        
        const response = await chai.request(app).get(CHOCOLATES);
        
        expect(readFileStub.calledOnce).to.equal(true);
        expect(response.status).to.equal(500);
        expect(response.body.message).to.equal('INTERNAL SERVER ERROR');
        
        sinon.restore();
      });
    });

    describe('Usando o metodo GET em CHOCOLATES/:id para buscar o id 4', function () {
        it('Retorna o chocolate Mounds', async function () {
      sinon.stub(fs.promises, 'readFile').resolves(JSON.stringify(mockFile));
      const response = await chai.request(app).get(`${CHOCOLATES}/4`);
      
      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal({
        id: 4,
        name: 'Mounds',
        brandId: 3,
      });

      sinon.restore();
    });
  });

  describe('Usando o método GET em CHOCOLATES/brand/:brandId busca o brandId 1', function () {
    it('Retorna os chocolates da marca Lindt & Sprungli', async function () {
      sinon.stub(fs.promises, 'readFile').resolves(JSON.stringify(mockFile));
      const response = await chai.request(app).get(`${CHOCOLATES}/brand/1`);
      
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

  describe('Usando o método GET em CHOCOLATES/:id para buscar o ID 99', function () {
    it('Retorna status 404 com a mensagem "Chocolate not found"', async function () {
      sinon.stub(fs.promises, 'readFile').resolves(JSON.stringify(mockFile));
      const response = await chai.request(app).get(`${CHOCOLATES}/99`);
      
      expect(response.status).to.be.equal(404);
      expect(response.body).to.deep.equal({ message: 'Chocolate not found' });
      
      sinon.restore();
    });
  });
  
  describe('Testando o metodo post', function () {
    beforeEach(function () {
      sinon.stub(fs.promises, 'writeFile').resolves(JSON.stringify(mockFile));
    });
    
    afterEach(function () {
      sinon.restore();
    });
    
    const mockChocolates = {
      name: 'Prestigio',
      brandId: 5,
    };
    
    it('Retorna se e acrescentado um novo chocolate e o status', async function () {
      const response = await chai.request(app).post(CHOCOLATES).send(mockChocolates);
      
      expect(response.status).to.be.equal(201);
      expect(response.body).to.haveOwnProperty('id');
      expect(response.body.name).to.equal(mockChocolates.name);
      expect(response.body).to.deep.equal({
        id: 4,
        name: 'Prestigio',
        brandId: 5,
      });
    });
    
    it('Escreve o novo chocolate no arquivo de chocolates', async function () {
      await chai.request(app).post(CHOCOLATES).send(mockChocolates);
      
      expect(fs.promises.writeFile.called).to.be.equal(true);
    });
  });

  describe('Testa o endpoint total', function () {
    it('Testa se esta contando certo o numero de chocolates', async function () {
      sinon.stub(fs.promises, 'readFile').resolves(JSON.stringify(mockFile));
      const response = await chai.request(app).get(`${CHOCOLATES}/total`);

      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal({ totalChocolates: 8 });

      sinon.restore();
    });
  });
  
  describe('POST Testa a funcao que vai criar um novo chocolate', function () {
    it('Testa se esta criando um novo chocolate com status 201 com id 9', async function () {
      sinon.stub(fs.promises, 'writeFile').resolves(JSON.stringify(mockFile));
      const response = await chai.request(app).post(CHOCOLATES).send({
        name: 'Meu super chocolate',
        brandId: 2,
      });
      
      expect(response.status).to.be.equal(201);
      expect(response.body).to.deep.equal({
        id: 4,
        name: 'Meu super chocolate',
        brandId: 2,
      });
      
      sinon.restore();
    });
  });
  
  describe('Testa o metodo get caso o id nao exista ou caso a pessoa n digite um num', function () {
    it('Testa se aparece a msg de not found caso o id nao exista!', async function () {
      sinon.stub(fs.promises, 'readFile').resolves(JSON.stringify(mockFile));
      
      const response = await chai.request(app).get(`${CHOCOLATES}/10`);

      expect(response.status).to.be.equal(404);
      expect(response.body).to.deep.equal({ message: 'Chocolate not found' });

      sinon.restore();
    });

    it('Testa se aparece a msg de id invalido caso o id nao seja um numero!', async function () {
      sinon.stub(fs.promises, 'readFile').resolves(JSON.stringify(mockFile));
      
      const response = await chai.request(app).get(`${CHOCOLATES}/xablau`);

      expect(response.status).to.be.equal(400);
      expect(response.body).to.deep.equal({ message: 'ID inválido, digite um número!' });

      sinon.restore();
    });
  });
});