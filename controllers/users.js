const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;




// GET /users
module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: "Erro no servidor" });
  }
};


// GET /users/:id
module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).orFail();

    res.send(user);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return res.status(404).send({ message: "Usuário não encontrado" });
    }

    if (err.name === "CastError") {
      return res.status(400).send({ message: "ID inválido" });
    }

    return res.status(500).send({ message: "Erro no servidor" });
  }
};

// GET /users/me

module.exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).orFail();
    res.send(user);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return res.status(404).send({ message: "Usuário não encontrado" });
    }

    return res.status(500).send({ message: "Erro no servidor" });
  }
};


// POST /signup
module.exports.createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    res.status(201).send({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).send({ message: "Erro de validação" });
    }

    if (err.code === 11000) {
      return res.status(409).send({ message: "Não foi possível criar o usuário" });
    }

    return res.status(500).send({ message: "Erro no servidor" });
  }
}; 

// POST /signin
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).send({ message: "Email ou senha incorretos" });
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return res.status(401).send({ message: "Email ou senha incorretos" });
    }

    const token = jwt.sign(
      { _id: user._id },
      JWT_SECRET, 
      { expiresIn: "7d" }
    );

    return res.send({ token });
  } catch (err) {
    return res.status(500).send({ message: "Erro no servidor" });
  }
};