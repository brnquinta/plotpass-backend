const { celebrate, Joi, Segments } = require("celebrate");
const validator = require("validator");

const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) return value;
  return helpers.error("string.uri");
};

/* USERS */

module.exports.validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    avatar: Joi.string().custom(validateUrl),
  }),
});

module.exports.validateLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

module.exports.validateUpdateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().custom(validateUrl),
  }),
});

/* RECOMMENDATIONS */

module.exports.validateCreateRecommendation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    receiverEmail: Joi.string().email().required(),
    movieId: Joi.number().required(),
    title: Joi.string().min(1).required(),
    reason: Joi.string().min(2).max(500).required(),
    posterUrl: Joi.string().custom(validateUrl).allow("", null),
    releaseDate: Joi.string().allow("", null),
    rating: Joi.number().min(0).max(10).allow(null),
  }),
});

module.exports.validateRecommendationId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    recommendationId: Joi.string().hex().length(24).required(),
  }),
});

module.exports.validateUpdateRecommendationStatus = celebrate({
  [Segments.BODY]: Joi.object().keys({
    status: Joi.string().valid("pending", "watched").required(),
  }),
});