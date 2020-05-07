function getExchangeRates(base = 'EUR', date = 'latest') {
    const URL = 'https://api.exchangeratesapi.io';
    return fetch(`${URL}/${date}?base=${base}`)
    .then((r) => r.json())
    .then((r) => r.rates);
}

function getBases() {
  return getExchangeRates().then((result) => Object.keys(result).concat('EUR'));
}
//obtener monedas = getBases→lo que hago con "getBases" es llamar a "getExchangeRates" y obtener un "resultado". A este "resultado"
//le saco las keys y le agrego la base EUR

function showRates(rates) {
  const $rates = document.querySelector('#exchange tbody');
  $rates.innerHTML = '';

  // cambios rates , y moneda base
  Object.keys(rates).sort().forEach((base) => {
    const $row = document.createElement('tr');
    const $base = document.createElement('td');
    const $rate = document.createElement('td');
    $base.textContent = base;
    $rate.textContent = rates[base];
    $row.appendChild($base);
    $row.appendChild($rate);
    $rates.appendChild($row);
  });
}

function getSelectedBase() {
  const $activeItem = document.querySelector('.list-group-item.active');
  if ($activeItem) {
    return $activeItem.dataset.base;
  }

  return undefined;
}

function getSelectedDate() {
  const selectedDate = document.querySelector('#date').value;
  return selectedDate || undefined;
}

function showUpdateSign() {
  document.querySelector('#exchange tbody').innerHTML = 'Loading...';
}


function update() {
  showUpdateSign();
  getExchangeRates(getSelectedBase(), getSelectedDate())
    .then((rates) => {
      showRates(rates);
    });
}

// showBasesList
function showBasesList(bases) {
  const $list = document.createElement('div'); 
  $list.className = 'list-group';

  bases.sort().forEach((base) => {
    const $item = document.createElement('a'); 
    $item.href = '#';
    $item.classList.add('list-group-item', 'list-group-item-action');
    $item.textContent = base;
    $item.dataset.base = base;
    $item.addEventListener('click', () => {
      const $activeItem = document.querySelector('.list-group-item.active');
      if ($activeItem) {
        $activeItem.classList.remove('active');
      }
      $item.classList.add('active');
      update();
    });
    $list.appendChild($item);
  });

  document.querySelector('#bases').appendChild($list);
}

function inputDate() {
  const $date = document.querySelector('#date');
  // formato YYYY-MM-DD
  const today = (new Date()).toISOString().split('T')[0];
  $date.setAttribute('max', today);
  $date.addEventListener('change', update);
}

function setUp() {
    inputDate();

    getBases().then((rates) => {
        showBasesList(rates);
  });
}

setUp();
