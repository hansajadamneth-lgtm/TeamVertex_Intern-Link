const alias={"js":"javascript","ts":"typescript","node":"nodejs","node.js":"nodejs",
"reactjs":"react","react.js":"react","next.js":"nextjs","mongo":"mongodb","py":"python"};
function canonical(value){
 const str=String(value??"").toLowerCase().trim().replace(/\s+/g," ");
 return alias[str]||str;
}
const unique=(skills)=>[...new Set((Array.isArray(skills)?skills:[]).map(canonical).filter(Boolean))];
function scoreJob(profile,job){
 const candidate=unique(profile.skills),required=unique(job.skills);
 const matchedSkills=required.filter(x=>candidate.includes(x));
 const missingSkills=required.filter(x=>!candidate.includes(x));
 const fraction=required.length?matchedSkills.length/required.length:0;
 const locations=unique(profile.preferredLocations),categories=unique(profile.preferredCategories);
 const bonusLocation=locations.length&&(locations.includes(canonical(job.location))||canonical(job.type)==="remote")?10:0;
 const bonusCategory=categories.includes(canonical(job.category))?5:0;
 const score=Math.min(100,Math.max(0,Math.round(fraction*85+bonusLocation+bonusCategory)));
 const reason=!candidate.length?"Complete your CV to receive skill matches."
  :!required.length?"No required skills supplied for this job."
  :matchedSkills.length?"Matches "+matchedSkills.length+" of "+required.length+" listed skills."
  :"No direct skill matches yet.";
 return {score,matchedSkills,missingSkills,reason};
}
module.exports={scoreJob,canonical};
