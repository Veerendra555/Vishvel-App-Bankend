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

function addUser(req, res) {
  // if (!req.file || !req.file.path) {
  //   throw new Error("Image path missing!!!");
  // }
  req.body.businesslogo = req.file && req.file.path ? req.file.path : null;
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
 *              designation:
 *                  type: string
 *              company:
 *                  type: string
 *              website:
 *                  type: string
 *              worktimein:
 *                  type: string
 *              worktimeout:
 *                  type: string
 *              address:
 *                  type: string
 *              businesslogo:
 *                  type: string
 *              latitude:
 *                  type: string
 *              longitude:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.post("/", checkAuth, upload.single("businesslogo"), addUser);

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
 router.post("/delete", checkAuth, deleteUser);

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
  router.post("/toggle/private", checkAuth, toggleIsPrivate);

module.exports = router;
