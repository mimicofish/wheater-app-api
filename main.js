const cityInput = document.querySelector('#cityInput');
const searchBtn = document.querySelector('#searchBtn');
const iconEl = document.querySelector('#icons');
const cityEl = document.querySelector('#city');
const tempEl = document.querySelector('#temperature');
const weatherEl = document.querySelector('#description');
const windEl = document.querySelector('#wind');
const statusEl = document.querySelector('#status');
const historyEl = document.querySelector('#history');

let history = [];

function loadHistory() {
    const saved = localStorage.getItem('history');

    if (saved) {
        try {
            history = JSON.parse(saved);
        } catch(error) {
            history = [];
        }
    }
}

loadHistory();
renderHistory();

searchBtn.addEventListener('click', function () {
    const city = cityInput.value;

    if (city === '') {
        statusEl.textContent = 'Please enter a city name';
        statusEl.className = 'error';
        
        iconEl.textContent = '';
        cityEl.textContent = '';
        tempEl.textContent = '';
        weatherEl.textContent = '';
        windEl.textContent = '';

        return;
    }

    statusEl.textContent = 'Loading...';
    statusEl.className = 'loading';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d2a5f855a4c40ff29991422688770503&units=metric`)
        .then(response => response.json())
        .then(data => {

            history = history.filter(city => city !== data.name);
            history.unshift(data.name);

            if (history.length > 5) {
                history.pop();
            }
            renderHistory();
            
            statusEl.textContent = '';
            statusEl.className = '';
            const condition = data.weather[0].main;
            const icons = {
                Clear: '☀️',
                Clouds: '☁️',
                Rain: '🌧️',
                Thunderstorm: '⛈️'
            };
            iconEl.textContent = icons[condition] || '🌏';
            cityEl.textContent = data.name;
            tempEl.textContent = data.main.temp + ' ⁰C';
            weatherEl.textContent = data.weather[0].description;
            windEl.textContent = 'Wind ' + data.wind.speed + ' m/s';
        })

        .catch(error => {
            statusEl.textContent = 'City not found 😥';
            statusEl.className = 'error';

            iconEl.textContent = '';
            cityEl.textContent = '';
            tempEl.textContent = '';
            weatherEl.textContent = '';
            windEl.textContent = '';
        });
});

function renderHistory() {
    historyEl.innerHTML = '';

    for (let i = 0; i < history.length; i++) {
        const p = document.createElement('p');
        p.textContent = history[i];
        historyEl.appendChild(p);

        const cityName = history[i];

        p.addEventListener('click', function() {
            cityInput.value = cityName;
            searchBtn.click();
        });
    }

    localStorage.setItem('history', JSON.stringify(history));
}