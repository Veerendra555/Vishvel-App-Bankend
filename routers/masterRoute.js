const router = require('express').Router();
const checkAuth = require('../middlewares/auth');

let resHandler = require('../handlers/responseHandler');
const tandcController = require('../controllers/masterController');


function getMasterData(req, res) {
	tandcController.getMasterData(req)
		.then((data) => {
			if (data.code == 204) {
				res.status(200).json(
					resHandler(data.code, data.result ? data.result : data.msg)
				);
			} else {
				res.status(data.code).json(
					resHandler(data.code, data.result ? data.result : data.msg)
				);
			}
		})
		.catch((error) => {
			res.status(error.code).json(resHandler(error.code, error.msg));
		});
}

function addMasterData(req, res) {
	tandcController.addMasterData(req)
		.then((data) => {
			if (data.code == 204) {
				res.status(200).json(
					resHandler(data.code, data.result ? data.result : data.msg)
				);
			} else {
				res.status(data.code).json(
					resHandler(data.code, data.result ? data.result : data.msg)
				);
			}
		})
		.catch((error) => {
			res.status(error.code).json(resHandler(error.code, error.msg));
		});
}

// function updateFeed(req, res) {
// 	tandcController.updateFeed(req)
// 		.then((data) => {
// 			if (data.code == 204) {
// 				res.status(200).json(
// 					resHandler(data.code, data.result ? data.result : data.msg)
// 				);
// 			} else {
// 				res.status(data.code).json(
// 					resHandler(data.code, data.result ? data.result : data.msg)
// 				);
// 			}
// 		})
// 		.catch((error) => {
// 			res.status(error.code).json(resHandler(error.code, error.msg));
// 		});
// }

function deleteFeed(req, res) {
	tandcController
		.deleteFeed(req)
		.then((data) => {
			if (data.code == 204) {
				res.status(200).json(
					resHandler(data.code, data.result ? data.result : data.msg)
				);
			} else {
				res.status(data.code).json(
					resHandler(data.code, data.result ? data.result : data.msg)
				);
			}
		})
		.catch((error) => {
			res.status(error.code).json(resHandler(error.code, error.msg));
		});
}

/**
 * @swagger
 * /feed/:
 *  get:
 *    tags:
 *      - Feed
 *    description: Get details of all feeds or a particular user's feed
 *    parameters:
 *    - in: query
 *      name: userid
 *      description: get detail of a particular feed
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.get('/', checkAuth, getMasterData);

/**
 * @swagger
 * /feed/:
 *  post:
 *    tags:
 *      - Feed
 *    description: Add new Feed
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: feed's body that needs to be saved
 *      schema:
 *          type: object
 *          properties:
 *              userid:
 *                  type: string
 *              caption:
 *                  type: string
 *              image:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.post(
	'/',
	checkAuth,
	addMasterData
);

/**
 * @swagger
 * /feed/:
 *  delete:
 *    tags:
 *      - Feed
 *    description: Delete Feed
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: Feed id and user id
 *      schema:
 *          type: object
 *          properties:
 *              id:
 *                  type: string
 *              userid:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.delete('/', checkAuth, deleteFeed);

module.exports = router;
