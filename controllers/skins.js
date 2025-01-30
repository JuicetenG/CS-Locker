const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Weapon = require('../models/weapon.js');
const UserWeapon = require('../models/user-weapon.js');

router.get('/', async (req, res) => {
  try {
    const userWeapons = await UserWeapon.find({ }).populate('weapon');

    res.render('skins/index.ejs', {
      weapons: userWeapons,
    });

  } catch(err) {
    console.log(err);
    res.send('error rendering index page, check terminal');
  }
});


router.post('/', async (req, res) => {
  try {
    const weaponRef = await Weapon.findOne({ name: req.body.weapon });
    let wearLevel = req.body.float;

    if(wearLevel > 0.00 && wearLevel <= 0.07) {
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
    res.send('error adding skin, check terminal');
  }
});

router.get('/new', async (req, res) => {
  try {
    const weaponsList = await Weapon.find({ });

    res.render('skins/new.ejs', {
      weapons: weaponsList,  
    });

  } catch(err) {
    console.log(err);
    res.send('error rendering new page, check terminal');
  }
});


router.get('/:skinId', async (req, res) => {
  try {
    const skin = await UserWeapon.findOne( {_id: req.params.skinId} ).populate('weapon')
      .populate('owner');
    
    res.render('skins/show.ejs', {
      weapon: skin,
    });

  } catch(err) {
    console.log(err);
    res.send('error rendering show page, check terminal')
  }
});

router.get('/data/weapons', async (req, res) => {
  try {
    const allWeapons = await Weapon.find({ });
    res.json(allWeapons);
  } catch(err) {  
    console.log(err);
    res.send('error retrieving data, check terminal');
  }
});

router.get('/:skinId/edit', async (req, res) => {
  try {
    const skin = await UserWeapon.findOne({_id: req.params.skinId}).populate('weapon')
      .populate('owner');
  
    res.render('skins/edit.ejs', {
      weapon: skin,
    });

  } catch(err) {
    console.log(err);
    res.send('error rendering edit page, check terminal');
  }
});

router.get('/users/:userId', async (req, res) => {
  try {
    const userWeapons = await UserWeapon.find({ owner: req.params.userId }).populate('owner')
      .populate('weapon');
    const profile = await User.findById(req.params.userId);
  
    res.render('skins/userSkins.ejs', {
      weapons: userWeapons,
      profile: profile,
    });

  } catch(err) {
    console.log(err);
    res.send('error rendering user skins, check terminal');
  }
}); 

router.put('/:skinId', async (req, res) => {
  try {
    const skin = await UserWeapon.findOneAndUpdate(
      { _id: req.params.skinId },
      { $set: { price: Number(req.body.price) } },
      { new: true },
    );

    res.redirect(`/skins/${req.params.skinId}`);
  } catch(err) {
    console.log(err);
    res.send('error updating skin, check terminal');
  }
});

router.delete('/:skinId', async (req, res) => {
  try {
    await UserWeapon.findByIdAndDelete(req.params.skinId);
    res.redirect('/skins');
  } catch(err) {
    console.log(err);
    res.send('error deleting skin, check terminal');
  }
});

module.exports = router;
