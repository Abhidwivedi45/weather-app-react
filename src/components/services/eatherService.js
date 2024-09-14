import { DateTime } from "luxon";
//2f469350dd56188713edbb16417debaa
//1fa9ff4126d95b8db54f3897a208e91c
//886705b4c1182eb1c69f28eb8c520e20
const API_KEY = "1fa9ff4126d95b8db54f3897a208e91c";
const BASE_URL= "https://api.openweathermap.org/data/2.5";

const getWeatherData =(infotype, searchParams) => {
    const url = new URL(BASE_URL + "/" + infotype);
    url.search = new URLSearchParams({...searchParams, appid:API_KEY});

    return fetch(url).then((res) => {return (res.json())});
}

const formatCurrentWeather =  (data) =>{
    const {
        coord:{ lat,lon},
        main:{temp, feels_like, temp_min, temp_max, humidity},
        name,
        dt,
        sys:{country, sunrise, sunset},
        weather,
        wind:{speed}
    } = data;
//console.log(data,"first");
// console.log(temp,lat,"second");
    const {main:details, icon}= weather[0];

    return {lat, lon, temp, feels_like, temp_min, temp_max, humidity, name,
        dt,country, sunrise, sunset, details, icon, speed} ;
    
}

const formatWeatherForecast= (data) => {
    let {timezone, daily, hourly} = data;
    daily= daily.slice(1,6).map(d => {
        return{
            title: formatToLocalTime(d.dt, timezone, 'ccc'),
            temp: d.temp.day,
            icon: d.weather[0].icon
        }
    });

    hourly= hourly.slice(1,6).map(d => {
        return{
            title: formatToLocalTime(d.dt, timezone, 'hh:mm a'),
            temp: d.temp,
            icon: d.weather[0].icon
        }
    });

    return {timezone, daily, hourly};
}

const getFormattedWeatherData = async (searchParams) => {
    const formattedCurrentWeather = await getWeatherData('weather', searchParams).then(formatCurrentWeather);

    const {lat, lon}= formattedCurrentWeather;

    const formattedWeatherForecast= await getWeatherData("onecall", {
        lat,
        lon,
        exclude: "current, minutely, alerts",
        units:searchParams.units,
    }).then(formatWeatherForecast);
    
    return {...formattedCurrentWeather, ...formattedWeatherForecast};
}

const formatToLocalTime = (secs, zone, format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a") => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrl = (code) => `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;
export {formatToLocalTime, iconUrl};