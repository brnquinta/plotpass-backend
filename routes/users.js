const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  validateSignup,
  validateLogin,
  validateUserId,
} = require("../middlewares/validator");


const {
  getUsers,
  getUserById,
  createUser,
  login,
} = require("../controllers/users");

router.post("/signup", validateSignup , createUser);
router.post("/signin", validateLogin , login);



router.get("/", auth, getUsers);
router.get("/:id", auth, validateUserId,  getUserById);





module.exports = router;