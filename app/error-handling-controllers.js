function errorHandler400s(error, req, res, next) {
  if (error.msg === "couldn't find article") {
    res.status(404).send({ msg: "Article not found" });
  } else {
    next(error);
  }
}

function psqlErrorHandler(error, req, res, next) {
  if (error.code === "22P02") {
    res.status(400).send({ msg: "Invalid ID" });
  } else {
    next(error);
  }
}

function errorHandler500(error, req, res, next) {
  return res.status(500).send({ msg: "500 error server issue" });
}
module.exports = { errorHandler400s, errorHandler500, psqlErrorHandler };
