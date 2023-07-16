const router = require("express").Router();
const FavouriteController = require("../controllers/favouriteController");
const multer = require("multer");
const checkAuth = require("../middlewares/auth");

let resHandler = require("../handlers/responseHandler");

function getFavourite(req, res) {
  FavouriteController.getFavourite(req)
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

function addFavourite(req, res) {
  FavouriteController.addFavourite(req)
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

function deleteFavourite(req, res) {
  FavouriteController.deleteFavourite(req)
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

/**
 * @swagger
 * /favourite/:
 *  get:
 *    tags:
 *      - Favourite
 *    description: Get details of all favourites User
 *    parameters:
 *    - in: query
 *      name: userid
 *      description: get detail of a particular user's favourite
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.get("/", checkAuth, getFavourite);

/**
 * @swagger
 * /favourite/:
 *  post:
 *    tags:
 *      - Favourite
 *    description: Add new Favourite
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: favourite's body that needs to be saved
 *      schema:
 *          type: object
 *          properties:
 *              userid:
 *                  type: string
 *              favourite:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.post("/", checkAuth, addFavourite);

/**
 * @swagger
 * /favourite/:
 *  delete:
 *    tags:
 *      - Favourite
 *    description: Delete Favourite
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: Favourite id and user id
 *      schema:
 *          type: object
 *          properties:
 *              favourite:
 *                  type: string
 *              userid:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
 router.delete('/', checkAuth, deleteFavourite)

module.exports = router;
