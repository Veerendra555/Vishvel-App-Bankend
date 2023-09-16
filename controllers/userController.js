require("dotenv").config();

const jwt = require("jsonwebtoken");
const users = require("../models/user");
const UserDetails = require("../models/userdetail");
const OTP = require("../models/otp");
const superagent = require("superagent");
const otp = require("../models/otp");
const Contact = require("../models/contacts");

const ContactController = require("./contactController");
const { ObjectId } = require('mongodb');

class UserController {
    constructor() {}

    otpGenerate(req) {
        return new Promise(async(resolve, reject) => {
            var mob = req.body.mob;
            if (!mob) {
                reject("Mobile number missing!!!");
            } else {
                try {
                    let randNum = Math.floor(100000 + Math.random() * 900000);
                    // let randNum = '000000';
                    // const textMsg = `Your verification code is ${randNum}.`;
                    let textMsg = `Dear Customer your OTP code is ${randNum}. Regards, VISHVL`;

                    const user = await users
                        .findOne({
                            mob_no: mob,
                            isdeleted: false
                        })
                        .then((r) => r)
                        .catch((err) =>
                            reject({
                                code: 500,
                                msg: `${err}`,
                            })
                        );

                    // console.log('user', user);
                    if (!user) {
                        const user = new users({
                            mob_no: mob,
                            exists: false,
                        });
                        await user
                            .save()
                            .then(async(userData, err) => {
                                if (err) {
                                    throw err;
                                }

                                // let url = `https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=${process.env.MSGKEY}&senderid=${process.env.SENDERID}&channel=2&DCS=0&flashsms=0&number=91${mob}&text=${textMsg}&route=1`;
                                let url = `http://api.smscountry.com/SMSCwebservice_bulk.aspx?User=${process.env.SMS_COUNTRY_USER}&passwd=${process.env.SMS_COUNTRY_PASSWORD}&mobilenumber=91${mob}&message=${textMsg}&sid=${process.env.SMS_COUNTRY_SENDERID}&mtype=N&DR=Y`;
                                const res = await superagent.post(url);
                                // var result = JSON.parse(res.text);
                                var result = res.text.split(":")[0];
                                if (result == "OK") {
                                    const data = {
                                        userid: userData._id,
                                        otp: randNum,
                                        isverified: false,
                                    };

                                    const otp = new OTP(data);
                                    await otp
                                        .save()
                                        .then((r) => {
                                            resolve(
                                                "OTP sent to your mobile number!!!"
                                            );
                                        })
                                        .catch((e) => {
                                            throw e;
                                        });
                                } else {
                                    reject(`${result.message}`);
                                }
                            })
                            .catch((e) => {
                                throw e;
                            });
                    } else {
                        const otpDetail = await OTP.findOne({
                                userid: user._id,
                                // isverified: false,
                            })
                            .then((r) => r)
                            .catch((e) => {
                                throw e;
                            });
                        // console.log("OTPD: ", otpDetail)

                        if (otpDetail && otpDetail.isverified == false) {
                            randNum = otpDetail.otp;
                            textMsg = `Dear Customer your OTP code is ${randNum}. Regards, VISHVL`;
                        }

                        // let url = `https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=${process.env.MSGKEY}&senderid=${process.env.SENDERID}&channel=2&DCS=0&flashsms=0&number=91${mob}&text=${textMsg}&route=1`;
                        let url = `http://api.smscountry.com/SMSCwebservice_bulk.aspx?User=${process.env.SMS_COUNTRY_USER}&passwd=${process.env.SMS_COUNTRY_PASSWORD}&mobilenumber=91${mob}&message=${textMsg}&sid=${process.env.SMS_COUNTRY_SENDERID}&mtype=N&DR=Y`;
                        const res = await superagent.post(url);
                        // console.log('res', res);
                        // var result = JSON.parse(res.text);
                        var result = res.text.split(":")[0].toLowerCase().trim();
                        // console.log('res:', result, result == "ok");

                        if (result == "ok") {
                            if (!otpDetail) {
                                const data = {
                                    userid: user._id,
                                    otp: randNum,
                                    isverified: false,
                                };
                                // console.log("DATA: ", data)
                                const otp = new OTP(data);
                                await otp
                                    .save()
                                    .then((r) => {
                                        resolve("OTP sent to your mobile number!!!");
                                    })
                                    .catch((e) => {
                                        throw e;
                                    });
                            }
                            // else if (
                            //     otpDetail &&
                            //     otpDetail.isverified == true
                            // ) 
                            else {
                                // console.log("randNum: ", randNum)
                                await OTP.findOneAndUpdate({
                                        _id: otpDetail._id,
                                    }, {
                                        otp: randNum,
                                        isverified: false,
                                    })
                                    .then((r) => {
                                        resolve("OTP sent to your mobile number!!!");
                                    })
                                    .catch((err) =>
                                        reject({
                                            code: 500,
                                            msg: `${err}`,
                                        })
                                    );
                            }
                        } else {
                            reject(`${result.message}`);
                        }
                    }
                } catch (err) {
                    reject(err);
                }
            }
        });
    }

    getTokens(data) {
        return new Promise((resolve, reject) => {
            let token = jwt.sign({
                    _id: data._id,
                    mob_no: data.mob_no,
                },
                process.env.JWT_SECRET, {
                    expiresIn: "1y",
                }
            );
            let refrestToken = jwt.sign({
                    _id: data._id,
                    mob_no: data.mob_no,
                },
                process.env.JWT_REFRESH_SECRET, {
                    expiresIn: "1y",
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
    }

    verifyOTP(req) {
        return new Promise(async(resolve, reject) => {
            var { mob, otp } = req.body;
            if (!mob) {
                reject("Mobile number missing!!!");
            } else if (!otp) {
                reject("OTP missing!!!");
            } else {
                try {
                    const user = await users
                        .findOne({
                            mob_no: mob,
                            isdeleted: false
                        })
                        .then((r) => r)
                        .catch((err) => {
                         console.log("Error 1",err);
                            reject({
                                code: 500,
                                msg: `${err}`,
                            })
                })
                    if (!user) {
                        reject({
                            code: 400,
                            msg: "User not found!!!",
                        });
                    }
                    // console.log("User: ", user)

                    var result = {};

                    const otpDetail = await OTP.findOne({
                            userid: user._id,
                            otp: otp,
                            isverified: false,
                        })
                        .then((r) => r)
                        .catch((err) =>{
                            console.log("Error 2",err);
                            reject({
                                code: 500,
                                msg: `${err}`,
                            })
                });
                    console.log("OTPDetails: ", otpDetail)
                    if (!otpDetail || otpDetail == null) {
                        result.message = "Login failed. Please try again!";
                    } else {
                        await OTP.findOneAndUpdate({
                                _id: otpDetail._id,
                            }, {
                                isverified: true,
                            })
                            .then((r) => r)
                            .catch((err) =>{
                                
                                reject({
                                    code: 500,
                                    msg: `${err}`,
                                })
                    });
                        result.type = "success";
                    }

                    console.log("Result: ", result)

                    if (result && result.type && result.type.localeCompare("success") == 0) {
                        try {
                            var u = await users
                                .findOne({
                                    mob_no: mob,
                                    isdeleted: false
                                })
                                .then((r) => r.toObject())
                                .catch((err) => {
                                    console.log(err)
                                    reject(`${err}`);
                                });
                        console.log("U--------->",u)
                            // .then(u => {
                             var userData =  await UserDetails
                                .findOne({
                                    mob_no: mob,
                                })
                                .then((r) => r)
                                .catch((err) => {
                                    reject(`${err}`);
                                });
                            if (u == null) {
                                const user = new users({
                                    mob_no: mob,
                                    exists: false,
                                });
                                console.log("userData",userData)
                                user.save()
                                    .then(async(data) => {
                                        console.log("userData",userData)
                                        console.log(userData != null && userData != undefined)
                                        console.log(userData.isprivate)
                                        data.isprivate = userData != null && userData != undefined ? userData.isprivate : false;
                                        data["isprivate"] = userData != null && userData != undefined ? userData.isprivate : false;
                                        console.log(data);
                                        const tokens = await this.getTokens(
                                            data
                                        );
                                        resolve({
                                            ...data,
                                            tokens,
                                        });
                                    })
                                    .catch((err) => {
                                        console.log("error From Data==>",err);
                                        reject(`${err}`);
                                    });
                            } else {
                                // console.log("else==>",userData)
                                const tokens = await this.getTokens(u);
                                if(userData != null && userData != undefined)
                                u['isprivate'] = userData.isprivate;
                             else
                              u['isprivate'] = false;
                            console.log(tokens,"tokens==========")
                             console.log("U===>Afetr Update",u)
                                resolve({
                                    ...u,
                                    tokens,
                                });
                            }
                            //   })
                            // .catch(err => reject(`${err}`))
                        } catch (err) {
                            console.log("outside Error",err)
                            reject(`${err}`);
                        }
                    } else {
                        console.log("outside1 Error",err)
                        reject(`${result.message}`);
                    }
                } catch (err) {
                    console.log("outside3 Error",err)
                    reject(err);
                }
            }
        });
    }

    // resend(req) {
    //     return new Promise(async(resolve, reject) => {
    //         var mob = req.body.mob;
    //         if (!mob) {
    //             reject("Mobile number missing!!!");
    //         } else {
    //             try {
    //                 const user = await users
    //                     .findOne({
    //                         mob_no: mob,
    //                         isdeleted: false
    //                     })
    //                     .then((r) => r)
    //                     .catch((err) =>
    //                         reject({
    //                             code: 500,
    //                             msg: `${err}`,
    //                         })
    //                     );

    //                 if (!user) {
    //                     reject({
    //                         code: 400,
    //                         msg: "User not found!!!",
    //                     });
    //                 } else {
    //                     let randNum = null;
    //                     const otpDetail = await OTP.findOne({
    //                             userid: user._id,
    //                             isverified: false,
    //                         })
    //                         .then((r) => r)
    //                         .catch((e) => {
    //                             throw e;
    //                         });

    //                     if (!otpDetail) {
    //                         throw new Error("Otp not found!!!");
    //                     }
    //                     randNum = otpDetail.otp;
    //                     const textMsg = `Your verification code is ${randNum}.`;
    //                     // let url = `https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=${process.env.MSGKEY}&senderid=${process.env.SENDERID}&channel=2&DCS=0&flashsms=0&number=91${mob}&text=${textMsg}&route=1`;
    //                     // let url = `http://api.smscountry.com/SMSCwebservice_bulk.aspx?User=${process.env.SMS_COUNTRY_USER}&passwd=${process.env.SMS_COUNTRY_PASSWORD}&mobilenumber=91${mob}&message=${textMsg}&sid=${process.env.SMS_COUNTRY_SENDERID}&mtype=N&DR=Y`;
    //                     // const res = await superagent.post(url);
    //                     // // var result = JSON.parse(res.text);
    //                     // var result = res.text.split(":")[0];
    //                     // if (result == "OK") {
    //                     //     resolve("OTP sent to your mobile number!!!");
    //                     // } else {
    //                     //     reject(`${result.message}`);
    //                     // }
    //                     let url = `http://api.smscountry.com/SMSCwebservice_bulk.aspx?User=${process.env.SMS_COUNTRY_USER}&passwd=${process.env.SMS_COUNTRY_PASSWORD}&mobilenumber=91${mob}&message=${textMsg}&sid=${process.env.SMS_COUNTRY_SENDERID}&mtype=N&DR=Y`;
    //                     const res = await superagent.post(url);
    //                     console.log(res.text);
    //                     // var result = JSON.parse(res.text);
    //                     var result = res.text.split(":")[0];
    //                     if (result == "OK") {
    //                         const data = {
    //                             userid: user._id,
    //                             otp: randNum,
    //                             isverified: false,
    //                         };

    //                         const otp = new OTP(data);
    //                         await otp
    //                             .save()
    //                             .then((r) => {
    //                                 resolve(
    //                                     "OTP sent to your mobile number!!!"
    //                                 );
    //                             })
    //                             .catch((e) => {
    //                                 throw e;
    //                             });
    //                     } else {
    //                         reject(`${result.message}`);
    //                     }
    //                 }
    //             } catch (err) {
    //                 reject(err);
    //             }
    //         }
    //     });
    // }

    
    resend(req) {
        return new Promise(async(resolve, reject) => {
            var mob = req.body.mob;
            if (!mob) {
                reject("Mobile number missing!!!");
            } else {
                try {
                    let randNum = Math.floor(100000 + Math.random() * 900000);
                    // let randNum = '000000';
                    let textMsg = `Your verification code is ${randNum}.`;
                    // let textMsg = `Dear Customer your OTP code is ${randNum}. Regards, VISHVL`;

                    const user = await users
                        .findOne({
                            mob_no: mob,
                            isdeleted: false
                        })
                        .then((r) => r)
                        .catch((err) =>
                            reject({
                                code: 500,
                                msg: `${err}`,
                            })
                        );

                    // console.log('user', user);
                    if (!user) {
                        const user = new users({
                            mob_no: mob,
                            exists: false,
                        });
                        await user
                            .save()
                            .then(async(userData, err) => {
                                if (err) {
                                    throw err;
                                }

                                // let url = `https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=${process.env.MSGKEY}&senderid=${process.env.SENDERID}&channel=2&DCS=0&flashsms=0&number=91${mob}&text=${textMsg}&route=1`;
                                let url = `http://api.smscountry.com/SMSCwebservice_bulk.aspx?User=${process.env.SMS_COUNTRY_USER}&passwd=${process.env.SMS_COUNTRY_PASSWORD}&mobilenumber=91${mob}&message=${textMsg}&sid=${process.env.SMS_COUNTRY_SENDERID}&mtype=N&DR=Y`;
                                const res = await superagent.post(url);
                                // var result = JSON.parse(res.text);
                                var result = res.text.split(":")[0];
                                if (result == "OK") {
                                    const data = {
                                        userid: userData._id,
                                        otp: randNum,
                                        isverified: false,
                                    };

                                    const otp = new OTP(data);
                                    await otp
                                        .save()
                                        .then((r) => {
                                            resolve(
                                                "OTP sent to your mobile number!!!"
                                            );
                                        })
                                        .catch((e) => {
                                            throw e;
                                        });
                                } else {
                                    reject(`${result.message}`);
                                }
                            })
                            .catch((e) => {
                                throw e;
                            });
                    } else {
                        const otpDetail = await OTP.findOne({
                                userid: user._id,
                                // isverified: false,
                            })
                            .then((r) => r)
                            .catch((e) => {
                                throw e;
                            });
                        // console.log("OTPD: ", otpDetail)

                        if (otpDetail && otpDetail.isverified == false) {
                            randNum = otpDetail.otp;
                             textMsg = `Your verification code is ${randNum}.`;
                            // textMsg = `Dear Customer your OTP code is ${randNum}. Regards, VISHVL`;
                        }

                        // let url = `https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=${process.env.MSGKEY}&senderid=${process.env.SENDERID}&channel=2&DCS=0&flashsms=0&number=91${mob}&text=${textMsg}&route=1`;
                        let url = `http://api.smscountry.com/SMSCwebservice_bulk.aspx?User=${process.env.SMS_COUNTRY_USER}&passwd=${process.env.SMS_COUNTRY_PASSWORD}&mobilenumber=91${mob}&message=${textMsg}&sid=${process.env.SMS_COUNTRY_SENDERID}&mtype=N&DR=Y`;
                        const res = await superagent.post(url);
                        // console.log('res', res);
                        // var result = JSON.parse(res.text);
                        var result = res.text.split(":")[0].toLowerCase().trim();
                        // console.log('res:', result, result == "ok");

                        if (result == "ok") {
                            if (!otpDetail) {
                                const data = {
                                    userid: user._id,
                                    otp: randNum,
                                    isverified: false,
                                };
                                // console.log("DATA: ", data)
                                const otp = new OTP(data);
                                await otp
                                    .save()
                                    .then((r) => {
                                        resolve("OTP sent to your mobile number!!!");
                                    })
                                    .catch((e) => {
                                        throw e;
                                    });
                            }
                            // else if (
                            //     otpDetail &&
                            //     otpDetail.isverified == true
                            // ) 
                            else {
                                // console.log("randNum: ", randNum)
                                await OTP.findOneAndUpdate({
                                        _id: otpDetail._id,
                                    }, {
                                        otp: randNum,
                                        isverified: false,
                                    })
                                    .then((r) => {
                                        resolve("OTP sent to your mobile number!!!");
                                    })
                                    .catch((err) =>
                                        reject({
                                            code: 500,
                                            msg: `${err}`,
                                        })
                                    );
                            }
                        } else {
                            reject(`${result.message}`);
                        }
                    }
                } catch (err) {
                    reject(err);
                }
            }
        });
    }

    getUser(req) {
        return new Promise((resolve, reject) => {
            let query = {};
            if (req.query.others == undefined) {
                req.query.others = "false";
            }
            if (req.query.others.localeCompare("false") == 0) {
                req.query.others = "false";
                query = req.query.userid ? { userid: ObjectId(req.query.userid) } : {};
            }

            if (req.query.search) {
                const { search } = req.query;
                const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
                const searchRgx = rgx(search);

                query = {};
                query = {
                    $or: [
                        { name: { $regex: searchRgx, $options: "i" } },
                        { email: { $regex: searchRgx, $options: "i" } },
                        { occupation: { $regex: searchRgx, $options: "i" } },
                        { company: { $regex: searchRgx, $options: "i" } },
                        { designation: { $regex: searchRgx, $options: "i" } },
                        { website: { $regex: searchRgx, $options: "i" } },
                        { address: { $regex: searchRgx, $options: "i" } },
                    ],
                };
            }

            // query.isdeleted = false;
            console.log('%c%s', 'color: #0088cc', query);

            UserDetails.find(query)
                .then((data) => {
                    if (data.length == 0) {
                        resolve({
                            code: 204,
                            msg: "No user found!!!",
                        });
                    } else {
                        if (req.query.others.localeCompare("true") == 0) {
                            if (!req.query.userid) {
                                reject({
                                    code: 500,
                                    msg: `Please make 'others' as 'false' in the req query or pass 'userid' also!!! `,
                                });
                            }
                            data = data.filter((x) => {
                                let userid = x.userid;
                                return userid != req.query.userid;
                            });
                            resolve({
                                code: 200,
                                result: data,
                            });
                        } else {
                            resolve({
                                code: 200,
                                result: data,
                            });
                        }
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

    addUser(req) {
        return new Promise(async(resolve, reject) => {
            if (!Object.keys(req.body).length) {
                reject({
                    code: 400,
                    msg: "No data passed in request body!!!",
                });
            } else if (!req.body.userid ||
                !req.body.name ||
                !req.body.email ||
                !req.body.occupation ||
                !req.body.company ||
                !req.body.about_company || 
                // !req.body.businesslogo ||
                !req.body.mob_no
            ) {
                reject({
                    code: 400,
                    msg: "Some of the required fields are missing!!!",
                });
            } else if (!req.body.latitude || !req.body.longitude) {
                reject({
                    code: 400,
                    msg: "Location coordinates missing!!!",
                });
            } else {
                let data = req.body;
                const regUser = await users.findById(data.userid);

                if (!regUser) {
                    throw new Error("User not found!!!");
                }

                UserDetails.findOne({
                        userid: data.userid,
                        isdeleted: false,
                    })
                    .then((user) => {
                        if (user == null) {
                            let userDetails = new UserDetails(data);
                            userDetails
                                .save()
                                .then((data) => {
                                    users
                                        .findByIdAndUpdate(data.userid, {
                                            exists: true,
                                        })
                                        .then(() => {
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
                                })
                                .catch((err) => {
                                    reject({
                                        code: 500,
                                        msg: `${err}`,
                                    });
                                });
                        } else {
                            reject({
                                code: 409,
                                msg: "User already exists!!!",
                            });
                        }
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

    search(req) {
        return new Promise(async(resolve, reject) => {
            if (!Object.keys(req.body).length) {
                reject({
                    code: 400,
                    msg: "No data passed in request body!!!",
                });
            } else if (!req.body.search || !req.body.columns) {
                reject({
                    code: 400,
                    msg: "Some of the required fields are missing!!!",
                });
            } else {
                const { search, columns } = req.body;
                const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
                const searchRgx = rgx(search);

                let query = {};

                if (columns.length == 0) {
                    query = {
                        $or: [
                            { name: { $regex: searchRgx, $options: "i" } },
                            { email: { $regex: searchRgx, $options: "i" } },
                            {
                                occupation: {
                                    $regex: searchRgx,
                                    $options: "i",
                                },
                            },
                            { company: { $regex: searchRgx, $options: "i" } },
                            {
                                designation: {
                                    $regex: searchRgx,
                                    $options: "i",
                                },
                            },
                            { website: { $regex: searchRgx, $options: "i" } },
                            { address: { $regex: searchRgx, $options: "i" } },
                        ],
                    };
                } else {
                    query = {
                        $or: [],
                    };

                    columns.map((x) => {
                        let temp = {};
                        temp[x] = { $regex: searchRgx, $options: "i" };
                        query["$or"].push(temp);
                    });

                    let check = columns.filter(
                        (x) => x.localeCompare("all") == 0
                    );
                    if (check.length > 0) {
                        query = {
                            $or: [
                                { name: { $regex: searchRgx, $options: "i" } },
                                { email: { $regex: searchRgx, $options: "i" } },
                                {
                                    occupation: {
                                        $regex: searchRgx,
                                        $options: "i",
                                    },
                                },
                                {
                                    company: {
                                        $regex: searchRgx,
                                        $options: "i",
                                    },
                                },
                                {
                                    designation: {
                                        $regex: searchRgx,
                                        $options: "i",
                                    },
                                },
                                {
                                    website: {
                                        $regex: searchRgx,
                                        $options: "i",
                                    },
                                },
                                {
                                    address: {
                                        $regex: searchRgx,
                                        $options: "i",
                                    },
                                },
                            ],
                        };
                    }
                }

                Contact.findOne({
                        userid: req.user._id,
                    })
                    .then((contacts) => {
                        contacts = contacts ?
                            contacts :
                            {
                                contacts: [],
                                blocked:[],
                            };

                        query.isdeleted = false;

                        UserDetails.find(query)
                            .then(async(data) => {
                                if (data.length == 0) {
                                    resolve({
                                        code: 204,
                                        msg: "No result found!!!",
                                    });
                                } else {
                                    // console.log('Data: ', data);
                                    let blockedByOther = await UserDetails.find({blocked:req.user._id});
                                    let blockedByme = await UserDetails.findOne({userid:req.user._id});
                                    let deletebyme= blockedByme.blocked
                                    let toDel = blockedByOther.map(x=>x.userid);
                                    toDel= toDel.concat(deletebyme)
                                    const toDelete = new Set(toDel);
                                    // console.log("userController",blockedByOther,toDelete,deletebyme,blockedByme)

                                    data = data.filter(obj => !toDelete.has(obj.userid.toString()));
                                    const results =
                                        await ContactController.getResult(
                                            contacts,
                                            data,
                                            req
                                        );
                                    // console.log('results', results);

                                    resolve({
                                        code: 200,
                                        result: {
                                            myContacts: results.myContacts.sort(
                                                (a, b) =>
                                                a.distance - b.distance
                                            ),
                                            others: results.others,
                                        },
                                    });

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

    deleteUser(req) {
        // console.log('req.body', req.body);
        return new Promise(async(resolve, reject) => {
            if (!Object.keys(req.body).length) {
                reject({
                    code: 400,
                    msg: "No data passed in request body!!!",
                });
            } else if (!req.body.userid) {
                reject({
                    code: 400,
                    msg: "userid is missing!!!",
                });
            } else {
                let data = req.body;
                const regUser = await users.findById(data.userid);
                // console.log('regUser', regUser);

                if (!regUser) {
                    throw new Error("User not found!!!");
                }

                UserDetails.findOne({
                        userid: ObjectId(data.userid),
                        $or: [
                            { isdeleted: { $exists: false } },
                            { isdeleted: false }
                        ],
                    })
                    .then((user) => {
                        // console.log('user', user);
                        if (user == null) {
                            reject({
                                code: 400,
                                msg: "User not found!!!",
                            });
                        } else {
                            UserDetails.updateOne({
                                    _id: ObjectId(user._id)
                                }, {
                                    $set: {
                                        isdeleted: true,
                                    },
                                })
                                .then(() => {
                                    users.updateOne({
                                        _id: ObjectId(data.userid)
                                    }, {
                                        $set: {
                                            isdeleted: true,
                                        },
                                    }).then(() => {
                                        resolve({
                                            code: 200,
                                            msg: `Account deleted!!!`,
                                        });
                                    }).catch((err) => {
                                        reject({
                                            code: 500,
                                            msg: `${err}`,
                                        });
                                    });
                                })
                                .catch((err) => {
                                    reject({
                                        code: 500,
                                        msg: `${err}`,
                                    });
                                });
                        }
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

    toggleIsPrivate(req) {
        // console.log('req.body', req.body);
        return new Promise(async(resolve, reject) => {
            if (!Object.keys(req.body).length) {
                reject({
                    code: 400,
                    msg: "No data passed in request body!!!",
                });
            } else if (!req.body.userid) {
                reject({
                    code: 400,
                    msg: "userid is missing!!!",
                });
            } else {
                let data = req.body;
                const regUser = await users.findById(data.userid);
                // console.log('regUser', regUser);

                if (!regUser) {
                    throw new Error("User not found!!!");
                }

                UserDetails.findOne({
                        userid: ObjectId(data.userid),
                    })
                    .then((user) => {
                        // console.log('user', user);
                        if (user == null) {
                            reject({
                                code: 400,
                                msg: "User not found!!!",
                            });
                        } else {
                            UserDetails.updateOne({
                                    _id: ObjectId(user._id)
                                }, {
                                    $set: {
                                        isprivate: !user.isprivate,
                                    },
                                })
                                .then(() => {
                                    resolve({
                                        code: 200,
                                        msg: `Status changed!!!`,
                                    });
                                })
                                .catch((err) => {
                                    reject({
                                        code: 500,
                                        msg: `${err}`,
                                    });
                                });
                        }
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

module.exports = new UserController();