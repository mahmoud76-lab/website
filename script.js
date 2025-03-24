// Azkar functionality - Changing Azkar every minute
const azkarTextElement = document.getElementById("azkarText");
const azkarAudio = document.getElementById("azkarAudio");
const azkarList = [
    "SubhanAllah",
    "Alhamdulillah",
    "Allahu Akbar",
    "La ilaha illallah"
];

let azkarIndex = 0;

// Function to change Azkar every minute
function changeAzkar() {
    azkarTextElement.innerText = azkarList[azkarIndex];
    azkarAudio.play();
    azkarIndex = (azkarIndex + 1) % azkarList.length; // Loop back to the first Azkar after the last one
}

// Change Azkar every 60 seconds
setInterval(changeAzkar, 60000);
changeAzkar(); // Initial Azkar change

// Quran Audio Controls
const quranAudio = document.getElementById("quranAudio");
const playPauseBtn = document.getElementById("playPauseBtn");
const skipBtn = document.getElementById("skipBtn");
const stopBtn = document.getElementById("stopBtn");
const volumeControl = document.getElementById("volumeControl");
const quranSelect = document.getElementById("quranSelect");

playPauseBtn.addEventListener("click", () => {
    if (quranAudio.paused) {
        quranAudio.play();
        playPauseBtn.innerText = "Pause";
    } else {
        quranAudio.pause();
        playPauseBtn.innerText = "Play";
    }
});

skipBtn.addEventListener("click", () => {
    quranAudio.currentTime += 10; // Skip 10 seconds ahead
});

stopBtn.addEventListener("click", () => {
    quranAudio.pause();
    quranAudio.currentTime = 0;
    playPauseBtn.innerText = "Play";
});

volumeControl.addEventListener("input", () => {
    quranAudio.volume = volumeControl.value;
});

quranSelect.addEventListener("change", () => {
    quranAudio.src = `assets/audio/${quranSelect.value}`;
    quranAudio.play();
});

// Salah Time functionality - Fetching Salah times based on location
function updateSalahTime() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Fetch Salah times (API: Aladhan API)
            fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`)
                .then(response => response.json())
                .then(data => {
                    const timings = data.data.timings;
                    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    let nextSalahTime = "";
                    for (let prayer in timings) {
                        if (currentTime < timings[prayer]) {
                            nextSalahTime = `${prayer}: ${timings[prayer]}`;
                            break;
                        }
                    }

                    if (!nextSalahTime) {
                        nextSalahTime = `Next Salah: ${timings.Fajr}`;
                    }

                    document.getElementById("salahTime").innerText = nextSalahTime;
                })
                .catch(error => {
                    console.error("Error fetching Salah times:", error);
                    document.getElementById("salahTime").innerText = "Unable to fetch Salah times.";
                });
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

setInterval(updateSalahTime, 60000);
updateSalahTime(); // Initial Salah time update

// Weather functionality - Fetching Weather based on location
function getWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Fetch Weather (API: OpenWeather API)
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=YOUR_API_KEY&units=metric`)
                .then(response => response.json())
                .then(data => {
                    const weather = data.weather[0].description;
                    const temp = data.main.temp;
                    document.getElementById("weatherInfo").innerText = `Weather: ${weather}, ${temp}°C`;
                })
                .catch(error => {
                    console.error("Error fetching weather:", error);
                    document.getElementById("weatherInfo").innerText = "Unable to fetch weather data.";
                });
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

setInterval(getWeather, 60000);
getWeather(); // Initial Weather update
