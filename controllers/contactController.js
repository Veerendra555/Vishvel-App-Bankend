require('dotenv').config();

const geolib = require('geolib');
const { ObjectId } = require('mongodb');
const contact = require('../models/contacts');

const Contact = require('../models/contacts');
const UserDetails = require('../models/userdetail');
const contactLogType = require('../models/contactlogtype');
const User = require('../models/user');
var nodemailer = require('nodemailer');

class ContactController {
    constructor() { }

    getCurrentDistance(location, index) {
        return new Promise((resolve, reject) => {
            try {
                const dist = geolib.getDistance({
                    latitude: location.latitude,
                    longitude: location.longitude,
                },
                    index.location
                );
                resolve(dist);
            } catch (e) {
                reject({
                    code: 500,
                    msg: `${err}`,
                });
            }
        });
    }

    // getResult(data, users, req) {
    // 	return new Promise((resolve, reject) => {
    // 		const myContacts = [];
    // 		const others = [];
    // 		data.contacts.map(async (x) => {
    // 			let index = users.filter(
    // 				(y) => x.localeCompare(y.mob_no) === 0
    // 			)[0];
    // 			if (index) {
    // 				// console.log('index', index);
    // 				if (req.query.latitude && req.query.longitude) {
    // 					await this.getCurrentDistance(
    // 						{
    // 							latitude: req.query.latitude,
    // 							longitude: req.query.longitude,
    // 						},
    // 						index
    // 					)
    // 						.then((dist) => {
    // 							// console.log('dist', dist);
    // 							if (dist) {
    // 								myContacts.push({
    // 									...index.toObject(),
    // 									distance: dist,
    // 								});
    // 							}
    // 						})
    // 						.catch((err) => {
    // 							reject({
    // 								code: 500,
    // 								msg: `${err}`,
    // 							});
    // 						});
    // 				} else {
    // 					myContacts.push({
    // 						...index.toObject(),
    // 						distance: null,
    // 					});
    // 				}
    // 			} else {
    // 				others.push(x);
    // 			}
    // 		});
    // 		resolve({
    // 			myContacts,
    // 			others,
    // 		});
    // 	});
    // }

    // getContact(req) {
    // 	return new Promise((resolve, reject) => {
    // 		// let query = req.query.userid ? { userid: req.query.userid } : {};
    // 		if (!req.query.userid) {
    // 			Contact.find({})
    // 				.then((data) => {
    // 					if (data.length == 0) {
    // 						resolve({
    // 							code: 204,
    // 							msg: 'No contacts found!!!',
    // 						});
    // 					} else {
    // 						resolve({
    // 							code: 200,
    // 							result: data,
    // 						});
    // 					}
    // 				})
    // 				.catch((err) =>
    // 					reject({
    // 						code: 500,
    // 						msg: `${err}`,
    // 					})
    // 				);
    // 		} else {
    // 			Contact.find({ userid: req.query.userid })
    // 				.then((data) => {
    // 					if (data.length == 0) {
    // 						resolve({
    // 							code: 204,
    // 							msg: 'No contacts found!!!',
    // 						});
    // 					} else {
    // 						data = data[0];
    // 						UserDetails.find({})
    // 							.then(async (users) => {
    // 								if (!users) {
    // 									resolve({
    // 										code: 200,
    // 										result: {
    // 											myContacts,
    // 											others,
    // 										},
    // 									});
    // 								} else {
    // 									users = users.filter((x) => {
    // 										let userid = x.userid;
    // 										return userid != req.query.userid;
    // 									});

    // 									await this.getResult(data, users, req)
    // 										.then((result) => {
    // 											resolve({
    // 												code: 200,
    // 												result: {
    // 													myContacts: result.myContacts.sort(
    // 														(a, b) =>
    // 															a.distance -
    // 															b.distance
    // 													),
    // 													others: result.others,
    // 												},
    // 												// result: {
    // 												// 	myContacts,
    // 												// 	others,
    // 												// },
    // 											});
    // 										})
    // 										.catch((err) =>
    // 											reject({
    // 												code: 500,
    // 												msg: `${err}`,
    // 											})
    // 										);
    // 								}
    // 							})
    // 							.catch((err) =>
    // 								reject({
    // 									code: 500,
    // 									msg: `${err}`,
    // 								})
    // 							);
    // 					}
    // 				})
    // 				.catch((err) =>
    // 					reject({
    // 						code: 500,
    // 						msg: `${err}`,
    // 					})
    // 				);
    // 		}
    // 	});
    // }

    getResult(data, users, req) {
        return new Promise((resolve, reject) => {
            const myContacts = [];
            const others = [];

            users.map(async (x) => {
                const isVishvelUser = data.contacts.filter(
                    // (y) => y.localeCompare(x.mob_no) == 0
                    (y) => {
                        var patt = new RegExp(x.mob_no);
                        return patt.test(y);
                    }
                );
                if (isVishvelUser.length) {
                    const index = x;
                    if (req.query.latitude && req.query.longitude) {
                        await this.getCurrentDistance({
                            latitude: req.query.latitude,
                            longitude: req.query.longitude,
                        },
                            index
                        )
                            .then((dist) => {
                                if (dist) {
                                    myContacts.push({
                                        ...index.toObject(),
                                        distance: dist,
                                    });
                                }
                            })
                            .catch((err) => {
                                reject({
                                    code: 500,
                                    msg: `${err}`,
                                });
                            });
                    } else {
                        myContacts.push({
                            ...index.toObject(),
                            distance: null,
                        });
                    }
                    // myContacts.push(x);
                } else {
                    if (x.isprivate == false) {
                        others.push(x);
                    }
                }
            });

            resolve({
                myContacts,
                others,
            });
        });
    }

    getContact(req) {
        return new Promise((resolve, reject) => {
            // let query = req.query.userid ? { userid: req.query.userid } : {};
            req.query.userid = req.user._id;
            if (!req.query.userid) {
                Contact.find({})
                    .then((data) => {
                        if (data.length == 0) {
                            resolve({
                                code: 204,
                                msg: 'No contacts found!!!',
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
            } else {
                Contact.findOne({
                    userid: req.query.userid,
                })
                    .then((contacts) => {
                        contacts = contacts ?
                            contacts : {
                                contacts: [],
                                blocked:[]
                            };
                        UserDetails.find({
                            isdeleted: false,
                        })
                            .then(async (users) => {
                                let blockedByme = await UserDetails.findOne({userid: req.query.userid});
                                let toDel= blockedByme.blocked
                                toDel= toDel.concat(contacts.blocked)
                                const toDelete = new Set(toDel);
                                // console.log("contactController",toDelete)
                                users = users.filter(obj => !toDelete.has(obj.userid.toString()));
                                const results = await this.getResult(contacts, users, req);
                                // console.log('results', results);

                                resolve({
                                    code: 200,
                                    result: {
                                        myContacts: results.myContacts.sort(
                                            (a, b) => a.distance - b.distance
                                        ),
                                        others: results.others,
                                    },
                                });
                            })
                            .catch((err) =>
                                reject({
                                    code: 500,
                                    msg: `${err}`,
                                })
                            );
                    })
                    .catch((err) =>
                        reject({
                            code: 500,
                            msg: `${err}`,
                        })
                    );
            }
        });
    }

    addContact(req) {
        return new Promise(async(resolve, reject) => {
            console.log(req.body)
            if (!Object.keys(req.body).length) {
                reject({
                    code: 400,
                    msg: 'No data passed in request body!!!',
                });
            } else if (!req.body.userid) {
                reject({
                    code: 400,
                    msg: 'User id missing!!!',
                });
            } else if (!req.body.contacts || req.body.contacts.length == 0) {
                reject({
                    code: 400,
                    msg: 'Contacts missing!!!',
                });
            } else if (req.body._id) {
                req.body._id = ObjectId(req.body._id);
                Contact.findOneAndUpdate({
                    _id: req.body._id,
                },
                    req.body
                )
                    .then((data) => {
                        resolve({
                            code: 200,
                            result: data,
                        });
                    })
                    .catch((e) => {
                        reject({
                            code: 500,
                            msg: `${e}`,
                        });
                    });
            } else if (req.body.userid) {
                console.log("req.body.userid",req.body.userid)
                req.body.userid = ObjectId(req.body.userid);
                let count = await Contact.countDocuments({
                    userid: req.body.userid,
                });
                console.log("Count", count);
                if(count>0)
                {
                Contact.findOne({
                    userid: req.body.userid,
                }
                )
                    .then(async(data) => {
                        console.log("data===>",data)
                        req.body.contacts = req.body.contacts.map((x) => {
                            x = x.replace(/ /g, '');
                            x = x.replace(/-/g, '');
                            return x;
                        });
                       let newList = [...req.body.contacts , ...data.contacts]
                        console.log("New List---->",newList);
                        newList = [...new Set(newList)];
                      let newCreatedList=[];
                     for(let i=0;i<req.body.contacts.length;i++)
                     {
                        let pushNo = true;
                        for(let j=0;j<data.contacts.length;j++)
                        {
                           if(req.body.contacts[i] == data.contacts[j])
                           {
                            pushNo = false;
                            break;
                           }
                        }
                        if(pushNo)
                        {
                         console.log("Array Push...",req.body.contacts[i])
                        newCreatedList.push(req.body.contacts[i]);
                        await this.saveContactLogDetails(req.body.contacts[i],req.body.userid);
                        }
                      }
                      Contact.findOneAndUpdate(
                        {userid: req.body.userid},
                        { $set:
                            {
                            contacts: newList
                            }
                         }
                    ).then(async(finalData) => {
                                console.log("Data Inside Save",finalData )
                                resolve({
                                    code: 200,
                                    result: finalData,
                                });
                            })
                            .catch((e) => {
                                reject({
                                    code: 500,
                                    msg: `${e}`,
                                });
                            });

                        // const contact = new Contact(req.body);
                        // console.log("Contact Calling ",contact)
                        // contact
                        //     .save()
                        //     .then(async(data) => {
                        //         console.log("Data Inside Save",data , contact,contact.contacts)
                        //         for(let i=0; i<contact.contacts.length;i++)
                        //         {
                        //             console.log("Data For Inside Save",contact.contacts[i])
                        //             await this.saveContactLogDetails(contact.contacts[i],req.body.userid);
                        //         }
                        //         console.log("data===>",data,)
                        //         resolve({
                        //             code: 200,
                        //             result: data,
                        //         });
                        //     })
                        //     .catch((e) => {
                        //         reject({
                        //             code: 500,
                        //             msg: `${e}`,
                        //         });
                        //     });

                        // resolve({
                        //     code: 200,
                        //     result: data,
                        // });
                    })
                    .catch((e) => {
                        reject({
                            code: 500,
                            msg: `${e}`,
                        });
                    });
                }
                else
                {
                    req.body.contacts = req.body.contacts.map((x) => {
                        x = x.replace(/ /g, '');
                        x = x.replace(/-/g, '');
                        return x;
                    });
                    
                    const contact = new Contact(req.body);
                    console.log("Contact Calling ",contact)
                    contact
                        .save()
                        .then(async(data) => {
                            console.log("Data Inside Save",data , contact,contact.contacts)
                            for(let i=0; i<contact.contacts.length;i++)
                            {
                                console.log("Data For Inside Save",contact.contacts[i])
                                await this.saveContactLogDetails(contact.contacts[i],req.body.userid);
                            }
                            console.log("data===>",data,)
                            resolve({
                                code: 200,
                                result: data,
                            });
                        })
                        .catch((e) => {
                            reject({
                                code: 500,
                                msg: `${e}`,
                            });
                        });
                }

            } else {
                req.body.contacts = req.body.contacts.map((x) => {
                    x = x.replace(/ /g, '');
                    x = x.replace(/-/g, '');
                    return x;
                });
                
                const contact = new Contact(req.body);
                console.log("Contact Calling ",contact)
                contact
                    .save()
                    .then((data) => {
                        resolve({
                            code: 200,
                            result: data,
                        });
                    })
                    .catch((e) => {
                        reject({
                            code: 500,
                            msg: `${e}`,
                        });
                    });
            }
        });
    }


async saveContactLogDetails(contanctNo,userid)
    {  
//    return new Promise(async(resolve, reject) => { 
      console.log("saveContactLogDetails Calling")
        let data = await UserDetails.findOne({
            mob_no: contanctNo,
        });
        console.log("saveContactLogDetails",data)
        if(data != null)
        {
        const contactlog = new contactLogType({
            userid : userid,
            businessid : data._id.toString(),
        });
        console.log(contactlog,"contactlog")
        contactlog
            .save()
            .then((data) => {
                console.log("ContackLog save",data)
                // resolve({
                //     code: 200,
                //     result: data,
                // });
                return;
            })
            .catch((e) => {
                console.log("ContackLog Not save",data,e)
                return;
                // reject({
                //     code: 500,
                //     msg: `${e}`,
                // });
            });
   
        }
    // })



    }


    blockedContact(req) {
        return new Promise((resolve, reject) => {
            if (!Object.keys(req.body).length) {
                reject({
                    code: 400,
                    msg: 'No data passed in request body!!!',
                });
            } else if (!req.body.userid) {
                reject({
                    code: 400,
                    msg: 'User id missing!!!',
                });
                // } else if (req.body._id) {
                //     req.body._id = ObjectId(req.body._id);
                //     Contact.updateOne({
                //             _id: req.body._id,
                //         }, {
                //             $push: {
                //                 blocked: req.body.contact,
                //             },
                //         })
                //         .then((data) => {
                //             Contact.updateOne({
                //                 _id: req.body._id,
                //             }, {
                //                 $pull: {
                //                     contacts: req.body.contact,
                //                 },
                //             });
                //             resolve({
                //                 code: 200,
                //                 result: data,
                //             });
                //         })
                //         .catch((e) => {
                //             reject({
                //                 code: 500,
                //                 msg: `${e}`,
                //             });
                //         });
            } else {
                req.body.userid = ObjectId(req.body.userid);
                UserDetails.updateOne({
                    userid: ObjectId(req.body.userid),
                }, {
                    $push: {
                        blocked: req.body.contact,
                    },
                })
                    .then((data) => {
                        Contact.updateOne({
                            userid: ObjectId(req.body.userid),
                        }, {
                            $pull: {
                                contacts: req.body.contact,
                            },
                            $push:{
                                blocked: req.body.contact, 
                            }
                        }).then((details)=>{
                            resolve({
                                code: 200,
                                msg: `User Blocked Successfully`,
                            });
                        }).catch((e) => {
                            reject({
                                code: 500,
                                msg: `${e}`,
                            });
                        });
                      
                    })
                    .catch((e) => {
                        reject({
                            code: 500,
                            msg: `${e}`,
                        });
                    });
            }
        });
    }

    getBlockedList(req) {
        return new Promise((resolve, reject) => {
            // let query = req.query.userid ? { userid: req.query.userid } : {};
            req.query.userid = req.user._id;
            if (!req.query.userid) {
                UserDetails.find({})
                    .then((data) => {
                        if (data.length == 0) {
                            resolve({
                                code: 204,
                                msg: 'No contacts found!!!',
                            });
                        } else {
                            // console.log("----->", data)
                            if (!data.blocked) {
                                resolve({
                                    code: 200,
                                    result: {
                                        myContacts: []
                                    },
                                })
                            } else {
                                let blocked = data.blocked(x => ObjectId(x));
                                UserDetails.find({
                                    isdeleted: false,
                                    userId: blocked
                                })
                                    .then(async (users) => {
                                        blocked = {
                                            contacts: users.blocked,
                                        };
                                        const results = await this.getResult(blocked, users, req);
                                        // console.log('results', results);

                                        resolve({
                                            code: 200,
                                            result: {
                                                myContacts: results.myContacts.sort(
                                                    (a, b) => a.distance - b.distance
                                                ),
                                                others: results.others,
                                            },
                                        });
                                    })
                                    .catch((err) =>
                                        reject({
                                            code: 500,
                                            msg: `${err}`,
                                        })
                                    );

                            }

                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        reject({
                            code: 500,
                            msg: `${err}`,
                        })
                    });
            } else {
                UserDetails.findOne({
                    userid: req.query.userid,
                })
                    .then((contacts) => {
                        contacts = contacts ?
                            contacts.blocked.map(x=>ObjectId(x)) :[]
                        UserDetails.find({
                            isdeleted: false,
                            userid:{$in:contacts}
                        })
                            .then(async (users) => {
                                // console.log(users)
                                // let blocked = {
                                //     contacts: contacts.blocked,
                                // };
                                // const results = await this.getResult(blocked, users, req);
                                // console.log('results', results);

                                resolve({
                                    code: 200,
                                    result: {
                                        blocked:users,
                                        // myContacts: results.myContacts.sort(
                                        //     (a, b) => a.distance - b.distance
                                        // ),
                                        // others: results.others,
                                    },
                                });
                            })
                            .catch((err) =>
                                reject({
                                    code: 500,
                                    msg: `${err}`,
                                })
                            );
                    })
                    .catch((err) =>
                        reject({
                            code: 500,
                            msg: `${err}`,
                        })
                    );
            }
        });
    }

    reportContact(req) {
        return new Promise(async(resolve, reject) => {
            console.log("req.body",req.user)
            // let a = [req.body.userId,req.user._id]
            // UserDetails.find({
            //     userid: a,
            // })
            //     .then((x) => {
            //         console.log(x, req.body.userId,UserDetails);

            //         var transporter = nodemailer.createTransport({
            //             service: 'gmail',
            //             auth: {
            //                 user: process.env.mailUser,
            //                 pass: process.env.mailpassword,
            //             },
            //         });
            //         // console.log(x);
            //         // let userReported = x.map((y) => {
            //         //     if (y.userid.toString() == req.body.userId) {
            //         //         return y;
            //         //     }
            //         // });
            //         // let currentUser = x.map((z) => {
            //         //     if (z.userid.toString() == req.user._id) {
            //         //         return z;
            //         //     }
            //         // });
            //         console.log("userReported===>",userReported)
            //         console.log("currentUser===>",currentUser)
            //         var mailOptions = {
            //             from: process.env.mailUser,
            //             to: 'customersupport@vishvel.in',
            //             subject: 'Report user',
            //             html: `<h4 style="text-align: left">Vishvel - Reported Contact</h4>
            //             <br>            
            //                 Dear Admin ,<br><br>
            //              &nbsp;&nbsp;&nbsp;&nbsp;${currentUser[0].name} has reported ${userReported[0].name},please take appropriate action.<br>
            //              Reason:${req.body.reason}
            //              <br><br>
            //             <br>
            //             Thanks,<br>
            //             vishvel customer support Desk<br>
            //             mailto:customersuppor@vishvel.in`,
            //         };

            //         transporter.sendMail(mailOptions, function (error, info) {
            //             if (error) {
            //                 console.log(error);
            //                 reject({
            //                     code: 500,
            //                     msg: `${error}`,
            //                 });
            //             } else {
            //                 console.log('Email sent: ' + info.response);
            //                 resolve({
            //                     code: 204,
            //                     msg: 'Email sent: ' + info.response,
            //                 });
            //             }
            //         });
            //     })
            //     .catch((err) => {
            //         reject(`${err}`);
            //     });
              await UserDetails.findOne({
                    userid: ObjectId(req.body.userid),
                }) .then(async(data) => {
                    console.log("User Dtaa",data)
              await  UserDetails.findOne({
                        userid:  ObjectId(req.user._id),
                    }) .then((details) => {
                        console.log("Details Dtaa",details)
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.mailUser,
                                pass: process.env.mailpassword,
                            },
                        });
                        // console.log(x);
                        // let userReported = x.map((y) => {
                        //     if (y.userid.toString() == req.body.userId) {
                        //         return y;
                        //     }
                        // });
                        // let currentUser = x.map((z) => {
                        //     if (z.userid.toString() == req.user._id) {
                        //         return z;
                        //     }
                        // });
                        var mailOptions = {
                            from: process.env.mailUser,
                            to: 'customersupport@vishvel.in',
                            subject: 'Report user',
                            html: `<h4 style="text-align: left">Vishvel - Reported Contact</h4>
                            <br>            
                                Dear Admin ,<br><br>
                             &nbsp;&nbsp;&nbsp;&nbsp;${details.name} has reported ${data.name},please take appropriate action.<br>
                             Reason:${req.body.reason}
                             <br><br>
                            <br>
                            Thanks,<br>
                            vishvel customer support Desk<br>
                            mailto:customersuppor@vishvel.in`,
                        };
    
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                                reject({
                                    code: 500,
                                    msg: `${error}`,
                                });
                            } else {
                                console.log('Email sent: ' + info.response);
                                resolve({
                                    code: 204,
                                    msg: 'Email sent: ' + info.response,
                                });
                            }
                        });
                        // resolve({
                        //     code: 200,
                        //     result: data,
                        // });
                    }) .catch((e) => {
                        reject({
                            code: 500,
                            msg: `${e}`,
                        });    
            });
                })
                .catch((e) => {
                    reject({
                        code: 500,
                        msg: `${e}`,
                    });    
        });
      })
    }

    unblockContact(req) {
        return new Promise((resolve, reject) => {
            if (!Object.keys(req.body).length) {
                reject({
                    code: 400,
                    msg: 'No data passed in request body!!!',
                });
            } else if (!req.body.userid) {
                reject({
                    code: 400,
                    msg: 'User id missing!!!',
                });
            } else if (req.body._id) {
                req.body._id = ObjectId(req.body._id);
                UserDetails.updateOne({
                    _id: req.body._id,
                }, {
                    $pull: {
                        contacts: req.body.contact,
                    },
                })
                    .then((data) => {
                        // Contact.updateOne({
                        //     _id: req.body._id,
                        // }, {
                        //     $pull: {
                        //         blocked: req.body.contact,
                        //     },
                        // });
                        resolve({
                            code: 200,
                            result: data,
                        });
                    })
                    .catch((e) => {
                        reject({
                            code: 500,
                            msg: `${e}`,
                        });
                    });
            } else {
                req.body.userid = ObjectId(req.body.userid);
                UserDetails.updateOne({
                    userid: req.body.userid,
                }, {
                    $pull: {
                        blocked: req.body.contact,
                    },
                })
                    .then((data) => {
                        Contact.updateOne({
                            userid: ObjectId(req.body.userid),
                        }, {
                            $pull: {
                                blocked: req.body.contact,
                            },
                        });
                        resolve({
                            code: 200,
                            result: data,
                        });
                    })
                    .catch((e) => {
                        reject({
                            code: 500,
                            msg: `${e}`,
                        });
                    });
            }
        });
    }
}

module.exports = new ContactController();