const router = require("express").Router();
const dealController = require("../controllers/dealController");
const multer = require("multer");
const checkAuth = require("../middlewares/auth");
const fs = require('fs');

let resHandler = require("../handlers/responseHandler");

let Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/deals");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  // } else {
    // cb(null, true);
    // cb(new Error("Invalid business logo"), false);
  // }
};

let upload = multer({
  storage: Storage,
  fileFilter,
});

function getDeal(req, res) {
  dealController.getDeal(req)
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

function getDealById(req, res) {
	dealController.getDealById(req)
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
  

function addDeal(req, res) {
  // if (!req.file || !req.file.path) {
  //   throw new Error("Image path missing!!!");
  // }
  req.body.deal_image = req.file && req.file.path ? req.file.path : null;
  console.log("Image",req.body);
  dealController.addDeal(req)
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

function decodeBase64Image(dataString) {
  // var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  // if (matches.length !== 3) {
  //   return new Error('Invalid input string');
  // }

  // response.type = matches[1];
  // response.data = new Buffer(matches[2], 'base64');

  //   if (dataString.length > 0) {
  //   return new Error('Invalid input string');
  // }

  response.type = dataString;
  response.data = new Buffer(dataString, 'base64');

  return response;
}


function addNewDeal(req, res) {
  // if (!req.file || !req.file.path) {
  //   throw new Error("Image path missing!!!");
  // }
  // req.body.deal_image = req.file && req.file.path ? req.file.path : null;
  var imageBuffer = decodeBase64Image(req.body.deal_image);
console.log(imageBuffer);
let imagePath = `public/deals/${Date.now() + "-" + req.body.image_name}`
fs.writeFile(imagePath, imageBuffer.data, function(err) {
  req.body.deal_image = imagePath;
  dealController.addDeal(req)
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
 });
  console.log("Image",req.body);

}


/**
 * @swagger
 * /deal/:
 *  get:
 *    tags:
 *      - Deals
 *    description: Get details of all users or a particular user
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.get("/",  getDeal);


/**
 * @swagger
 * /deal/:
 *  get:
 *    tags:
 *      - Deals
 *    description: Get details of all users or a particular user
 *    parameters:
 *    - in: params
 *      name: userid
 *      description: get detail of a particular user
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.get("/:userid",  getDealById);

/**
 * @swagger
 * /deal/:
 *  post:
 *    tags:
 *      - Deals
 *    description: Add new Deal
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: user's body that needs to be saved
 *      schema:
 *          type: object
 *          properties:
 *              userid:
 *                  type: string
 *              businesslogo:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */

/*
 *              worktimein:
 *                  type: string
 *              worktimeout:
 *                  type: string
 *              designation:
 *                  type: string
*/
// router.post("/",  upload.single("deal_image"), addDeal);


router.post("/", addNewDeal);

module.exports = router;
