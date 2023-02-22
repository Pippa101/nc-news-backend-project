function customErrorHandler(error, req, res, next) {
  if (error.msg && error.status) {
    res.status(error.status).send({ msg: error.msg });
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

function catch500(error, req, res, next) {
  return res.status(500).send({ msg: "Server error" });
}
module.exports = {
  customErrorHandler,
  psqlErrorHandler,
  catch500,
};
