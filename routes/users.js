const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getUsers,
  getUserById,
  createUser,
  login,
} = require("../controllers/users");

router.post("/signup", createUser);
router.post("/signin", login);

router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);

module.exports = router;