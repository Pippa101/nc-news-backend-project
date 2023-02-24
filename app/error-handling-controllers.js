function customErrorHandler(error, req, res, next) {
  if (error.msg && error.status) {
    console.log(error);
    res.status(error.status).send({ msg: error.msg });
  } else {
    next(error);
  }
}

function psqlErrorHandler(error, req, res, next) {
  if (error.code === "22P02") {
    res.status(400).send({ msg: "Invalid ID" });
  } else if (error.code === "23503") {
    res.status(404).send({ msg: "Not Found" });
  } else {
    next(error);
  }
}

function catch500(error, req, res, next) {
  res.status(500).send({ msg: "Server error" });
}
module.exports = {
  customErrorHandler,
  psqlErrorHandler,
  catch500,
};
