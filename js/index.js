
$(document).ready(function() {
  
  //SET UP VARIABLES
    let lat,
        lon,
        country,
        name,
        nameBackup,
        placeName,
        tempC,
        tempF,
        tempCe,
        tempFa,
        weathId,
        stateCode,
        sunny = "<img class = 'svg' src = 'https://chris-hesterman.github.io/ch-images//svg icons/animated/day.svg?raw=true'/>",
        clearNight = "<img class = 'svg' src = 'https://chris-hesterman.github.io/ch-images//svg icons/animated/night.svg?raw=true'/>",
        clouds = "<img class = 'svg' src = 'https://chris-hesterman.github.io/ch-images//svg icons/animated/cloudy.svg?raw=true'/>",
        nightClouds = "<img class = 'svg' src = 'https://chris-hesterman.github.io/ch-images//svg icons/animated/cloudy-night-1.svg?raw=true'/>",
        snow = "<img class = 'svg' src = 'https://chris-hesterman.github.io/ch-images//svg icons/animated/snowy-6.svg?raw=true'/>",
        stormy = "<img class = 'svg' src = 'https://chris-hesterman.github.io/ch-images//svg icons/animated/thunder.svg?raw=true'/>",
        rainy = "<img class = 'svg' src = 'https://chris-hesterman.github.io/ch-images//svg icons/animated/rainy-7.svg?raw=true'/>",
        fog = "<img class = 'svg fogfade' src = 'https://github.com/Chris-Hesterman/ch-images/blob/master/weather/fog.png?raw=true'/>";  
    
   //PREPARE FOR DISPLAY
    $("button.convert").hide();
    $("input#cityName").hide();
    $(".icon").hide();
    $(".load-error").hide();
    $("html").scrollTop(0);
    
    //GET LOCATION DATA - geolocation.getCurrentPosition hangs in chrome for mac, ipgeolocation API much faster!!
    $.getJSON('https://api.ipgeolocation.io/ipgeo?apiKey=b7b2c1f26fed4fb0806c2a5dec8c0ef9&fields=latitude,longitude').done(function(myJSON) {
      latitude = +myJSON.latitude;
      longitude= +myJSON.longitude;
      lat = latitude.toFixed(2);
      lon = longitude.toFixed(2);
      console.log(lat,lon);
      getInitialStateInfo(lat, lon);  
    });
    
    $(".icon").on('click', function(e) {
      $(this).fadeOut(300);
      if($(window).width() < 851) {  
        $(".weather, .humidity, .temp, .temp2, div.btn, #credits").fadeOut(500); 
        $("input").delay(500).animate({
          width: "80vw",
          padding: "5px 0 5px 1rem"
        }, 300, function() {
            $("input#cityName").focus();
        });
       } else {
         $("input").delay(500).animate({
          width: "40vw",
          padding: "2px 0 2px 1rem"
        }, 300, function() {
          $(this).focus();
        });
       }
     });
    
    //ACCEPT USER INPUT, BLUR() ON MOBILE AFTER RETURN TO GET KEYBOARD OFF SCREEN AGAIN
    $("#cityName").on('keyup', function(event) {
      if(event.which === 13) {
        nameBackup = name;
        name = encodeURI($('#cityName').val());
        $(".backImg").animate({opacity: 0}, 500);
        if($(window).width() < 851) {
          $(this).blur();
          $(this).fadeOut(500);
          setTimeout(function() {
            $(".icon").fadeIn(500);
          },500);
        }
        
        $('#cityName').val('');
        
        $.getJSON(`https://api.opencagedata.com/geocode/v1/json?q=${name}&key=6a03bc76226b406fb1510bfd9994df6a&pretty=1`).done(function(myJSON) {
          if (myJSON.results.length === 0) {
            $("html").scrollTop(0);
            $(".load").fadeOut(200);
            $(".load-error").fadeIn(200);
            setTimeout(function() {
              name = nameBackup;
              getData(lat, lon);
            },1000);
          } else {
            lat = myJSON.results[0].geometry.lat.toFixed(2);
            lon = myJSON.results[0].geometry.lng.toFixed(2);
            name = myJSON.results[0].components.city;
            stateCode = myJSON.results[0].components.state_code;
            country = myJSON.results[0].components.country_code;
          
            getData(lat, lon);
          } 
        })
      } 
    });
    
    //FUNCTIONS ***************************
    
    //GET WEATHER DATA VIA OPENWEATHERMAP API, Opencagedata geocoder API  PARSED AUTOMATICALLY BY jQuery
    function getInitialStateInfo(lat, lon) {
      $(".load").fadeOut(300);
      $.getJSON(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=6a03bc76226b406fb1510bfd9994df6a&pretty=1`).done(function(myJSON) {
        name = myJSON.results[0].components.city;
        stateCode = myJSON.results[0].components.state_code;
        setTimeout(function() {
          $(".icon").fadeIn(500);
        },500);
      
        getData(lat, lon);  
      })
      .fail(function() {
        $(".icon").fadeIn(500);
        getData(47.63, -122.34);
      });
    }
    
    function getData(lat, lon) {
      $.getJSON(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=44f43fc29ce6e6e51f04621e20830d3b`).done(function(myJSON) { 
      $(".load-error").fadeOut(300); 
      console.log(myJSON);
      assignData(myJSON);
      });    
    }
      
    //ASSIGN WEATHER DATA TO VARIABLES AND TO DOM ELEMENTS
    function assignData(myJSON) {
      let weatherDescription = myJSON.weather[0].description.substring(0, 23);
      tempC = Math.floor(myJSON.main.temp);
      tempF = Math.floor((tempC * 9/5) + 32);
      tempCe = tempC + " °C";
      tempFa = tempF + " °F"; 
      
      if (myJSON.sys.country === 'US') {
        placeName = (name || myJSON.name) + ', ' + (stateCode || myJSON.sys.country);
      } else {
        placeName = myJSON.name + '-' + country;
      }
      $("button.convert").show();
      $(".city").text(placeName);
      $(".city").css("text-decoration" , "underline");
      $(".weather").html(myJSON.weather[0].main + "<span>" + " (" + weatherDescription + "<span>)");
      $(".temp").text("Temperature: " + tempCe);
      $(".temp2").text("Temperature: " + tempFa);
      $(".temp").hide();
      $(".temp2").show();
      $(".convert").off('click');
      $(".convert").click(function() {
        $(".temp,.temp2").toggle();
        });
      $(".humidity").text("Relative Humidity: " + myJSON.main.humidity + "%");
      $("img.svg").fadeOut(500).detach(); 
      
      visualize(myJSON);
    }
    
    //CHOOSE WHICH BACKGROUND AND ICON WILL BE DISPLAYED BASED ON WEATHER DATA
    function visualize(myJSON) {
      weathId = myJSON.weather[0];
      
      switch(true) {
        case (weathId.id >= 801 && weathId.id < 810 && weathId.icon.charAt(2) === "d"):
          $(".backImg").attr("class","backImg cloudy");   
          $(".city").after(clouds);
          break;
  
        case weathId.icon === "01d":
          $(".backImg").attr("class","backImg sunny");
          $(".city").after(sunny);
          break;
  
        case weathId.icon === "01n" || weathId.icon ==="02n":
          $(".backImg").attr("class","backImg clearNight");
          $(".city").after(clearNight);
          break;
  
        case weathId.id >= 801 && weathId.id < 810 && weathId.icon.charAt(2) === "n":
          $(".backImg").attr("class","backImg cloudynight");
          $(".city").after(nightClouds);
          break;
  
        case weathId.icon === "50d" || weathId.icon ==="50n":
          $(".backImg").attr("class","backImg foggy");
          $(".city").after(fog);
          break;
  
        case   weathId.icon === "09d" ||
          weathId.icon === "10d" ||
          weathId.icon === "09n" ||
          weathId.icon === "10n"   :
          $(".backImg").attr("class","backImg rainy");
          $(".city").after(rainy);
          break;
  
        case weathId.icon === "11d" || weathId.icon === "11n":
          $(".backImg").attr("class","backImg stormy");
          $(".city").after(stormy);
          break;
  
        case weathId.icon === "13d" || weathId.icon === "13n":
          $(".backImg").attr("class","backImg snow");
          $(".city").after(snow);
          break;
      } 
      renderWeatherPage();
    }  

    //make css adjustments if necessary and present results
    function renderWeatherPage() {
      if (placeName.length > 13) {
        $("header").css({ "flex-direction": "column", "align-items": "center" });
        $(".city").css({ "margin-bottom": "0" });
        $("img.svg").css({ "margin-top": "0" });
        if ($(window).width() < 549) {
          $(".city").css({"font-size": "1.75rem"});
        }
      } else {
        $("header").css({ "flex-direction": "row", "align-items": "normal" });
        if ($(window).width() < 549) {
          $(".city").css({ "margin-bottom": "20", "font-size": "2.25rem" });
        }
        $("img.svg").css({ "margin-top": "10" });
      }
      
      $(".weather, .humidity, div.btn, #credits").fadeIn(700);
      $(".backImg").animate({opacity: 1},1000);

      if ($(window).width() > 850) {
        $("input").focus();
      }
      $("html").scrollTop(0);
    }
  });