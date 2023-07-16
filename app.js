require('dotenv').config();

const express = require('express');
const app = express();

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

let bodyParser = require('body-parser');
let cors = require('cors');
let resHandler = require('./handlers/responseHandler');

let generateNewToken = require('./middlewares/verifyRefreshToken');

const port = normalizePort(process.env.PORT || '3000');

const swaggerOptions = {
	swaggerDefinition: {
		info: {
			title: 'Vishvel APP',
			description: 'API Documentation',
			contact: {
				name: 'Anurag Purwar',
			},
			servers: ['http://localhost:3000'],
		},
		// basePath: '/api/v1'
		basePath: '/',
	},
	apis: ['app.js', './routers/*.js'],
};

app.use('/public', express.static('public'));

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use((req, res, next) => {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');

	// Request methods you wish to allow
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, PATCH, DELETE'
	);

	// Request headers you wish to allow
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization'
	);

	//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	// Pass to next layer of middleware
	next();
});
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

app.use('/user', require('./routers/userRoute'));
app.use('/template', require('./routers/templateRoute'));
app.use('/template/select', require('./routers/templateSelectedRoute'));
app.use('/otp', require('./routers/otpRoute'));
app.use('/about', require('./routers/aboutRoute'));
app.use('/favourite', require('./routers/favouriteRoute'));
app.use('/feed', require('./routers/feedRoute'));
app.use('/product', require('./routers/productRoute'));
app.use('/contact', require('./routers/contactRoute'));
app.use('/cart', require('./routers/cartRoute'));
app.use('/chat', require('./routers/chatRoute'));
app.use('/order', require('./routers/orderRoute'));

/**
 * @swagger
 * /:
 *  get:
 *    tags:
 *    - Home
 *    description: Just a welcome endpoint
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.get('/', (req, res) => {
	res.status(200).json({
		code: 200,
		msg: 'Welcome to server!!!',
	});
});


/**
 * @swagger
 * /refresh-token/:
 *  post:
 *    tags:
 *      - Refresh Token
 *    description: Generate new Tokens
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: refresh token nees to be passed to generate new tokens
 *      schema:
 *          type: object
 *          properties:
 *              refreshToken:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */
app.post('/refresh-token', async (req, res) => {
	try {
		const { refreshToken } = req.body;
		if (!refreshToken) {
			res.status(400).json(resHandler(400, `Refresh Token Missing!!!`));
		} else {
			generateNewToken(refreshToken)
				.then((tokens) => {
					res.status(200).json(resHandler(200, tokens));
				})
				.catch((error) => {
					res.status(500).json(resHandler(500, error));
				});
		}
	} catch (error) {
		res.status(500).json(resHandler(500, error));
	}
});

app.listen(port, console.log(`Listening to port ${port}...`));

function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}
