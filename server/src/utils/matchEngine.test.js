const test=require("node:test"),assert=require("node:assert/strict");
const {scoreJob}=require("./matchEngine");
test("skill aliases produce stable score",()=>{
 const r=scoreJob({skills:["React","node.js"]},{skills:["react.js","NodeJS"]});
 assert.equal(r.score,85);assert.equal(r.missingSkills.length,0);
});
test("no fake matches without skills",()=>{
 assert.equal(scoreJob({skills:[]},{skills:["Python"]}).score,0);
 assert.equal(scoreJob({skills:["Python"]},{skills:[]}).score,0);
});
test("full match plus preferences <=100",()=>{
 assert.equal(scoreJob({skills:["Python"],preferredLocations:["Colombo"],preferredCategories:["IT"]},
 {skills:["Python"],location:"Colombo",category:"IT"}).score,100);
});
