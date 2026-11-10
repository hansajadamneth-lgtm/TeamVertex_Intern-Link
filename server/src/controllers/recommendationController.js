const Cv=require("../models/Cv"),Job=require("../models/Job"),Company=require("../models/Company");
const {scoreJob}=require("../utils/matchEngine");
async function getRecommendations(req,res,next){try{
 const cv=await Cv.findOne({student:req.user._id,isPrimary:true});
 const verified=await Company.distinct("_id",{status:"Verified"});
 const jobs=await Job.find({company:{$in:verified},status:"Active",
   $or:[{deadline:null},{deadline:{$gte:new Date()}}]}).sort({createdAt:-1}).limit(200);
 const profile={skills:cv?.skills?.length?cv.skills:req.user.skills||[],
   preferredLocations:req.user.location?[req.user.location]:[],preferredCategories:[]};
 const data=jobs.map(job=>{
   const match=scoreJob(profile,job);
   return {...job.toObject(),match:match.score,matchedSkills:match.matchedSkills,
    missingSkills:match.missingSkills,matchReason:match.reason};
 }).sort((a,b)=>b.match-a.match||new Date(b.createdAt)-new Date(a.createdAt)).slice(0,30);
 res.json({success:true,count:data.length,profileComplete:profile.skills.length>0,data});
}catch(e){next(e)}}
module.exports={getRecommendations};
