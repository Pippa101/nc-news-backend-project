function errorHandler400s(error, res, req, next) {
  return res.status(404).send({ msg: "404 error path not found" });
}

function errorHandler500(error, res, req, next) {
  return res.status(500).send({ msg: "500 error server issue" });
}
module.exports = { errorHandler400s, errorHandler500 };
