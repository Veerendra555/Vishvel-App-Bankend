require('dotenv').config();

const Template = require('../models/template');
const userDetail = require('../models/userdetail');
const svgToImg = require("svg-to-img");
const fs = require('fs')
// const { convert } = require('convert-svg-to-png');
const templateList=['Template1.svg','Template2.svg','Template3.svg']
class TemplateController {
	constructor() {}

	getTemplate(req) {
		return new Promise((resolve, reject) => {
			let query = req.query.userid ? { userid: req.query.userid } : {};
			if (req.query.templateid) {
				query._id = req.query.templateid;
			}
			Template.find(query)
				.then((data) => {
					if (data.length == 0) {
						resolve({
							code: 204,
							msg: 'No template found!!!',
						});
					} else {
						resolve({
							code: 200,
							result: data,
						});
					}
				})
				.catch((err) =>
					reject({
						code: 500,
						msg: `${err}`,
					})
				);
		});
	}

	getAllTemplate(req) {
		return new Promise((resolve, reject) => {
			Template.find({})
				.then((data) => {
					if (data.length == 0) {
						resolve({
							code: 204,
							msg: 'No template found!!!',
						});
					} else {
						resolve({
							code: 200,
							result: data,
						});
					}
				})
				.catch((err) =>
					reject({
						code: 500,
						msg: `${err}`,
					})
				);
		});
	}


	updateTemplateStatus(req) {
		return new Promise((resolve, reject) => {
			Template.updateOne({_id:req.body._id},{$set:{isActive: req.body.isActive}})
				.then((data) => {
					if (data.length == 0) {
						resolve({
							code: 204,
							msg: 'No template found!!!',
						});
					} else {
						resolve({
							code: 200,
							msg: "Template Stataus Updated successfully",
						});
					}
				})
				.catch((err) =>
					reject({
						code: 500,
						msg: `${err}`,
					})
				);
		});
	}


	getCards(req) {
		console.log("get Cards Calling..")
		return new Promise((resolve, reject) => {
			console.log("get Cards Calling..1")
			try {
			userDetail.findOne({userid:req.params.userid})
				.then(async (data) => {
					if (data.length == 0) {
						resolve({
							code: 204,
							msg: 'No template found!!!',
						});
					} else {
						console.log(data,"data==,>",process.env.SERVERPATHLOCAL,process.env.SERVERPATHLIVE)
						let newTemplateList = [];
						
						var dir = `${__dirname}/../public/cards/${req.params.userid}`;
                         if (!fs.existsSync(dir)){
                            await fs.mkdirSync(dir, { recursive: true });
							for(let i=0;i<templateList.length;i++)
							{
							try {
								await fs.readFile(`${__dirname}/../public/cards/${templateList[i]}`, 'utf8',async (err, svgData) => {
									let finalData =	svgData.replace(/User Address/g, data.address )
													   .replace(/UserEmail/g, data.email)
													   .replace(/UserPhone/g, data.mob_no)
													   .replace(/Designation/g, data.occupation)
													   .replace(/UserName/g, data.name)
													   .replace(/Website/g, data.website)
													   .replace(/LogoPath/g, `${process.env.SERVERPATHLOCAL}businesslogo/${data.businesslogo}`)
													   .replace(/Company/g, data.company);
													   
									   console.log("New SVG ==>",finalData);
									   await  fs.writeFileSync(`${__dirname}/../public/cards/${req.params.userid}/${templateList[i]}`, finalData);
									   newTemplateList.push(`${req.params.userid}/${templateList[i]}`);
									   if(templateList.length === newTemplateList.length) 
									   {
										  console.log("Respoce Sent")
										  resolve({
											  code: 200,
											  result: newTemplateList,
										  });
									   }
									   if (err) {
										 console.error(err);
									   //   return res.status(500).send('Error reading SVG file');
															   reject({
												   code: 204,
												   msg: 'No template found!!!',
											   });
									   }
								   });
									// file written successfully
								  } catch (err) {
									console.error(err);
									reject({
										code: 204,
										msg: 'No template found!!!',
									});
								  }
							} 
                           }
                         else{
							let newTemplateList = [];
							for(let i=0;i<templateList.length;i++)
							{
								newTemplateList.push(`${req.params.userid}/${templateList[i]}`);
							}
                 		resolve({
							code: 200,
							result: newTemplateList,
						});
						 }
						// resolve({
						// 	code: 200,
						// 	result: data,
						// });
					}
				})
				.catch((err) =>
					reject({
						code: 500,
						msg: `${err}`,
					})
				);			
			} catch (error) {
				console.log(error);
				reject({
					code: 204,
					msg: 'No template found!!!',
				});
			}
			// var svgs = [];
			// let links = [""]
			// async.eachSeries(links, function(link, next) {
			//   fs.readFile(link, function(err, svg) {
			// 	svgs.push(svg);
			// 	next(err);
			//   });
			// }, function(err) {
			//   if (err) {
			// 							resolve({
			// 				code: 204,
			// 				msg: 'No template found!!!',
			// 			});
			// 	// response.writeHead(500);
			// 	// response.end(JSON.stringify(err));
			// 	// return;
			//   }
			//   					resolve({
			// 				code: 200,
			// 				result: JSON.stringify(svgs),
			// 			});
			// //   response.writeHead(200);
			// //   response.end(svgs); // Doesn't work
			//   // response.end(svgs[0]); // Works
			// });
			// Template.find(query)
			// 	.then((data) => {
			// 		if (data.length == 0) {
			// 			resolve({
			// 				code: 204,
			// 				msg: 'No template found!!!',
			// 			});
			// 		} else {
			// 			resolve({
			// 				code: 200,
			// 				result: data,
			// 			});
			// 		}
			// 	})
			// 	.catch((err) =>
			// 		reject({
			// 			code: 500,
			// 			msg: `${err}`,
			// 		})
			// 	);
		});
	}

	addTemplate(req) {
		return new Promise(async (resolve, reject) => {
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			} else if (
				!req.body.template
			) {
				reject({
					code: 400,
					msg: 'Template missing!!!',
				});
			} else {
				let data = req.body;
				let count  = await Template.countDocuments();

				const template = new Template({
					userid: req.user._id,
					position : count+1,
					template : data.template
				});
				template
					.save()
					.then((data) => {
						resolve({
							code: 200,
							result: data,
							msg:"Template added successfully"
						});
					})
					.catch((err) => {
						reject({
							code: 500,
							msg: `${err}`,
						});
					});
			}
		});
	}
}

module.exports = new TemplateController();
