const router = require('express').Router();
const OrderController = require('../controllers/orderController');
const checkAuth = require('../middlewares/auth');

let resHandler = require('../handlers/responseHandler');

function getOrder(req, res) {
	OrderController.getOrder(req)
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

function addOrder(req, res) {
	OrderController.addOrder(req)
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

function cancelOrder(req, res) {
	OrderController.cancelOrder(req)
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

function updateOrderStatus(req, res) {
	OrderController.updateOrderStatus(req)
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
 * /order/:
 *  get:
 *    tags:
 *      - Order
 *    description: Get details
 *    parameters:
 *    - in: query
 *      name: _id
 *      description: get detail of a particular order
 *    - in: query
 *      name: customerId
 *      description: get detail of a particular customer
 *    - in: query
 *      name: ownerId
 *      description: get detail of a particular owner
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
// router.get('/', getOrder);
 router.get("/", checkAuth, getOrder);

/**
 * @swagger
 * /order/:
 *  post:
 *    tags:
 *      - Order
 *    description: Add new detail
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: body that needs to be saved
 *      schema:
 *          type: object
 *          properties:
 *              customerId:
 *                  type: string
 *              address:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
// router.post('/', addOrder);
router.post("/", checkAuth, addOrder);

/**
 * @swagger
 * /order/cancel/:
 *  post:
 *    tags:
 *      - Order
 *    description: Cancel Order
 *    parameters:
 *    - in: body
 *      name: body
 *      description: Cancel Order
 *      schema:
 *          type: object
 *          properties:
 *              id:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
// router.post('/cancel', cancelOrder);
 router.post('/cancel', checkAuth, cancelOrder);

 
/**
 * @swagger
 * /order/update/status/:
 *  post:
 *    tags:
 *      - Order
 *    description: Update Order status
 *    parameters:
 *    - in: body
 *      name: body
 *      description: Update Order status
 *      schema:
 *          type: object
 *          properties:
 *              id:
 *                  type: string
 *              status:
 *                  type: string
 *                  enum: [accepted, rejected, placed, delivered]
 *                  example: accepted, rejected, placed, delivered
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.post('/update/status', checkAuth, updateOrderStatus);
// router.post('/update/status', updateOrderStatus);
module.exports = router;
