const express = require("express");
const auth = require("../middleware/auth");
const Hero = require("../models/hero");
const router = new express.Router();

// admin create new hero to the game
router.post("/heroes", async (req, res) => {
  const hero = new Hero(req.body);

  try {
    await hero.save();
    res.status(201).send(hero);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// user increase power of selected  hero
router.patch("/heroes/powerUp/:id", auth, async (req, res) => {
  try {
    const hero = await Hero.findByIdAndUpdate(
      req.params.id,
      {
        currentPower: req.body.currentPower,
        remainingPowerUp: req.body.remainingPowerUp,
      },
      { new: true }
    );
    if (!hero) {
      return res.status(404).send();
    }

    await hero.save();
    res.send(hero);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// return all heroes of a logged in user
router.get("/heroes/myHeroes", auth, async (req, res) => {
  try {
    const heroes = await Hero.find({ owner: req.user.id });
    if (!heroes) {
      return res.status(404).send("no heroes found");
    }
    res.status(201).send(heroes);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// return heroes of the game
router.get("/heroes/allHeroes", auth, async (req, res) => {
  try {
    const heroes = await Hero.find({ owner: req.user.id });
    if (!heroes) {
      return res.status(404).send("no heroes found");
    }
    res.status(201).send(heroes);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// insert to database all heroes belonging to the game
router.post("/heroes/heroesForDatabase", (req, res) => {
  try {
    const allHeroes = req.body.allHeroes;
    allHeroes.forEach(async (hero) => {
      hero.owner = "63c7a739c7857aa79fd0ebab";
      await new Hero(hero).save();
    });
    res.status(201).send(allHeroes);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
module.exports = router;
