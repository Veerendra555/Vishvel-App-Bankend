var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ratingSchema = Schema({
    from : {
        type : Schema.Types.ObjectId,
             ref : "userdetails"  
        },
    to :
        {
         type : Schema.Types.ObjectId,
          ref:"userdetails"  
        },  
      rating:{
         type : Number
        }, 
        isActive:{
            type:Boolean, 
            default:true
        }
     },
{
    timestamps: true
})

module.exports = mongoose.model('rating', ratingSchema);