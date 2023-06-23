// MOCHA - test runner

const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
const { app } = require('../../src/app');

chai.use(chaiHttp);

describe('Apresnetando o mocha e o chai', function () {
  it('/GET /hello deve retornar status 200 e mensagem Hello World', async function () {
    const response = await chai.request(app).get('/hello');

    expect(response.status).to.be.equal(200);
    expect(response.body).to.deep.equal({ message: 'Hello World' });
  });
});