$(document).ready(function() {
  
//SET UP VARIABLES
  var lats = 0,
      long = 0,
      tempC,
      tempF,
      tempCe,
      tempFa,
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
 
  //GET LOCATION DATA
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      lats = position.coords.latitude.toFixed(1);
      long = position.coords.longitude.toFixed(1);
      
      getData(parseFloat(lats), parseFloat(long));
      
      $(".convert").click(function() {
          $(".temp,.temp2").toggle();
        });   
    });
  }
  
  $(".icon").on('click', function() {
    $(this).fadeOut(300);
    if($(window).width() < 851) {
      $("input").delay(500).animate({
        width: "80vw",
        padding: "5px 0 5px 1rem"
      }, 300, function() {
        $("input#cityName").show();
        $(this).focus();
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
      var newCity = $('#cityName').val();
      if($(window).width() < 851) {
        $("input").blur();
      }
     
      $('#cityName').val('');
      lats = undefined;
      long = undefined;
      $("body").removeClass();
      $("img").detach();
      getData(lats, long, newCity);
    } 
  });
  
  //FUNCTIONS ***************************
  
  //GET WEATHER DATA VIA OPENWEATHERMAP API.  PARSED AUTOMATICALLY BY jQuery
  function getData(lats, long, newCity) {
    if(lats && long) {
      $.getJSON(
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lats +
        "&lon=" +
        long +
        "&units=metric&appid=44f43fc29ce6e6e51f04621e20830d3b"
      ).done(function(myJSON) {
        console.log(myJSON);
        assignData(myJSON);
      });
    } else  {
      $.getJSON("https://api.openweathermap.org/data/2.5/weather?q=" + newCity + "&units=metric&appid=44f43fc29ce6e6e51f04621e20830d3b").done(function(myJSON) {
        assignData(myJSON);
      });
    }  
  }
  
  //ASSIGN WEATHER DATA TO VARIABLES AND TO DOM ELEMENTS
  function assignData(myJSON) {
    tempC = Math.floor(myJSON.main.temp);
    tempF = Math.floor((tempC * 9/5) +32);
    tempCe = tempC + " °C";
    tempFa = tempF + " °F"; 
    
    $("button.convert").show();
    $(".city").text(myJSON.name);
    $(".city").css("text-decoration" , "underline");
    $(".weather").text(myJSON.weather[0].main + " (" + myJSON.weather[0].description.substring(0, 23) + ")");
    $(".temp").text("Temperature: " + tempCe);
    $(".temp2").text("Temperature: " + tempFa);
    $(".temp").hide();
    $(".humidity").text("Relative Humidity: " + myJSON.main.humidity + "%");
        
    visualize(myJSON);
  }
  
  //CHOOSE WHICH BACKGROUND AND ICON WILL BE DISPLAYED BASED ON WEATHER DATA
  function visualize(myJSON) {
    var weathId = myJSON.weather[0];
    
    switch(true) {
      case (weathId.id >= 801 && weathId.id < 810 && weathId.icon.charAt(2) === "d"):
        console.log(weathId.icon.charAt(2))
        $("body").addClass("cloudy");
        $(".city").after(clouds);
        break;

      case weathId.icon === "01d":
        $("body").addClass("sunny");
        $(".city").after(sunny);
        break;

      case weathId.icon === "01n" || weathId.icon ==="02n":
        $("body").addClass("clearNight");
        $(".city").after(clearNight);
        break;

      case weathId.id >= 801 && weathId.id < 810 && weathId.icon.charAt(2) === "n":
        $("body").addClass("cloudynight");
        $(".city").after(nightClouds);
        break;

      case weathId.icon === "50d" || weathId.icon ==="50n":
        $("body").addClass("foggy");
        $(".city").after(fog);
        break;

      case   weathId.icon === "09d" ||
        weathId.icon === "10d" ||
        weathId.icon === "09n" ||
        weathId.icon === "10n"   :
        $("body").addClass("rainy");
        $(".city").after(rainy);
        break;

      case weathId.icon === "11d" || weathId.icon === "11n":
        $("body").addClass("stormy");
        $(".city").after(stormy);
        break;

      case weathId.icon === "13d" || weathId.icon === "13n":
        $("body").addClass("snow");
        $(".city").after(snow);
        break;
    }   
  }  
});
