const router = require('express').Router();
const TemplateController = require('../controllers/templateController');
const multer = require('multer');
const checkAuth = require('../middlewares/auth');

let resHandler = require('../handlers/responseHandler');

let Storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/cardtemplates');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	// if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
		cb(null, true);
	// } else {
	// 	cb(new Error('Invalid template'), false);
	// }
};

let upload = multer({
	storage: Storage,
	fileFilter,
});

function getTemplate(req, res) {
	TemplateController.getTemplate(req)
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

function addTemplate(req, res) {
	if (!req.file || !req.file.path) {
		res.status(400).json(resHandler(400, 'Image path missing!!!'));
	}
	req.body.template = req.file.path;
	TemplateController.addTemplate(req)
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
 * /template/:
 *  get:
 *    tags:
 *      - Template
 *    description: Get details of all templates or a particular template
 *    parameters:
 *    - in: query
 *      name: userid
 *      description: get detail of a particular user's template
 *    - in: query
 *      name: templateid
 *      description: get detail of a particular template
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.get('/', checkAuth, getTemplate);

/**
 * @swagger
 * /template/:
 *  post:
 *    tags:
 *      - Template
 *    description: Add new Template
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: template's body that needs to be saved
 *      schema:
 *          type: object
 *          properties:
 *              color:
 *                  type: string
 *              template:
 *                  type: string
 *              template_type:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.post('/', checkAuth, upload.single('template'), addTemplate);

module.exports = router;
