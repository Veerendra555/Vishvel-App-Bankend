const router = require("express").Router();
const AboutController = require("../controllers/aboutController");
const checkAuth = require("../middlewares/auth");

let resHandler = require("../handlers/responseHandler");

function getAbout(req, res) {
  AboutController.getAbout(req)
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

function addAbout(req, res) {
  AboutController.addAbout(req)
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
 * /about/:
 *  get:
 *    tags:
 *      - About Us
 *    description: Get details
 *    parameters:
 *    - in: query
 *      name: userid
 *      description: get detail of a particular user
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.get("/", checkAuth, getAbout);

/**
 * @swagger
 * /about/:
 *  post:
 *    tags:
 *      - About Us
 *    description: Add new detail
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: body that needs to be saved
 *      schema:
 *          type: object
 *          properties:
 *              userid:
 *                  type: string
 *              aboutus:
 *                  type: string
 *              experience:
 *                  type: string
 *              achievements:
 *                  type: string
 *              education:
 *                  type: string
 *              skills:
 *                  type: string
 *              other:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.post("/", checkAuth, addAbout);

module.exports = router;
