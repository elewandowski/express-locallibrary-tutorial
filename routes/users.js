var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/cool', function(req, res, next) {
  res.send('you are a good developer');
});

router.get("/:userid/books/:bookid",function (req, res) {
  const responseString = `${req.params.userid} + ${req.params.bookid}`
  res.send(responseString)
})

module.exports = router;
