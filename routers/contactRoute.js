const router = require("express").Router();
const ContactController = require("../controllers/contactController");
const checkAuth = require("../middlewares/auth");

let resHandler = require("../handlers/responseHandler");

function getContact(req, res) {
    ContactController.getContact(req)
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

function addContact(req, res) {
    ContactController.addContact(req)
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

function reportContact(req, res) {
    ContactController.reportContact(req)
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


function blockContact(req, res) {
    ContactController.blockedContact(req)
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

function getBlockContact(req, res) {
    ContactController.getBlockedList(req)
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

function unblockContact(req, res) {
    ContactController.unblockContact(req)
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
 * /contact/:
 *  get:
 *    tags:
 *      - Contacts
 *    description: Get details
 *    parameters:
 *    - in: query
 *      name: userid
 *      description: get detail of a particular user
 *    - in: query
 *      name: latitude
 *      description: get distance from this latitude
 *    - in: query
 *      name: longitude
 *      description: get distance from this longitude
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.get("/", checkAuth, getContact);
// router.get("/", getContact);

/**
 * @swagger
 * /contact/:
 *  post:
 *    tags:
 *      - Contacts
 *    description: Add new contact
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
 *              contacts:
 *                  type: array
 *                  items:
 *                      type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.post("/", addContact);

router.post("/reportContact", checkAuth, reportContact);
router.post("/blockContact", checkAuth, blockContact);
router.post("/unblockContact", checkAuth, unblockContact);
router.get("/getblockContact", checkAuth, getBlockContact);
// router.post("/", addContact);

module.exports = router;