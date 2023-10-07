var express = require('express');
var router = express.Router();
var ratingController = require('../controllers/ratingController');
const checkAuth = require("../middlewares/auth");

let resHandler = require("../handlers/responseHandler");

//Get Customer

function addRating(req, res) {
    ratingController.addRating(req)
    .then((data) => {
      if (data.code == 204) {
        res
          .status(200)
          .json(resHandler(data.code, data.result ? data.result : data.msg));
      } else {
        res
          .status(data.code)
          .json(resHandler(data.code, data.result ? data.result : data.msg));
      }
    })
    .catch((error) => {
      res.status(error.code).json(resHandler(error.code, error.msg));
    });
}



function editRating(req, res) {
    ratingController.editRating(req)
    .then((data) => {
      if (data.code == 204) {
        res
          .status(200)
          .json(resHandler(data.code, data.result ? data.result : data.msg));
      } else {
        res
          .status(data.code)
          .json(resHandler(data.code, data.result ? data.result : data.msg));
      }
    })
    .catch((error) => {
      res.status(error.code).json(resHandler(error.code, error.msg));
    });
}

function getRating(req, res) {
    ratingController.getRating(req)
    .then((data) => {
      if (data.code == 204) {
        res
          .status(200)
          .json(resHandler(data.code, data.result ? data.result : data.msg));
      } else {
        res
          .status(data.code)
          .json(resHandler(data.code, data.result ? data.result : data.msg));
      }
    })
    .catch((error) => {
      res.status(error.code).json(resHandler(error.code, error.msg));
    });
}


router.post('/addRating',checkAuth, addRating);
router.get('/getRating',checkAuth, getRating);
router.put('/updateRating',checkAuth, editRating);
// router.get('/getRatings',checkAuth, ratingController.getRatings);
// router.get('/getRatingCounts',checkAuth, ratingController.getRatingCounts);
// router.get('/getRatingStatus',checkAuth, ratingController.getRatingStatus);
// router.put('/updateRating',checkAuth, ratingController.updateRating);
// router.delete('/ribbonDelete/:id', ribbon_Controller.deleteRibbon);

module.exports = router;
