// Defining the map

var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
        opacity : 1
      }),
      new ol.layer.Vector({
        source: new ol.source.Vector({
          url: 'geo-search-results-json' + window.location.search,
          format: new ol.format.GeoJSON()
        }),
        style: new ol.style.Style({
          image: new ol.style.Circle({
            radius: 10,
            stroke: new ol.style.Stroke({
              color: 'black',
              width: 4
            }),
            fill: new ol.style.Fill({
              color: 'yellow'
            })
          })
        }),
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([2.584, 48.841]),
      zoom: 12,
      maxZoom: 20
    })
  });

// Function to encapsulate a single document.getElementbyID(...).value =, for more elegance

function updateField(field_id, val){
  document.getElementById(field_id).value = val;
}

// Function to update both lon & lat fields in the form

function updateLonLat(evt) {
  if (evt != null){
    var map = evt.map;
  }
  
  var center = map.getView().getCenter();
  var proj_coo = ol.proj.toLonLat([center[0], center[1]]);
  
  updateField("val_lon", proj_coo[0]);
  updateField("val_lat", proj_coo[1]);
  
  }

// Update form fields and map view when request is made

var tab = window.location.search.split("=");
var val_rad = tab[3].split("&")[0];
var val_lon = tab[1].split("&")[0];
var val_lat = tab[2].split("&")[0];
var filter = tab[4].split("&")[0]

updateField("val_lon", val_lon);
updateField("val_lat", val_lat);
updateField("val_rad", val_rad);
updateField("filter", filter);

map.setView(new ol.View({
  center: ol.proj.fromLonLat([val_lon, val_lat]),
  zoom: 12,
  maxZoom: 20
}));

// Listener : allowing to update form fields "longitude" & "latitude" according to map view, via a click on a button

document.getElementById("update").addEventListener("click", function(event){
  event.preventDefault();

  var center = map.getView().getCenter();
  var proj_coo = ol.proj.toLonLat([center[0], center[1]]);

  updateField("val_lon", proj_coo[0]);
  updateField("val_lat", proj_coo[1]);

  var current_zoom = map.getView().getZoom();

  map.setView(new ol.View({
    center: center,
    zoom: current_zoom,
    maxZoom: 20
  }));
});

// Listener : allowing to update form field "radius" according to map view, via a click on a button

document.getElementById("extent").addEventListener("click", function(event){
  event.preventDefault();

  var ex = map.previousExtent_;
  var topLeftCorner = [ex[0],ex[1]];
  topLeftCorner = ol.proj.toLonLat(topLeftCorner);
  var center = map.getView().getCenter();
  center = ol.proj.toLonLat([center[0], center[1]]);

  var dist = Math.sqrt((topLeftCorner[0] - center[0])**2 + (topLeftCorner[1] - center[1])**2);
  updateField("val_rad", dist);
});

// Listener : allowing to automatically update the form fileds "longitude" & "latitude" according to the user navigation on the map

var checkbox = document.getElementById("check");

checkbox.addEventListener('change', function() {
if (this.checked) {
  map.on('moveend', updateLonLat);
}
else {
  map.un('moveend', updateLonLat);
}
});

