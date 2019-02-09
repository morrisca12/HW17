// Store our API endpoint inside queryUrl
// var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
//   "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

var queryUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    // var earthquakeData=usgs_data.features;
    var platesData=plates.features;


    //Initialize Earthquakes
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    function markeropt(feature){
        if (feature.properties.mag<=1){v_fillcolor="lightgreen";}
        if (feature.properties.mag>1 && feature.properties.mag<=2){v_fillcolor="green";}
        if (feature.properties.mag>2 && feature.properties.mag<=3){v_fillcolor="lightblue";}
        if (feature.properties.mag>3 && feature.properties.mag<=4){v_fillcolor="blue";}
        if (feature.properties.mag>4 && feature.properties.mag<=5){v_fillcolor="purple";}
        if (feature.properties.mag.mag>5){v_fillcolor="red";}

        var geojsonMarkerOptions = {
            radius: feature.properties.mag*3,
            fillColor: v_fillcolor,
            color: "#000",
            weight: .5,
            opacity: 1,
            fillOpacity: 0.8
        };
        return geojsonMarkerOptions;
    }

    var earthquakes = L.geoJSON(earthquakeData, 
    {        
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, markeropt(feature));}
    });


    //Initialize Plates
    var eqplates = L.geoJSON(platesData);
    
    createMap(earthquakes,eqplates);
    
}


function createMap(earthquakes,eqplates) {

  // Define streetmap and darkmap layers
  var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibW9ycmlzY2FhIiwiYSI6ImNqcngwODA5MDBpOHk0OXFyanB0aTh0ZTAifQ.X_BT_ls_qT_HrZGB3YUzsw");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibW9ycmlzY2FhIiwiYSI6ImNqcngwODA5MDBpOHk0OXFyanB0aTh0ZTAifQ.X_BT_ls_qT_HrZGB3YUzsw");

  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibW9ycmlzY2FhIiwiYSI6ImNqcngwODA5MDBpOHk0OXFyanB0aTh0ZTAifQ.X_BT_ls_qT_HrZGB3YUzsw");


  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite": satellite,
    "Grayscale": darkmap,
    "Outdoors": outdoors
  
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes,
    "Fault Lines": eqplates
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [satellite,eqplates,earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);
  

  function addlegends(){
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        var bcolor="";
        var lbl="";
        div.innerHTML='<font size=3 color=red>Magnitude:</font><br>';
        for (var i = 0; i < grades.length; i++) 
        {
            if (grades[i]==0){bcolor="lightgreen";lbl="0-1"}
            if (grades[i]==1){bcolor="green";lbl="1-2"}
            if (grades[i]==2){bcolor="lightblue";lbl="2-3"}
            if (grades[i]==3){bcolor="blue";lbl="3-4"}
            if (grades[i]==4){bcolor="purple";lbl="4-5"}
            if (grades[i]==5){bcolor="red";lbl="5+"}
            div.innerHTML += '<font size=2 color="' + bcolor + '">'+lbl+'</font>' + '<br>';
        }

    return div;
    };

    legend.addTo(myMap);
  }

  addlegends();


  
