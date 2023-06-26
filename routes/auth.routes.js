const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./../models/User.model");
const { isAuthenticated } = require("../middlewares/verifyToken.middleware");
const saltRounds = 10;

router.post("/signup", (req, res, next) => {
  const { email, password, name } = req.body;


  console.log("al back le llega", email, password, name )

  if (password.length < 2) {
    res
      .status(400)
      .json({ message: "Password must have at least 2 characters" });
    return;
  }

  User.find({ email })
    .then(foundUser => {
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      return User.create({ email, password: hashedPassword, username: name });
    })
    .then(createdUser => {
      const { email, name, _id } = createdUser;
      const user = { email, name, _id };

      res.status(201).json({ user });
    })
    .catch(err => {
        console.log("No encuentra el email")
      next(err);
    });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  console.log("a esta ruta le llega", req.body)

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  User.findOne({ email })
    .then(foundUser => {
        console.log("Lo que trae de DB es", foundUser)

      if (!foundUser) {
        res.status(401).json({ message: "User not found." });
        return;
      }
      if (bcrypt.compareSync(password, foundUser.password)) {
        const { _id, email, name } = foundUser;
        console.log("se supone que el usuario es:", foundUser)

        const payload = { _id, email, name };

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h"
        });

        // req.session.currentUser = foundUser;

        res.json({ authToken });
      } else {
        
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch(err => next(err));
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  console.log("Authenticated user data: ", req.payload);

  res.status(200).json(req.payload);
});

module.exports = router;
