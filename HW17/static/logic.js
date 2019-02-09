function createFeatures(earthquakedata) {

    var mapurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"

    d3.json(mapurl, function(data) {
        createFeatures(data.features);
      });

console.log(mapurl)
}