document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '0bb8cd07b5f49f7296b0fd5b995c71d4';
    const searchButton = document.getElementById('searchButton');
    const locationInput = document.getElementById('locationInput');
    const weatherInfo = document.getElementById('weatherInfo');
    const loadingSpinner = document.getElementById('loadingSpinner');

    searchButton.addEventListener('click', () => {
        const location = locationInput.value;
        if (location) {
            getWeatherByLocation(location);
        }
    });

    function showLoadingSpinner() {
        loadingSpinner.style.display = 'block';
    }

    function hideLoadingSpinner() {
        loadingSpinner.style.display = 'none';
    }

    function getWeatherByLocation(location) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
        
        showLoadingSpinner();
        weatherInfo.innerHTML = ''; // Clear previous results

        fetch(url)
            .then(response => {
                hideLoadingSpinner();
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => displayWeather(data))
            .catch(error => {
                hideLoadingSpinner();
                console.error('Error fetching weather data:', error);
                weatherInfo.innerHTML = '<p>Failed to fetch weather data. Please try again.</p>';
            });
    }

    function displayWeather(data) {
        if (data.cod === 200) {
            const location = document.createElement('p');
            const description = document.createElement('p');
            const temperature = document.createElement('p');
            const humidity = document.createElement('p');
            const wind = document.createElement('p');
            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
            const sunriseElement = document.createElement('p');
            const sunsetElement = document.createElement('p');

            location.textContent = `Location: ${data.name}, ${data.sys.country}`;
            description.textContent = `Weather: ${data.weather[0].description}`;
            temperature.textContent = `Temperature: ${data.main.temp} °C (Feels like: ${data.main.feels_like} °C)`;
            humidity.textContent = `Humidity: ${data.main.humidity} %`;
            wind.textContent = `Wind Speed: ${data.wind.speed} m/s`;
            sunriseElement.textContent = `Sunrise: ${sunrise}`;
            sunsetElement.textContent = `Sunset: ${sunset}`;

            weatherInfo.appendChild(location);
            weatherInfo.appendChild(description);
            weatherInfo.appendChild(temperature);
            weatherInfo.appendChild(humidity);
            weatherInfo.appendChild(wind);
            weatherInfo.appendChild(sunriseElement);
            weatherInfo.appendChild(sunsetElement);
        } else {
            weatherInfo.innerHTML = '<p>Location not found. Please try again.</p>';
        }
    }

    function getWeatherByCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
                
                showLoadingSpinner();
                weatherInfo.innerHTML = ''; // Clear previous results

                fetch(url)
                    .then(response => {
                        hideLoadingSpinner();
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => displayWeather(data))
                    .catch(error => {
                        hideLoadingSpinner();
                        console.error('Error fetching weather data:', error);
                        weatherInfo.innerHTML = '<p>Failed to fetch weather data. Please try again.</p>';
                    });
            });
        } else {
            weatherInfo.innerHTML = '<p>Geolocation is not supported by this browser.</p>';
        }
    }

    getWeatherByCurrentLocation();
});
