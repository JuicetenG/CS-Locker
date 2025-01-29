const searchBox = document.querySelector('#weapon-search');
const select = document.querySelector('#weapon');
let weaponsList = [];

console.log('in the script');

async function searchWeaponNames() {
  try {
    const response = await fetch('/skins/data/weapons');
    weaponsList = await response.json();
    fillSelect(weaponsList);
  } catch(err) {
    console.log(err)
  }
}

function fillSelect(weapons) {
  select.innerHTML = '';
  weapons.forEach(weapon => {
    const option = document.createElement('option');
    option.value = weapon;
    option.textContent = weapon;
    select.appendChild(option);
  });
}

function filterItems(search) {
  let filteredItems = weaponsList.filter(item => 
    item.toLowerCase().includes(search.toLowerCase())
  );
  fillSelect(filteredItems);
}

searchBox.addEventListener('input', (e) => {
  filterItems(e.target.value);
});

searchWeaponNames();