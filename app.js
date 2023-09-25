require('dotenv').config();

const express = require('express');
const app = express();

var cron = require('node-cron');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const dealDetails = require("./models/deal")
let bodyParser = require('body-parser');
let cors = require('cors');
let resHandler = require('./handlers/responseHandler');

let generateNewToken = require('./middlewares/verifyRefreshToken');

const socket = require("socket.io");
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

app.use(express.static(path.join(__dirname, "public/deals")));
app.use("/deals_images", express.static("public/deals"));

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
app.use('/userContactLog', require('./routers/contactlogtypeRoute'));
app.use('/template', require('./routers/templateRoute'));
app.use('/template/select', require('./routers/templateSelectedRoute'));
app.use('/otp', require('./routers/otpRoute'));
app.use('/about', require('./routers/aboutRoute'));
app.use('/favourite', require('./routers/favouriteRoute'));
app.use('/feed', require('./routers/feedRoute'));
app.use('/firebase', require('./routers/firbaseRoute'));
app.use('/product', require('./routers/productRoute'));
app.use('/deal', require('./routers/dealRouter'));
app.use('/contact', require('./routers/contactRoute'));
app.use('/cart', require('./routers/cartRoute'));
app.use('/chat', require('./routers/chatRoute'));
app.use('/order', require('./routers/orderRoute'));
app.use('/message', require('./routers/userChatRoute'));
app.use('/tandc', require('./routers/tandcRoute'));

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

cron.schedule('0 1 * * *', () => {
	console.log('Running a job at 01:00 at Asia/Kolkata timezone');
	closeDeals();
  }, {
	scheduled: true,
	timezone: "Asia/Kolkata"
  },
  )

function  closeDeals() {
	return new Promise(async (resolve, reject) => {
		var start = new Date();
		start.setHours(0,0,0,0);
		var end = new Date();
		dealDetails.updateMany(
			{ date: {$lt: start} },
			{ $set: { is_active: false } }
		  )
		  .then(x=>{
			console.log("Close Deals Are Working...",x)
			// resolve({
			// 	code: 200,
			// 	msg: "Product updated successfully",
			// });
		}).catch(err=>{
			console.log("Close Deals Are Not Working...",x)
			// reject({
			// 	code: 400,
			// 	Error: `${err}`,
			// });
		  })	
		})
}




let server = app.listen(port, console.log(`Listening to port ${port}...`));


const io = socket(server, {
	cors: {
	  origin: "*",
	  credentials: true,
	},
  });


global.onlineUsers = new Map();
io.on("connection", (socket) => {
	console.log("Io Connection Done===========>",socket)
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
	console.log("add-user Done===========>",userId)
    onlineUsers.set(userId, socket.id);
	console.log("onlineUsers Done===========>",userId)
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
	console.log("sendUserSocket OutSide=========>",sendUserSocket,data)
    if (sendUserSocket) {
	  console.log("sendUserSocket Inside=========>",sendUserSocket,data,data.msg)
      socket.to(sendUserSocket).emit("msg-recieve",data);
    }
  });
});

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


