const router = require("express").Router();
const UserController = require("../controllers/userController");
const ReviewController = require("../controllers/reviewController");
const multer = require("multer");
const checkAuth = require("../middlewares/auth");

let resHandler = require("../handlers/responseHandler");

let Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/businesslogos");
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

function getUser(req, res) {
  UserController.getUser(req)
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

function addUser(req, res) {
  // if (!req.file || !req.file.path) {
  //   throw new Error("Image path missing!!!");
  // }
  // req.body.businesslogo = req.file && req.file.path ? req.file.path : null;
  var imageBuffer = decodeBase64Image(req.body.businesslogo);
  console.log(imageBuffer);
  let imagePath = `public/businesslogos/${Date.now() + "-" + req.body.image_name}`
  
  fs.writeFile(imagePath, imageBuffer.data, function(err) {
    req.body.businesslogo = imagePath;
    UserController.addUser(req)
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

}




function search(req, res) {
  UserController.search(req)
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

function review(req, res) {
  ReviewController.addReview(req)
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

function rating(req, res) {
  ReviewController.addRating(req)
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

function deleteUser(req, res) {
  UserController.deleteUser(req)
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

function toggleIsPrivate(req, res) {
  UserController.toggleIsPrivate(req)
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
 * /user/:
 *  get:
 *    tags:
 *      - User
 *    description: Get details of all users or a particular user
 *    parameters:
 *    - in: query
 *      name: userid
 *      description: get detail of a particular user
 *    - in: query
 *      name: others
 *      description: get detail of a particular user
 *    - in: query
 *      name: search
 *      description: get detail of a particular user
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.get("/", checkAuth, getUser);

/**
 * @swagger
 * /user/:
 *  post:
 *    tags:
 *      - User
 *    description: Add new User
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
 *              name:
 *                  type: string
 *              mob_no:
 *                  type: string
 *              email:
 *                  type: string
 *              occupation:
 *                  type: string
 *              latitude:
 *                  type: string
 *              longitude:
 *                  type: string
 *              company:
 *                  type: string
 *              website:
 *                  type: string
 *              address:
 *                  type: string
 *              businesslogo:
 *                  type: string
 *              about_company:
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
router.post("/", upload.single("businesslogo"), addUser);

/**
 * @swagger
 * /user/search/:
 *  post:
 *    tags:
 *      - User
 *    description: filter
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: search params
 *      schema:
 *          type: object
 *          properties:
 *              search:
 *                  type: string
 *              columns:
 *                  type: array
 *                  items:
 *                    type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.post("/search", checkAuth, search);

/**
 * @swagger
 * /user/review/:
 *  post:
 *    tags:
 *      - User
 *    description: filter
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: search params
 *      schema:
 *          type: object
 *          properties:
 *              userid:
 *                  type: string
 *              from:
 *                  type: string
 *              review:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.post("/review", checkAuth, review);

/**
 * @swagger
 * /user/rating/:
 *  post:
 *    tags:
 *      - User
 *    description: filter
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: search params
 *      schema:
 *          type: object
 *          properties:
 *              userid:
 *                  type: string
 *              from:
 *                  type: string
 *              rating:
 *                  type: number
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.post("/rating", checkAuth, rating);

/**
 * @swagger
 * /user/delete/:
 *  post:
 *    tags:
 *      - User
 *    description: delete user account
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: user's id
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
 router.post("/delete",  deleteUser);

 /**
  * @swagger
  * /user/toggle/private/:
  *  post:
  *    tags:
  *      - User
  *    description: toggle private status
  *    parameters:
  *    - in: body
  *      name: body
  *      required: true
  *      description: user's id
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
  router.post("/toggle/private",  toggleIsPrivate);

module.exports = router;
