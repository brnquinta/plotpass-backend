const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getReceivedRecommendations,
  getSentRecommendations,
  getRecommendationById,
  createRecommendation,
  markRecommendationAsRead,
} = require("../controllers/recommendations");

router.use(auth); 

router.get("/received", getReceivedRecommendations);
router.get("/sent", getSentRecommendations);
router.get("/:recommendationId", getRecommendationById);
router.post("/", createRecommendation);
router.patch("/:recommendationId/read", markRecommendationAsRead);

module.exports = router;