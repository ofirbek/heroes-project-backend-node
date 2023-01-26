const express = require("express");
const User = require("../models/user");
const Hero = require("../models/hero");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.patch("/users/trainHero", auth, async (req, res) => {
  // const updates = Object.keys(req.body);
  // const allowedUpdates = ["myHeroes"];
  // const isValidOperation = updates.every((update) =>
  //   allowedUpdates.includes(update)
  // );

  // if (!isValidOperation) {
  //   return res.status(400).send({ error: "Invalid updates!" });
  // }
  try {
    const hero = new Hero(req.body.hero);
    hero.owner = req.user._id;
    await hero.save();

    const user = await User.findByIdAndUpdate(
      req.user,
      {
        $push: { myHeroes: hero._id },
      },
      { new: true }
    );
    res.status(201).send(hero);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
