const Cv=require("../models/Cv");
const User=require("../models/User");
const fields=["name","headline","summary","skills","education","experience","projects"];
const txt=(x,n=3000)=>String(x??"").trim().slice(0,n);
function clean(body){
 const data={};
 for(const key of fields){
   if(!Object.prototype.hasOwnProperty.call(body,key))continue;
   if(key==="skills")data.skills=Array.isArray(body.skills)?[...new Set(body.skills.map(x=>txt(x,60)).filter(Boolean))].slice(0,60):[];
   else if(["education","experience","projects"].includes(key)){
     data[key]=Array.isArray(body[key])?body[key].slice(0,20).map(x=>({
       title:txt(x?.title,160),organization:txt(x?.organization,160),period:txt(x?.period,90),
       details:txt(x?.details),url:txt(x?.url,400),
     })):[];
   } else data[key]=txt(body[key],key==="name"?80:key==="headline"?180:3000);
 }
 return data;
}
async function sync(student,cv){
 await User.findByIdAndUpdate(student,{
   skills:cv?.skills||[],bio:cv?.summary||"",
   education:(cv?.education||[]).map(x=>[x.title,x.organization].filter(Boolean).join(" - ")).join("; ").slice(0,1500),
 });
}
async function list(req,res,next){try{
 const data=await Cv.find({student:req.user._id}).sort({isPrimary:-1,updatedAt:-1});
 res.json({success:true,data});
}catch(e){next(e)}}
async function create(req,res,next){try{
 const body=req.body||{},data=clean(body);
 if(!data.name)return res.status(400).json({success:false,message:"CV version name required."});
 if(await Cv.countDocuments({student:req.user._id})>=10)return res.status(400).json({success:false,message:"Maximum 10 CV versions."});
 const primary=body.isPrimary===true||!(await Cv.exists({student:req.user._id,isPrimary:true}));
 if(primary)await Cv.updateMany({student:req.user._id},{$set:{isPrimary:false}});
 const cv=await Cv.create({...data,student:req.user._id,isPrimary:primary});
 if(primary)await sync(req.user._id,cv);
 res.status(201).json({success:true,data:cv});
}catch(e){next(e)}}
async function update(req,res,next){try{
 const cv=await Cv.findOne({_id:req.params.id,student:req.user._id});
 if(!cv)return res.status(404).json({success:false,message:"CV not found."});
 const data=clean(req.body||{});
 if(data.name==="")return res.status(400).json({success:false,message:"CV version name required."});
 Object.assign(cv,data);
 if(req.body?.isPrimary===true){
   await Cv.updateMany({student:req.user._id,_id:{$ne:cv._id}},{$set:{isPrimary:false}});
   cv.isPrimary=true;
 }
 await cv.save();
 if(cv.isPrimary)await sync(req.user._id,cv);
 res.json({success:true,data:cv});
}catch(e){next(e)}}
async function remove(req,res,next){try{
 const cv=await Cv.findOneAndDelete({_id:req.params.id,student:req.user._id});
 if(!cv)return res.status(404).json({success:false,message:"CV not found."});
 if(cv.isPrimary){
   const other=await Cv.findOne({student:req.user._id}).sort({updatedAt:-1});
   if(other){other.isPrimary=true;await other.save();}
   await sync(req.user._id,other);
 }
 res.json({success:true,message:"CV deleted."});
}catch(e){next(e)}}
module.exports={list,create,update,remove};
