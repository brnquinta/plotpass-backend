const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  validateCreateRecommendation,
  validateRecommendationId,
} = require("../middlewares/validator");

const {
  getReceivedRecommendations,
  getSentRecommendations,
  getRecommendationById,
  createRecommendation,
  markRecommendationAsRead,
} = require("../controllers/recommendations");

/* recomendações recebidas */
router.get("/received", auth, getReceivedRecommendations);

/* recomendações enviadas */
router.get("/sent", auth, getSentRecommendations);

/* recomendação específica */
router.get("/:recommendationId", auth, validateRecommendationId, getRecommendationById);

/* criar recomendação */
router.post("/", auth, validateCreateRecommendation, createRecommendation);

/* marcar recomendação como lida */
router.patch("/:recommendationId/read", auth, validateRecommendationId, markRecommendationAsRead);

module.exports = router;