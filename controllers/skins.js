const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Weapon = require('../models/weapon.js');
const UserWeapon = require('../models/user-weapon.js');

router.get('/', async (req, res) => {
  const userWeapons = await UserWeapon.find({}).populate('weapon');
  console.log(userWeapons);
  res.render('skins/index.ejs', {
    weapons: userWeapons,
  });
});

router.post('/', async (req, res) => {
  try {
    const weaponRef = await Weapon.findOne({ name: req.body.weapon });
    let wearLevel = req.body.float;

    if(wearLevel > 0.00 && wearLevel <= 0.7) {
      wearLevel = 'Factory New';
    } else if(wearLevel <= 0.15) {
      wearLevel = 'Minimal Wear';
    } else if(wearLevel <= 0.38) {
      wearLevel = 'Field Tested';
    } else if(wearLevel <= 0.45) {
      wearLevel = 'Well Worn';
    } else wearLevel = 'Battle Scarred';

    await UserWeapon.create({ 
      weapon: weaponRef._id,
      price: Number(req.body.price),
      float: Number(req.body.float),
      wearLevel: wearLevel,
      owner: req.session.user._id,
    });

    res.redirect('/skins');
  } catch(err) {
    console.log(err);
    res.redirect('/');
  }
});

router.get('/new', async (req, res) => {
  const weaponsList = await Weapon.distinct('name');
  res.render('skins/new.ejs', {
    weapons: weaponsList,
  });
});



module.exports = router;
