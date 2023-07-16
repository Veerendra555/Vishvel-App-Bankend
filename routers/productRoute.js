const router = require('express').Router();
const ProductController = require('../controllers/productController');
const multer = require('multer');
const checkAuth = require('../middlewares/auth');

let resHandler = require('../handlers/responseHandler');

let Storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (file.fieldname.localeCompare('categoryimage') == 0) {
			cb(null, 'public/categoryimages');
		} else {
			cb(null, 'public/productimages');
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
	// 	cb(new Error('Invalid product, only image and pdf allowed!!!'), false);
	// }
};

let upload = multer({
	storage: Storage,
	fileFilter,
});

function getProduct(req, res) {
	ProductController.getProduct(req)
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

function addProduct(req, res) {
	if (!req.files && !req.files.image) {
		throw new Error('Image path missing!!!');
	}
	if (!req.files && !req.files.categoryimage) {
		throw new Error('Category Image path missing!!!');
	}
	const images = [];
	req.files.image.map((x) => {
		images.push(x.path);
	});
	req.body.images = images;
	req.body.category_image = req.files.categoryimage[0].path;
	ProductController.addProduct(req)
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

function editProduct(req, res) {
	// if (!req.files && !req.files.image) {
	// 	throw new Error('Image path missing!!!');
	// }
	// if (!req.files && !req.files.categoryimage) {
	// 	throw new Error('Category Image path missing!!!');
	// }
	// const images = [];
	// req.files.image.map((x) => {
	// 	images.push(x.path);
	// });
	// req.body.images = images;
	// req.body.category_image = req.files.categoryimage[0].path;
	ProductController.editProduct(req)
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

function deleteProduct(req, res) {
	ProductController.deleteProduct(req)
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

function filterCategory(req, res) {
	ProductController.filterCategory(req)
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

function getProductByCategory(req, res) {
	ProductController.getProductByCategory(req)
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
 * /product/:
 *  get:
 *    tags:
 *      - Product
 *    description: Get details of all products or a particular user's product
 *    parameters:
 *    - in: query
 *      name: userid
 *      description: get detail of a particular product
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.get('/', checkAuth, getProduct);
// router.get('/', getProduct);

/**
 * @swagger
 * /product/:
 *  post:
 *    tags:
 *      - Product
 *    description: Add new Product
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: product's body that needs to be saved
 *      schema:
 *          type: object
 *          properties:
 *              userid:
 *                  type: string
 *              name:
 *                  type: string
 *              category:
 *                  type: string
 *              categoryimage:
 *                  type: string
 *              description:
 *                  type: string
 *              image:
 *                  type: array
 *                  items:
 *                    type: string
 *              mrp:
 *                  type: number
 *              sellingPrice:
 *                  type: number
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
		},
		{
			name: 'categoryimage',
			maxCount: 1,
		},
	]),
	addProduct
);

router.put(
	'/',
	checkAuth, 
	upload.fields([
		{
			name: 'image',
		},
		{
			name: 'categoryimage',
			maxCount: 1,
		},
	]),
	editProduct
);
/**
 * @swagger
 * /product/:
 *  delete:
 *    tags:
 *      - Product
 *    description: Delete Product
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: Product id and user id
 *      schema:
 *          type: object
 *          properties:
 *              productid:
 *                  type: string
 *              userid:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
 router.delete('/', checkAuth, deleteProduct)

/**
 * @swagger
 * /product/filter/:
 *  get:
 *    tags:
 *      - Product
 *    description: Get details of all products or a particular user's product
 *    parameters:
 *    - in: query
 *      name: filter
 *      description: get detail of a particular product
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.get('/filter', checkAuth, filterCategory);

/**
 * @swagger
 * /product/category/:
 *  post:
 *    tags:
 *      - Product
 *    description: Get details of all products by category
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: User id
 *      schema:
 *          type: object
 *          properties:
 *              userid:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
 router.post('/category', checkAuth, getProductByCategory);
//  router.post('/category', getProductByCategory);

module.exports = router;
