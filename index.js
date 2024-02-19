// const API_Key = "243d8a291f814faa99430a2cdc35beb1";
// const backImg=document.querySelector('.wrapper');
// function renderWeatherInfo(data){
//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} *C`;
//     backImg.appendChild(newPara);
// }
// async function showWeather(city){
//     try{
//     //calls the api and get the data and convert data in jsonn format and call for rendering the data in another function
//     //promise in response
//     const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}&units=metric`)
    
//     const data = await response.json();
//     console.log("Weather data:=> " , data);
//     //Generally use 1 function for 1 work therefre new function call
//     renderWeatherInfo(data);
//     // let newPara = document.createElement('p');
//     // newPara.textContent = `${data?.main?.temp.toFixed(2)} *C`;
//     // backImg.appendChild(newPara);
//     }
//     catch(err){
//         console.log("Error Found" , err);
//     } 
// }

// async function getCustomWeatherDetails(lat,lon) {
//     try{
//         let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_Key}`);
//         let data=await response.json();
//         console.log(data);
//     }
//     catch(e){
//         console.log("Error Found" , err);
//     }
// }

// function getLocation() {
//     if(navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else{
//         console.log("No Geolocation Support in Browser");
//     }
// }


//fetching 
const userTab=document.querySelector("[data-userWeather]");
const searchTab= document.querySelector("[datasearchWeather]");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm=document.querySelector(".form-container");
const loadingScreen = document.querySelector(".loading_container")
const userInfoContainer = document.querySelector(".user-info-container");
const notFound=document.querySelector(".not-found");

let oldTab = userTab;
const API_Key = "243d8a291f814faa99430a2cdc35beb1";
oldTab.classList.add("current-tab");
getfromSessionStorage();
//What what we need initially

userTab.addEventListener("click", ()=>{
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

//for functioning of buttons of your location and search 
function switchTab(newTab){
    if(notFound.classList.contains("active")){
        notFound.classList.remove("active");
    }
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove('active');
            grantAccessContainer.classList.remove('active');
            searchForm.classList.add("active");
        }
        else{
            //main pehle search wale tab pr tha ab weather tab visible krna hai 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab mein aa gya hu,toh weather bhi display karna padega, so let's check local storage first
            //for coordinates, if we have saved them there.
            getfromSessionStorage();
        }
    }
}

function showPosition(position){
    let latitude=position.coords.latitude;
    let longitude=position.coords.longitude
    console.log("Latitude=> ",latitude);
    console.log("Longitude=> ",longitude);
}
function accessButton(){
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("No Geolocation Support in Browser");
    }
}

//check if coordinates are already present iin local storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local coordinate nhi pade hue hai
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        // console.log(coordinates);
        fetchUserWeatherInfo(coordinates);
    }   
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    //make grant container invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API call
    try{
        let response =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_Key}&units=metric`); 
        //response.json always 
        console.log(response);
        let data=await response.json();
        console.log(data);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        //rendering
        renderWeatherInfo(data);  
    }
    catch(e){
        console.log(e);
    }
}

function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch the elements 
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weatherInfo
    cityName.innerText = weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png` ;
    temp.innerText = weatherInfo?.main?.temp + ` °C`;
    windspeed.innerText = weatherInfo?.wind?.speed + ` m/s`;
    humidity.innerText = weatherInfo?.main?.humidity;
    cloudiness.innerText = weatherInfo?.clouds?.all;    
    
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No Geolocation Support in Browser");
    }
}
function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === "")
        return;
    else
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        if(data?.cod==404){
            notFound.classList.add("active");
            return;
        }
        notFound.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        //hw
        alert('try Again');
    }
}





