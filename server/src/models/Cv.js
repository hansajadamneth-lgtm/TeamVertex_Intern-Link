const mongoose = require("mongoose");
const item = new mongoose.Schema({
 title:{type:String,trim:true,maxlength:160},organization:{type:String,trim:true,maxlength:160},
 period:{type:String,trim:true,maxlength:90},details:{type:String,trim:true,maxlength:3000},
 url:{type:String,trim:true,maxlength:400},
},{_id:false});
const schema = new mongoose.Schema({
 student:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,index:true},
 name:{type:String,trim:true,required:true,maxlength:80},
 headline:{type:String,trim:true,default:"",maxlength:180},
 summary:{type:String,trim:true,default:"",maxlength:3000},
 skills:{type:[String],default:[]},education:{type:[item],default:[]},
 experience:{type:[item],default:[]},projects:{type:[item],default:[]},
 isPrimary:{type:Boolean,default:false},
},{timestamps:true});
schema.index({student:1,createdAt:-1});
module.exports=mongoose.model("Cv",schema);
