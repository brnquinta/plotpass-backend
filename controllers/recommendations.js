const Recommendation = require("../models/recommendation");
const User = require("../models/user");

// GET /recommendations/received
module.exports.getReceivedRecommendations = async (req, res, next) => {
  try {
    const recommendations = await Recommendation.find({
      toUserId: req.user._id,
    })
      .populate("fromUserId", "name email avatar")
      .sort({ createdAt: -1 });

    return res.send(recommendations);
  } catch (err) {
    return next(err);
  }
};

// GET /recommendations/sent
module.exports.getSentRecommendations = async (req, res, next) => {
  try {
    const recommendations = await Recommendation.find({
      fromUserId: req.user._id,
    })
      .populate("toUserId", "name email avatar")
      .sort({ createdAt: -1 });

    return res.send(recommendations);
  } catch (err) {
    return next(err);
  }
};

// GET /recommendations/:recommendationId
module.exports.getRecommendationById = async (req, res, next) => {
  try {
    const recommendation = await Recommendation.findById(
      req.params.recommendationId
    )
      .populate("fromUserId", "name email avatar")
      .populate("toUserId", "name email avatar")
      .orFail();

    const isAllowed =
      String(recommendation.fromUserId._id) === String(req.user._id) ||
      String(recommendation.toUserId._id) === String(req.user._id);

    if (!isAllowed) {
      return res.status(403).send({ message: "Acesso negado" });
    }

    return res.send(recommendation);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return res.status(404).send({ message: "Recomendação não encontrada" });
    }

    if (err.name === "CastError") {
      return res.status(400).send({ message: "ID inválido" });
    }

    return next(err);
  }
};

// POST /recommendations
module.exports.createRecommendation = async (req, res, next) => {
  try {
    const { toUserEmail, reason, movie } = req.body;

    const toUser = await User.findOne({ email: toUserEmail });

    if (!toUser) {
      return res
        .status(404)
        .send({ message: "Usuário destinatário não encontrado" });
    }

    if (String(toUser._id) === String(req.user._id)) {
      return res.status(400).send({
        message: "Você não pode enviar recomendação para si mesmo",
      });
    }

    const recommendation = await Recommendation.create({
      fromUserId: req.user._id,
      toUserId: toUser._id,
      reason,
      movie: {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path || "",
        vote_average: movie.vote_average ?? 0,
        release_date: movie.release_date || "",
      },
    });

    const populatedRecommendation = await Recommendation.findById(
      recommendation._id
    )
      .populate("fromUserId", "name email avatar")
      .populate("toUserId", "name email avatar");

    return res.status(201).send(populatedRecommendation);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).send({ message: "Erro de validação" });
    }

    return next(err);
  }
};

// PATCH /recommendations/:recommendationId/read
module.exports.markRecommendationAsRead = async (req, res, next) => {
  try {
    const recommendation = await Recommendation.findById(
      req.params.recommendationId
    ).orFail();

    if (String(recommendation.toUserId) !== String(req.user._id)) {
      return res.status(403).send({
        message: "Apenas o destinatário pode marcar como lida",
      });
    }

    recommendation.status = "read";
    await recommendation.save();

    return res.send(recommendation);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return res.status(404).send({ message: "Recomendação não encontrada" });
    }

    if (err.name === "CastError") {
      return res.status(400).send({ message: "ID inválido" });
    }

    return next(err);
  }
};