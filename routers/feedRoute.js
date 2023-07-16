const router = require('express').Router();
const FeedController = require('../controllers/feedController');
const multer = require('multer');
const checkAuth = require('../middlewares/auth');

let resHandler = require('../handlers/responseHandler');
const feedController = require('../controllers/feedController');

let Storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (file.fieldname === 'businesslogo') {
			cb(null, 'public/businesslogos');
		} else {
			// else uploading image
			cb(null, 'public/feedimages');
		}
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	// if (
	// 	file.mimetype == 'image/jpeg' ||
	// 	file.mimetype == 'image/png' ||
	// 	file.mimetype == 'image/jpg' ||
	// 	file.mimetype == 'application/pdf'
	// ) {
	cb(null, true);
	// } else {
	// 	cb(new Error('Invalid feed, only image and pdf allowed!!!'), false);
	// }
};

let upload = multer({
	storage: Storage,
	fileFilter,
});

function getFeed(req, res) {
	FeedController.getFeed(req)
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

function addFeed(req, res) {
	if (!req.files || req.files.length == 0) {
		throw new Error('Image path missing!!!');
	}
	req.body.image =
		req.files.image && req.files.image[0] ? req.files.image[0].path : null;
	// req.body.businesslogo = req.files.businesslogo && req.files.businesslogo[0]
	// 	? req.files.businesslogo[0].path
	// 	: null;
	FeedController.addFeed(req)
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
// 	feedController.updateFeed(req)
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
	feedController
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
router.get('/', checkAuth, getFeed);

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
	upload.fields([
		{
			name: 'image',
			maxCount: 1,
		},
		// {
		// 	name: 'businesslogo',
		// 	maxCount: 1,
		// },
	]),
	addFeed
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
