const router = require('express').Router();
const UserController = require('../controllers/userController');

let resHandler = require('../handlers/responseHandler');

function otpGenerate(req, res) {
    UserController.otpGenerate(req)
        .then(data => {
            res.status(200).json(resHandler(200, data));
        })
        .catch(error => {
            res.status(500).json(resHandler(500, error));
        });
}

function verifyOTP(req, res) {
    UserController.verifyOTP(req)
        .then(data => {
            res.status(200).json(resHandler(200, data));
        })
        .catch(error => {
            res.status(500).json(resHandler(500, error));
        });
}

function resend(req, res) {
    UserController.resend(req)
        .then(data => {
            res.status(200).json(resHandler(200, data));
        })
        .catch(error => {
            res.status(500).json(resHandler(500, error));
        });
}

/**
 * @swagger
 * /otp/generate:
 *  post:
 *    tags:
 *      - OTP
 *    description: generate otp
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: mobile number for verification
 *      schema:
 *          type: object
 *          properties:
 *              mob:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.post('/generate', otpGenerate);

/**
 * @swagger
 * /otp/verify:
 *  post:
 *    tags:
 *      - OTP
 *    description: verify otp
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: mobile number and otp for validation
 *      schema:
 *          type: object
 *          properties:
 *              mob:
 *                  type: string
 *              otp:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.post('/verify', verifyOTP);


/**
 * @swagger
 * /otp/resend:
 *  post:
 *    tags:
 *      - OTP
 *    description: resend otp
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: mobile number for verification
 *      schema:
 *          type: object
 *          properties:
 *              mob:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
router.post('/resend', resend);

module.exports = router;
