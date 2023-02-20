const { fetchTopics } = require("./models");
function getApiMsg(req, res, next) {
  return res.status(200).send({ msg: "server working" }).catch(next);
}

function getTopics(req, res, next) {
  return fetchTopics()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch(next);
}

module.exports = { getApiMsg, getTopics };
