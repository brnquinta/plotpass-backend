const { celebrate, Joi, Segments } = require("celebrate");
const validator = require("validator");

const validateUrl = (value, helpers) => {
  if (value === "" || value === null || value === undefined) {
    return value;
  }

  if (validator.isURL(value)) return value;

  return helpers.error("string.uri");
};

/* USERS */

module.exports.validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    avatar: Joi.string().custom(validateUrl).allow("", null),
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
    avatar: Joi.string().custom(validateUrl).allow("", null),
  }),
});

/* RECOMMENDATIONS */

module.exports.validateCreateRecommendation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    toUserEmail: Joi.string().email().required(),
    reason: Joi.string().min(2).max(500).required(),
    movie: Joi.object()
      .keys({
        id: Joi.number().required(),
        title: Joi.string().min(1).required(),
        poster_path: Joi.string().allow("", null),
        vote_average: Joi.number().min(0).max(10).allow(null),
        release_date: Joi.string().allow("", null),
      })
      .required(),
  }),
});

module.exports.validateRecommendationId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    recommendationId: Joi.string().hex().length(24).required(),
  }),
});