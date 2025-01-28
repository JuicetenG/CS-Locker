const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log('Express has established a connection with MongoDB');
});

const Weapon = require('./models/weapon');

async function getWeaponSkins(req, res) {
  const data = await (await fetch('https://raw.githubusercontent.com/qwkdev/csapi/refs/heads/main/data.json')).json();
  const weaponData = Object.keys(data).map(key => data[key]);

  for(weapon of weaponData) {
    const exists = await Weapon.findOne({ name: weapon.name });
    if(!exists) {
      const addWeapon = await Weapon.create({
        name: weapon.name.charAt(0) === '★' ? weapon.name.substring(2) : weapon.name,
        weapon: weapon.weapon,
        finish: weapon.finish, 
        rarity: weapon.rarity,
        image: weapon.images[Object.keys(weapon.images)[0]],
      });
    }
  }
}

getWeaponSkins();
