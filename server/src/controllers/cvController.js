const Cv=require("../models/Cv");
const User=require("../models/User");
const mongoose=require("mongoose");
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
async function sync(student, cv, session) {
  await User.updateOne({ _id: student }, { $set: {
    skills: cv?.skills || [],
    bio: cv?.summary || "",
    education: (cv?.education || []).map(item =>
      [item.title, item.organization].filter(Boolean).join(" - ")).join("; ").slice(0, 1500),
  } }, { session });
}

// Serialize writes for one student before reading the version count or primary CV.
// A concurrent transaction on the same student is retried with a fresh snapshot.
function editVersions(student, mutate) {
  return mongoose.connection.transaction(async session => {
    const result = await User.updateOne({ _id: student }, { $inc: { __v: 1 } }, { session });
    if (!result.matchedCount) throw Object.assign(new Error("Student account not found."), { status: 404 });
    return mutate(session);
  });
}

async function list(req, res, next) {
  try {
    const data = await Cv.find({ student: req.user._id }).sort({ isPrimary: -1, updatedAt: -1 });
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

async function create(req, res, next) {
  try {
    const student = req.user._id;
    const body = req.body || {};
    const data = clean(body);
    if (!data.name) return res.status(400).json({ success: false, message: "CV version name required." });
    const cv = await editVersions(student, async session => {
      if (await Cv.countDocuments({ student }).session(session) >= 10) {
        throw Object.assign(new Error("Maximum 10 CV versions."), { status: 400 });
      }
      const isPrimary = body.isPrimary === true || !(await Cv.exists({ student, isPrimary: true }).session(session));
      if (isPrimary) await Cv.updateMany({ student, isPrimary: true }, { $set: { isPrimary: false } }, { session });
      const [created] = await Cv.create([{ ...data, student, isPrimary }], { session });
      if (isPrimary) await sync(student, created, session);
      return created;
    });
    res.status(201).json({ success: true, data: cv });
  } catch (error) { next(error); }
}

async function update(req, res, next) {
  try {
    const student = req.user._id;
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid CV ID." });
    const data = clean(req.body || {});
    if (data.name === "") return res.status(400).json({ success: false, message: "CV version name required." });
    const cv = await editVersions(student, async session => {
      const current = await Cv.findOne({ _id: id, student }, null, { session });
      if (!current) throw Object.assign(new Error("CV not found."), { status: 404 });
      Object.assign(current, data);
      if (req.body?.isPrimary === true) {
        await Cv.updateMany({ student, _id: { $ne: id }, isPrimary: true }, { $set: { isPrimary: false } }, { session });
        current.isPrimary = true;
      }
      await current.save({ session });
      if (current.isPrimary) await sync(student, current, session);
      return current;
    });
    res.json({ success: true, data: cv });
  } catch (error) { next(error); }
}

async function remove(req, res, next) {
  try {
    const student = req.user._id;
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid CV ID." });
    await editVersions(student, async session => {
      const cv = await Cv.findOneAndDelete({ _id: id, student }, { session });
      if (!cv) throw Object.assign(new Error("CV not found."), { status: 404 });
      if (cv.isPrimary) {
        const other = await Cv.findOneAndUpdate({ student }, { $set: { isPrimary: true } },
          { session, sort: { updatedAt: -1, _id: 1 }, new: true });
        await sync(student, other, session);
      }
    });
    res.json({ success: true, message: "CV deleted." });
  } catch (error) { next(error); }
}
module.exports = { list, create, update, remove };
