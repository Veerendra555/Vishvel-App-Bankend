const router = require("express").Router();
const ContactLogTypeController = require("../controllers/contactlogtypeController");
const checkAuth = require("../middlewares/auth");

let resHandler = require("../handlers/responseHandler");

function getContactLogType(req, res) {
  ContactLogTypeController.getContactLogType(req)
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

// function addChat(req, res) {
//   ContactLogTypeController.addChat(req)
//     .then((data) => {
//       if (data.code == 204) {
//         res
//           .status(200)
//           .json(resHandler(data.code, data.result ? data.result : data.msg));
//       } else {
//         res
//           .status(data.code)
//           .json(resHandler(data.code, data.result ? data.result : data.msg));
//       }
//     })
//     .catch((error) => {
//       res.status(error.code).json(resHandler(error.code, error.msg));
//     });
// }

/**
 * @swagger
 * /userContactLog/:
 *  get:
 *    tags:
 *      - Contact Logs
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
//  router.get("/", getChat);
 router.get("/",  getContactLogType);

// /**
//  * @swagger
//  * /userContactLog/:
//  *  post:
//  *    tags:
//  *      - Chat Us
//  *    description: Add new detail
//  *    parameters:
//  *    - in: body
//  *      name: body
//  *      required: true
//  *      description: body that needs to be saved
//  *      schema:
//  *          type: object
//  *          properties:
//  *              fromId:
//  *                  type: string
//  *              toId:
//  *                  type: string
//  *              orderId:
//  *                  type: string
//  *              msg:
//  *                  type: string
//  *    responses:
//  *      '200':
//  *        description: A successful response
//  *      '500':
//  *        description: Internal server error
//  */
// // router.post("/", addChat);
// router.post("/", checkAuth, addChat);

module.exports = router;
