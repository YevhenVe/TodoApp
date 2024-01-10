import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Weather.scss";

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const weatherApi = process.env.REACT_APP_WEATHERAPI;

    const fetchData = async (latitude, longitude) => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApi}`);
            setWeatherData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                fetchData(position.coords.latitude, position.coords.longitude);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    return (
        <div className="weather-wrapper">
            {weatherData && (
                <>
                    <div className="weather-city-name">{weatherData.name}</div>
                    {/* <p>{weatherData.weather[0].description}</p> */}
                    <div className="temp-box">
                        <div>{Math.round(weatherData.main.temp)} °C</div>
                        <img
                            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                            alt="Weather icon"
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Weather;
