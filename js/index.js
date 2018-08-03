let numberGenerator = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
 }
 let videoPlaying = false;
 $(document).ready(()=> {
   $("body").click();
 });
 $(document).keydown(event=>{
   $("#display").css("display", "initial");
   $("#instructions").css("display", "none");
   $("#rainsound")[0].play();
   var videoTime = $("#rainsound")[0].currentTime;
   if ((videoTime >= 4.5 && videoTime <= 7) || (videoTime >= 13.5 && videoTime <= 16.5) || (videoTime >= 22 && videoTime <= 23)) {
     $("body").addClass("thunder");
     $("#umbrella-container").addClass("thunder");
     $(".ball").addClass("thunder");
     $("#handleCover").addClass("thunder");
   }
   else {
     $("body").removeClass("thunder");
     $("#umbrella-container").removeClass("thunder");
     $(".ball").removeClass("thunder");
     $("#handleCover").removeClass("thunder");
   }
   var xCoord = numberGenerator(30, 70);
   var twist = numberGenerator(2, 1);
   var shift = numberGenerator(15, 8);
   var rainCharacterElement = $(`<p class = 'fallingFormatting'>${String.fromCharCode(event.keyCode).toLowerCase()[0]}</p>`);
   $("body").append(rainCharacterElement);
   rainCharacterElement.css("left", xCoord + "%");
   if (twist === 1 && !(xCoord >= 40 && xCoord <= 60)) {
     rainCharacterElement.addClass("fallingTwistL");
     rainCharacterElement.animate({left:  xCoord - shift + "%"}, 1000);
     setTimeout(()=>{
       rainCharacterElement.remove();
     }, 1000);
   }
   else if (twist === 2 && !(xCoord >= 40 && xCoord <= 60)) {
     rainCharacterElement.addClass("fallingTwistR");
     rainCharacterElement.animate({left:  xCoord + shift + "%"}, 1000);
     setTimeout(()=>{
       rainCharacterElement.remove();
     }, 1000);
   }
   else if (xCoord >= 40 && xCoord < 50) {
     rainCharacterElement.addClass("rainOnUmbrellaL");
     setTimeout(()=>{
       rainCharacterElement.remove();
     }, 800);
   }
   else if (xCoord > 50 && xCoord <= 60) {
     rainCharacterElement.addClass("rainOnUmbrellaR");
      setTimeout(()=>{
       rainCharacterElement.remove();
     }, 800);
   }
   else {
     rainCharacterElement.remove();
   }
 });
 $(document).keyup(event=>{
   $("#display").css("display", "none");
   $("#rainsound")[0].pause();
   $("body").removeClass("thunder");
   $("#umbrella-container").removeClass("thunder");
   $(".ball").removeClass("thunder");
   $("#handleCover").removeClass("thunder");
   $("#instructions").css("display", "initial");
 });
 let lat = "";
 let long = "";
 let week = ["Sunday", "Monday","Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
 let dayHolder = [];
 let displayHolder = [];
 let displayIndex = 0;
 let cityName = "";
 let resultListCounter = 0;
 navigator.geolocation.getCurrentPosition(
   sucess = (pos) => {
     lat = pos.coords.latitude;
     long= pos.coords.longitude;
     $.ajax({
       url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&APPID=fe70cb87356cb1fc32c8f039164103ea`
     }).done((result)=>{
       console.log(result);
       cityName = result.city.name;
       result.list.forEach((element)=> {
        if (typeof element.rain === "undefined") {
          resultListCounter ++;
        }
        else { 
         if (element.rain.hasOwnProperty("3h") && !dayHolder.includes(element.dt_txt.slice(0,element.dt_txt.indexOf(" ")))) {
           dayHolder.push(element.dt_txt.slice(0,element.dt_txt.indexOf(" ")));
           var yearFromJSON = element.dt_txt.slice(0, 5);
           var monthFromJSON = element.dt_txt.slice(5, 7);
           var dayFromJSON = element.dt_txt.slice(8);
           var rainDate = new Date(parseInt(yearFromJSON), parseInt(monthFromJSON-1), parseInt(dayFromJSON.slice(0,3)));
           var weekDay = week[rainDate.getDay()];
           displayHolder.push(`It will rain in ${cityName} on ${weekDay}, ${monthFromJSON}/${dayFromJSON.slice(0,3)}`);
         }
         resultListCounter ++;
         if ((resultListCounter === result.list.length) && dayHolder.length === 0) {
           $("#display").text(`It will not rain in ${cityName}'s 5 day forecast.`);
         }
         else {
            $("#display").css("display", "none");
            $("#instructions").css("display", "initial");
         }
        }
       });
       setInterval(()=>{
         $("#display").text(displayHolder[displayIndex]);
         displayIndex ++;
         if (displayIndex > dayHolder.length-1) {
           displayIndex = 0;
         }
       }, 1000);
     }).fail((result)=> {
       console.log(result)
     });
   },
   error = (err) => {
     alert("Enable location services to allow for rain data search.");
   }  
 );
 