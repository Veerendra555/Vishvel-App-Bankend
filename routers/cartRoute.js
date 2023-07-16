const router = require('express').Router();
let CartController = require('../controllers/cartController');
const checkAuth = require('../middlewares/auth');
let resHandler = require('../handlers/responseHandler');

function getCartItem(req, res) {
	CartController.getCartItem(req)
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

function addCartItem(req, res) {
	CartController.addCartItem(req)
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

function deleteCartItem(req, res) {
	CartController.deleteCartItem(req)
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

function emptyCart(req, res) {
	CartController.emptyCart(req)
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
 * /cart/:
 *  get:
 *    tags:
 *      - Cart
 *    description: Get all items in the cart
 *    parameters:
 *    - in: query
 *      name: userId
 *      required: true
 *      description: get cart details on particular user
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
// router.get('/', getCartItem);
router.get('/', checkAuth, getCartItem);
/**
 * @swagger
 * /cart/add:
 *  post:
 *    tags:
 *      - Cart
 *    description: Add new item in cart
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: item data to be added
 *      schema:
 *          type: object
 *          properties:
 *              userId:
 *                  type: string
 *              productId:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
// router.post('/add', addCartItem);
router.post('/add', checkAuth, addCartItem);

/**
 * @swagger
 * /cart/remove:
 *  post:
 *    tags:
 *      - Cart
 *    description: Remove an existing item from the cart
 *    parameters:
 *    - in: body
 *      name: body
 *      description: Data of item to be removed.
 *      schema:
 *          type: object
 *          properties:
 *              userId:
 *                  type: string
 *              productId:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
// router.post('/remove', deleteCartItem);
router.post('/remove', checkAuth, deleteCartItem);
/**
 * @swagger
 * /cart/:
 *  delete:
 *    tags:
 *      - Cart
 *    description: Empty Cart of user
 *    parameters:
 *    - in: body
 *      name: userId
 *      description: empty cart of particular user
 *      schema:
 *          type: object
 *          properties:
 *              userId:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
// router.delete('/', emptyCart);
router.delete('/', checkAuth, emptyCart);

module.exports = router;
