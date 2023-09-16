const router = require("express").Router();
const ChatController = require("../controllers/userChatController");
const checkAuth = require("../middlewares/auth");

let resHandler = require("../handlers/responseHandler");

function getChat(req, res) {
  ChatController.getChat(req)
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

router.post("/addMessage", ChatController.addMessage);
router.post("/getMessage", ChatController.getMessages);

module.exports = router;

// function addChat(req, res) {
//   ChatController.addMessage(req)
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

// function getUserChat(req, res) {
//   ChatController.getMessages(req)
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
 * /chat/:
 *  get:
 *    tags:
 *      - Chat Us
 *    description: Get details
 *    parameters:
 *    - in: query
 *      name: fromId
 *      description: get detail of a particular sender
 *    - in: query
 *      name: toId
 *      description: get detail of a particular reciever
 *    - in: query
 *      name: orderId
 *      description: get detail of a particular order
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
//  router.get("/", getChat);
//  router.get("/", checkAuth, getChat);

/**
 * @swagger
 * /chat/:
 *  post:
 *    tags:
 *      - Chat Us
 *    description: Add new detail
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: body that needs to be saved
 *      schema:
 *          type: object
 *          properties:
 *              fromId:
 *                  type: string
 *              toId:
 *                  type: string
 *              orderId:
 *                  type: string
 *              msg:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
// router.post("/", addChat);
// router.post("/", addChat);



// router.post("/",  getUserChat);

// module.exports = router;
