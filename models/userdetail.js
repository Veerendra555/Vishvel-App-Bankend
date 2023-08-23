const mongoose = require("../db/db");
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;
// const bcrypt = require('bcrypt');

// let saltRounds = 10;

const userSchema = mongoose.Schema({
    userid: {
        type : Schema.Types.ObjectId,
        ref : "users" 
    },
    name: {
        type: String,
        required: true,
    },
    mob_no: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        // unique: true,
        validate: [
            (email) => {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(email).toLowerCase());
            },
            "invalid email",
        ],
    },
    occupation: {
        type: String,
        required: true,
    },
    // designation: {
    //     type: String,
    //     required: false,
    // },
    company: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: false,
    },
    // worktimein: {
    //     type: String,
    //     required: false,
    // },
    // worktimeout: {
    //     type: String,
    //     required: false,
    // },
    address: {
        type: String,
        required: false,
    },
    businesslogo: {
        type: String,
        required: false,
    },
    rating: {
        type: Object,
        required: false,
    },
    review: {
        type: Array,
        required: false,
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },  
    
    about_company: {
        type: String,
        required: true
    },

    isdeleted: {
        type: Boolean,
        default: false
    },
    isprivate: {
        type: Boolean,
        default: false
    },
    blocked: [String]
});

const user = mongoose.model("userdetails", userSchema);

module.exports = user;