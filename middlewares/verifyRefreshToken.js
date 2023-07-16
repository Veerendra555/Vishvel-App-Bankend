const jwt = require('jsonwebtoken');

module.exports = (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, payload) => {
			if (err) {
				reject(err);
			}
			let token = jwt.sign(
				{
					_id: payload._id,
					mob_no: payload.mob_no,
				},
				process.env.JWT_SECRET,
				{
					expiresIn: '1y',
				}
			);
			let refrestToken = jwt.sign(
				{
					_id: payload._id,
					mob_no: payload.mob_no,
				},
				process.env.JWT_REFRESH_SECRET,
				{
					expiresIn: '1y',
				}
			);
			if (token && refrestToken) {
				resolve({
					token,
					refrestToken,
				});
			} else {
				reject(`Error in generating tokens....`);
			}
		});
	});
};
