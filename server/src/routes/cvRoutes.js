const router=require("express").Router();
const {protect}=require("../middleware/authMiddleware");
const {authorize}=require("../middleware/roleMiddleware");
const cv=require("../controllers/cvController");
router.use(protect,authorize("student"));
router.get("/",cv.list);router.post("/",cv.create);
router.put("/:id",cv.update);router.delete("/:id",cv.remove);
module.exports=router;
