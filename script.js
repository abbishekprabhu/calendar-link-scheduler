// MAIN FUNCTION

// alert("iCal service currently being developed. Generated URL iCal doesn't work for the moment.");

var curService;

function generateCalendarUrl() {
  obj = {
    title: $("#title").val(),
    details: $("#details").val(),
    location: $("#location").val(),
    start: $("#start").val(),
    end: $("#end").val(),
    timezone: $("#timezone").val()
  };

  var all_day = $("#allday").is(":checked");

  var str_api;
  var str_del;
  var str_location;
  var str_start;
  var str_end;
  var str_title;
  var str_details;
  var extras;

  var d1 = new Date(obj.start);
  var d2 = new Date(obj.end);

  var d1_str;
  var d2_str;

  var d1_y = d1.getFullYear();
  var d1_m = ("0" + (d1.getMonth() + 1)).slice(-2);
  var d1_d = ("0" + d1.getDate()).slice(-2);
  var d1_hh = ("0" + d1.getHours()).slice(-2);
  var d1_mm = ("0" + d1.getMinutes()).slice(-2);

  var d2_y = d2.getFullYear();
  var d2_m = ("0" + (d2.getMonth() + 1)).slice(-2);
  var d2_d = ("0" + d2.getDate()).slice(-2);
  var d2_hh = ("0" + d2.getHours()).slice(-2);
  var d2_mm = ("0" + d2.getMinutes()).slice(-2);

  $('#optional').hide();
  
  switch (curService) {
    case "google":
      
      if (all_day) {
        d1_str = d1_y + d1_m + d1_d;

        var tom = new Date(d1);
        tom.setDate(tom.getDate() + 1);

        d2_str =
          tom.getFullYear() +
          ("0" + (tom.getMonth() + 1)).slice(-2) +
          ("0" + tom.getDate()).slice(-2);
      } else {
        d1_str = d1_y + d1_m + d1_d + "T" + d1_hh + d1_mm + "00";
        d2_str = d2_y + d2_m + d2_d + "T" + d2_hh + d2_mm + "00";
      }

      str_api = "https://calendar.google.com/calendar/render?action=TEMPLATE";
      str_title = "&text=";
      str_details = "&details=";
      str_location = "&location=";
      str_start = "&dates=";
      str_end = "/";
      extras = "&pli=1&sf=true&output=xml";

      break;
    case "ical":
      
      if (all_day) {
        d1_str = d1_y + d1_m + d1_d;
        d2_str = "";
      } else {
        d1_str = d1_y + d1_m + d1_d + "T" + d1_hh + d1_mm + "00";
        d2_str = d2_y + d2_m + d2_d + "T" + d2_hh + d2_mm + "00";
      }

      str_api = "http://evenster.joystickinteractive.com/api/calendar";
      str_title = "?title=";
      str_details = "&description=";
      str_location = "&location=";
      str_start = "&start=";
      str_end = all_day ? "" : "&end=";
      if (obj.timezone == "Float" || all_day) extras = "";
      else extras = "&tz=" + encodeURIComponent(obj.timezone);
      
      $('#optional').show();
      if( $('#domain').val() )
        extras += '&domain='+ $('#domain').val();
      if( $('#product').val() )
        extras += '&product='+ $('#product').val();
      if( $('#company').val() )
        extras += '&company='+ $('#company').val();

      break;
    case "outlook":
      d1_str = d1_y + d1_m + d1_d + "T" + d1_hh + "%3A" + d1_mm + "%3A" + "00";
      d2_str = d2_y + d2_m + d2_d + "T" + d2_hh + "%3A" + d2_mm + "%3A" + "00";

      str_api =
        "https://outlook.live.com/owa/#path=%2fcalendar%2faction%2fcompose";
      str_location = "&location=";
      str_start = "&startdt=";
      str_end = "&enddt=";
      str_title = "&subject=";
      str_details = "&body=";
      extras = "";

      if (all_day) extras += "&allday=true";
      else extras += "&allday=false";

      break;
    case "yahoo":
      d1_str = d1_y + d1_m + d1_d + "T" + d1_hh + d1_mm + "00";
      d2_str = d2_y + d2_m + d2_d + "T" + d2_hh + d2_mm + "00";

      str_api = "https://calendar.yahoo.com/?&view=d&v=60&type=20";
      str_title = "&title=";
      str_details = "&desc=";
      str_location = "&in_loc=";
      str_start = "&st=";
      str_end = "&et=";
      extras = "";

      if (all_day) extras += "&DUR=allday";

      break;
    default:
      console.log("CALENDARS: google, ical, outlook, yahoo");
  }

  var calURL = str_api;

  if (obj.title) calURL += str_title + encodeURIComponent(obj.title);
  if (obj.details) calURL += str_details + encodeURIComponent(obj.details);
  if (obj.start) calURL += str_start + d1_str;
  if (obj.end) calURL += str_end + d2_str;
  if (obj.location) calURL += str_location + encodeURIComponent(obj.location);

  calURL += extras;

  $("#copy").addClass("active");
  $("#test").addClass("active");
  $("#url").addClass("active");

  $("#url").text(calURL);
}

//  LOGIC

var s = new Date();
var localTZ = s.getTimezoneOffset() / 60;
var e = new Date(s);
e.setHours(s.getHours() + 3);

// alert(localTZ);

function format_time(date_obj) {
  var year = date_obj.getFullYear();
  var month = date_obj.getMonth() + 1;
  var day = ("0" + date_obj.getDate()).slice(-2);
  var hour = date_obj.getHours();
  var minute = date_obj.getMinutes();
  var amPM = hour > 11 ? "PM" : "AM";
  if (hour > 12) {
    hour -= 12;
  } else if (hour == 0) {
    hour = "12";
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  return (
    month + "/" + day + "/" + year + " " + hour + ":" + minute + " " + amPM
  );
}

var cb = new Clipboard("#copy", {
  text: function() {
    return $("#url").text();
  }
});

$("#title")
  .val("")
  .click(function() {
    $(this).select();
  });
$("#details")
  .val("")
  .click(function() {
    $(this).select();
  });
$("#location")
  .val("")
  .click(function() {
    $(this).select();
  });
$("#start")
  .val(format_time(s))
  .click(function() {
    $(this).select();
  });
$("#end")
  .val(format_time(e))
  .click(function() {
    $(this).select();
  });

$("#allday").click(function() {
  if (curService) generateCalendarUrl();

  if ($("#allday").is(":checked")) {
    $(".hideallday").hide();
  } else {
    $(".hideallday").show();

    if (curService != "ical") $(".hidetz").hide();

    
  }
});

$('#optional').hide();

$(".refresh").on("input", function() {
  if (curService) generateCalendarUrl();
});

$(".btn").click(function() {
  curService = this.id.substring(4);
  generateCalendarUrl();

  if (curService == "ical") {
    if ($("#allday").is(":checked")) $(".hidetz").hide();
    else $(".hidetz").show();
  } else {
    $(".hidetz").hide();
  }
});

$("#test").click(function() {
  var urlstring = $("#url").text();
  window.open(urlstring, "_blank");
});
