const validateId = (req, res, next) => {
  const { id } = req.params;

  const idIsNumber = Number(id);

  if (Number.isNaN(idIsNumber)) {
    res.status(400).send({ message: 'ID inválido, digite um número!' });
  } else {
    next();
  }
};

const validateBody = (req, res, next) => {
  const propiedade = ['name', 'brandId'];

  if (propiedade.every((item) => item in req.body)) {
    next();
  } else {
    res.status(400).send({ message: 'Precisa ter todas as chaves necessarias!' });
  }
}; 

module.exports = {
  validateId,
  validateBody,
};