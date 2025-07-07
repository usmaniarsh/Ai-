// JavaScript
let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

// ✅ Speak function
function speak(text) {
    window.speechSynthesis.cancel();
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "en-IN"; // Fixed: 'hi-GB' is invalid
    window.speechSynthesis.speak(text_speak);
}

// ✅ Greet on load
function wishMe() {
    let day = new Date();
    let hours = day.getHours();
    if (hours >= 0 && hours < 12) {
        speak("Good Morning Sir");
    } else if (hours >= 12 && hours < 16) {
        speak("Good Afternoon Sir");
    } else {
        speak("Good Evening Sir");
    }
}
window.addEventListener('load', () => {
    wishMe();
});

// ✅ Voice recognition setup
let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!speechRecognition) {
    alert("Speech Recognition not supported in your browser. Please use Chrome.");
}

let recognition = new speechRecognition();
recognition.onresult = (event) => {
    let transcript = event.results[event.resultIndex][0].transcript;
    content.innerText = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener("click", () => {
    recognition.start();
    voice.style.display = "block";
    btn.style.display = "none";
});

// ✅ Core Command Function
function takeCommand(message) {
    voice.style.display = "none";
    btn.style.display = "flex";

    // 🔹 Basic Commands
    if (message.includes("hello") || message.includes("hey")) {
        speak("Hello sir, what can I help you with?");
    } else if (message.includes("who created you")) {
        speak("I am a virtual assistant, created by Arsh Sir.");
    } else if (message.includes("i love you")) {
        speak("I love you too.");
    } else if (message.includes("khana hua")) {
        speak("Haan, kha liya. Aur tum, khaye ki nahi?");
    } else if (message.includes("how are you")) {
        speak("I am good, and you?");
    
    // 🔹 Website Commands
    } else if (message.includes("open youtube")) {
        speak("Opening YouTube...");
        window.open("https://youtube.com", "_blank");
    } else if (message.includes("open google")) {
        speak("Opening Google...");
        window.open("https://google.com", "_blank");
    } else if (message.includes("open facebook")) {
        speak("Opening Facebook...");
        window.open("https://facebook.com", "_blank");
    } else if (message.includes("open instagram")) {
        speak("Opening Instagram...");
        window.open("https://instagram.com", "_blank");
    } else if (message.includes("open wikipedia")) {
        speak("Opening Wikipedia...");
        window.open("https://wikipedia.org", "_blank");
    } else if (message.includes("open email")) {
        speak("Opening Gmail...");
        window.open("https://mail.google.com/mail/u/0/#inbox", "_blank");
    } else if (message.includes("open whatsapp")) {
        speak("Opening WhatsApp Web...");
        window.open("https://web.whatsapp.com", "_blank");
    } else if (message.includes("open laptop")) {
        speak("Opening laptop store...");
        window.open("https://www.laptopstore.com", "_blank");

    // 🔹 Dynamic Website (e.g., "open amazon website")
    } else if (message.includes("open") && message.includes("website")) {
        let site = message.split(" ").pop().replace(".com", "").trim();
        speak(`Opening ${site}`);
        window.open(`https://${site}.com`, "_blank");

    // 🔹 Time & Date
    } else if (message.includes("time")) {
        let time = new Date().toLocaleTimeString();
        speak("The time is " + time);
    } else if (message.includes("date")) {
        let date = new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
        speak("Today's date is " + date);
    } else if (message.includes("day")) {
        let day = new Date().toLocaleString(undefined, { weekday: "long" });
        speak("Today is " + day);

    // 🔹 Weather Command (requires OpenWeatherMap API Key)
    } else if (message.includes("weather in")) {
        let city = message.split("weather in")[1].trim();
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY&units=metric`)
            .then(res => res.json())
            .then(data => {
                let weather = `The weather in ${city} is ${data.weather[0].description} with a temperature of ${data.main.temp}°C.`;
                speak(weather);
            }).catch(() => speak("Sorry, I couldn't fetch the weather."));
    
    // 🔹 Location
    } else if (message.includes("my location")) {
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                speak(`You are in ${data.city}, ${data.region}, ${data.country_name}`);
            }).catch(() => speak("Sorry, I couldn't determine your location."));

    // 🔹 YouTube Music
    } else if (message.includes("play music") || message.includes("play song")) {
        let song = message.replace("play music", "").replace("play song", "").trim();
        speak(`Playing ${song} on YouTube`);
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(song)}`, "_blank");

    // 🔹 Timer
    } else if (message.includes("set timer for")) {
        let seconds = parseInt(message.replace(/[^0-9]/g, ''));
        if (!isNaN(seconds)) {
            speak(`Setting a timer for ${seconds} seconds`);
            setTimeout(() => {
                speak("Timer is up!");
                alert("⏰ Time's up!");
            }, seconds * 1000);
        }

    // 🔹 Fallback Search
    } else {
        let cleanedMessage = message.replace(/shipra|shifra/gi, "").trim();
        let finalText = "This is what I found on the internet regarding " + cleanedMessage;
        speak(finalText);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(cleanedMessage)}`, "_blank");
    }
}
