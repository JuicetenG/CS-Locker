const searchBox = document.querySelector('#weapon-search');
const select = document.querySelector('#weapon');
const image = document.querySelector('#skin-image-new');
const slider = document.querySelector('#float')
const sliderOutput = document.querySelector('#slider-output');

let weaponsList = [];

console.log('in the script');

//get weapon data and sort alphabetically by the name property
async function searchWeaponNames() {
  try {
    const response = await fetch('/skins/data/weapons');
    weaponsList = await response.json();
    weaponsList.sort((a, b) => a.name.localeCompare(b.name));
    fillSelect(weaponsList);
  } catch(err) {
    console.log(err)
  }
}

//populates the select element with the weapon names
function fillSelect(weapons) {
  select.innerHTML = '';
  const hiddenOption = document.createElement('option');
  hiddenOption.setAttribute('hidden', '');
  hiddenOption.textContent = weapons[0].name;
  select.appendChild(hiddenOption);

  weapons.forEach(weapon => {
    const option = document.createElement('option');
    option.value = weapon.name;
    option.textContent = weapon.name;
    select.appendChild(option);
  });
}

//filters the weapons listed in the select element
function filterWeapons(search) {
  let filteredItems = weaponsList.filter(weapon => 
    weapon.name.toLowerCase().includes(search.toLowerCase())
  );
  fillSelect(filteredItems);
}

//find and populate image matching the weapon selected from the select element
function findImage(weapon) {
  const foundImage = weaponsList.find(obj => obj.name === weapon)
  image.src = foundImage.image;
}

//update range slider value display element to show float value 
function displayFloat(float) {
  sliderOutput.textContent = float;
}

searchBox.addEventListener('input', (e) => {
  filterWeapons(e.target.value);
});

select.addEventListener('change', (e) => {
  findImage(e.target.value);
});

slider.addEventListener('input', (e) => {
  displayFloat(e.target.value);
});

searchWeaponNames();