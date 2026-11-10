const router=require("express").Router();
const {protect}=require("../middleware/authMiddleware");
const {authorize}=require("../middleware/roleMiddleware");
router.get("/",protect,authorize("student"),require("../controllers/recommendationController").getRecommendations);
module.exports=router;
