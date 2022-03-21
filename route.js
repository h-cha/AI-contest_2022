var myMap;
var directionsRenderer = [];
var directionsService = new google.maps.DirectionsService();
var myMarkers = [];
var resultSteps;

function reRender() {
  if (myMarkers.length == 1) {
    return;
  }

  var myTravelMode =
    document.getElementById("TravelMode").value == "DRIVING"
      ? google.maps.DirectionsTravelMode.DRIVING
      : google.maps.DirectionsTravelMode.WALKING;
  directionsService.route(
    {
      origin: myMarkers[0].getPosition(),
      destination: myMarkers[1].getPosition(),
      travelMode: myTravelMode,
      provideRouteAlternatives: true,
    },
    function (result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        for (
          var routeIndex = 0;
          routeIndex < result.routes.length;
          routeIndex++
        ) {
          directionsRenderer[routeIndex] = new google.maps.DirectionsRenderer();
          directionsRenderer[routeIndex].setDirections(result);
          directionsRenderer[routeIndex].setRouteIndex(routeIndex);
          directionsRenderer[0].setMap(myMap);
        }
        console.dir(directionsRenderer);
        showSteps();
      } else {
        alert("ルート検索できませんでした");
      }
    }
  );
}

function showSteps() {
  var selected =
    document.getElementById("selectRoute").value == "ROUTE1"
      ? 0
      : document.getElementById("selectRoute").value == "ROUTE2"
      ? 1
      : 2;

  // ルートの文字表示

  console.dir(directionsRenderer[0]);
  var myRoute = directionsRenderer[0].directions.routes[selected].legs[0];
  var myp = document.getElementById("route");
  var str_steps = "";
  for (var i = 0; i < myRoute.steps.length; i++) {
    str_steps += myRoute.steps[i].instructions;
    str_steps += "<br>";
  }
  myp.innerHTML = str_steps;

  //ルートの各ステップの緯度経度を抽出
  var people_text = document.getElementById("people-flow");
  var overview_path =
    directionsRenderer[0].directions.routes[selected].overview_path;
  overview_path.forEach((x) => {
    var num_p = people_flow(x.lat(), x.lng());
  });
  // if (num_p > 100) {
  //   people_text.innerHTML = "混雑";
  // } else {
  //   people_text.innerHTML = "空いている";
  // }

  //route
  directionsRenderer.forEach((x) => x.setMap(null));
  directionsRenderer[selected].setMap(myMap);
}

function attachInstructionText(marker, text) {
  google.maps.event.addListener(marker, "click", function () {
    stepDisplay.setContent(text);
    stepDisplay.open(map, marker);
  });
}

function people_flow(lat, lng) {
  return 0;
}

function putMarker() {
  var neoMarker = new google.maps.Marker({
    position: arguments[0],
    map: myMap,
    draggable: true,
  });
  neoMarker.setMap(myMap);
  google.maps.event.addListener(neoMarker, "dragend", function (mouseEvent) {
    reRender();
  });
  myMarkers.push(neoMarker);

  if (myMarkers.length == 1) {
    return;
  } else if (myMarkers.length == 3) {
    myMarkers.shift().setMap(null);
    directionsRenderer.forEach((x) => x.setMap(null));
  }
  reRender();
}

$(document).ready(function () {
  var param = new Array();
  var a = window.location.search.substring(1);
  var b = a.split("&");
  var mm = new Array();
  for (var i in b) {
    var vals = new Array(2);
    vals = b[i].split("=", 2);
    if (vals[0] == "m") {
      if (vals[1].match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/)) {
        mm.push(new google.maps.LatLng(RegExp.$1, RegExp.$2, true));
      }
    }
    param[vals[0]] = vals[1];
  }
  delete b;
  delete a;

  var opts = {
    zoom: "z" in param && parseInt(param["z"]) >= 0 ? parseInt(param["z"]) : 11,
    center:
      "c" in param && param["c"].match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/)
        ? (mapCenter = new google.maps.LatLng(RegExp.$1, RegExp.$2, true))
        : new google.maps.LatLng(35.68, 139.7),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: true,
    scaleControl: true,
    navigationControlOptions: true,
    disableDoubleClickZoom: true,
    scrollwheel: false,
    zIndex: 0,
  };
  myMap = new google.maps.Map(document.getElementById("map_canvas"), opts);
  for (var i in mm) {
    putMarker(mm[i]);
  }

  delete mm;
  // クリックでマーカー設置
  google.maps.event.addListener(myMap, "click", function (mouseEvent) {
    putMarker(mouseEvent.latLng);
  });

  document.getElementById("journey").disabled = true;
  document.getElementById("distance").disabled = true;
});
