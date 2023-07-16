const router = require("express").Router();
const SelectedTemplateController = require("../controllers/templateSelectedController");
const checkAuth = require("../middlewares/auth");

let resHandler = require("../handlers/responseHandler");

function getSelectedTemplate(req, res) {
  SelectedTemplateController.getSelectedTemplate(req)
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

function addSelectedTemplate(req, res) {
  SelectedTemplateController.addSelectedTemplate(req)
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
 * /template/select/:
 *  get:
 *    tags:
 *      - Selected Template
 *    description: Get details of selectedTemplate
 *    parameters:
 *    - in: query
 *      name: userid
 *      description: get detail of a particular user's selectedTemplate
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.get("/", checkAuth, getSelectedTemplate);

/**
 * @swagger
 * /template/select/:
 *  post:
 *    tags:
 *      - Selected Template
 *    description: Add new SelectedTemplate
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: selectedTemplate's body that needs to be saved
 *      schema:
 *          type: object
 *          properties:
 *              userid:
 *                  type: string
 *              selected:
 *                  type: string
 *              name:
 *                  type: string
 *              designation:
 *                  type: string
 *              mob_no:
 *                  type: string
 *              website:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.post("/", checkAuth, addSelectedTemplate);

module.exports = router;
