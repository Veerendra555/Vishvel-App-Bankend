require('dotenv').config();

const Template = require('../models/template');
const userDetail = require('../models/userdetail');
const svgToImg = require("svg-to-img");
const svg64 = require('svg64');
// const cheerio = require('cheerio');
// var xmlserializer = require('xmlserializer');
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
						for(let i=0;i<templateList.length;i++)
						{
					    await fs.readFile(`${__dirname}/../public/cards/${templateList[i]}`, 'utf8',async (err, svgData) => {
						 let finalData =	svgData.replace(/User Address/g, data.address )
						                    .replace(/UserEmail/g, data.email)
											.replace(/UserPhone/g, data.mob_no)
											.replace(/Designation/g, data.occupation)
											.replace(/UserName/g, data.name)
											.replace(/Website/g, data.website)
											.replace(/LogoPath/g, process.env.SERVERPATHLIVE+""+data.businesslogo)
											.replace(/Company/g, data.company);
							console.log("New SVG ==>",finalData);
							// (async () => {
								const png = await svgToImg.from(finalData.toString()).toPng({ encoding: "base64" });
								// console.log("data:image/png;base64," + png);
								newTemplateList.push("data:image/png;base64," + png);
							//   })();
							// fs.readFile(`${__dirname}/../public/cards/${templateList[i]}`, 'utf8',async (err, svgData1) => {
							// })
							// const base64fromSVG = svg64(finalData);
							// console.log(base64fromSVG);
							// Import `readFileSync` from the file system module
							// let s = xmlserializer.serializeToString(finalData)
						// let s = new XMLSerializer().serializeToString(finalData);

							// const png = await convert(finalData);
							// console.log("New PNG ==>",png);
                            //  newTemplateList.push(window.btoa(s));
                            //  newTemplateList.push(finalData);
							 console.log("newTemplateList===>",newTemplateList)
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
							// Modify the SVG data (example: change the color of all <circle> elements)
							// const $ = cheerio.load(svgData);
							// newTemplateList.push(svg)
							// $('circle').attr('fill', 'red'); // Change circle fill color to red
						
							// Send the modified SVG data to the client
							// const modifiedSVG = $.xml();
							// console.log("New Svg==>",modifiedSVG);

							// res.set('Content-Type', 'image/svg+xml');
							// res.send(modifiedSVG);
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
				!req.body.template ||
				!req.body.color ||
				!req.body.icon_color ||
				!req.body.template_type
			) {
				reject({
					code: 400,
					msg: 'Template, color or icon_color missing!!!',
				});
			} else {
				let data = req.body;

				const template = new Template(data);
				template
					.save()
					.then((data) => {
						resolve({
							code: 200,
							result: data,
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
