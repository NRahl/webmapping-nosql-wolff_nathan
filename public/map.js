//const e = require("express");

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

fetch("geo-search-results-json" + window.location.search)
  .then(function(r) {

    var string = r.url;
    var tab = string.split("=");
    var val_rad = tab[3].split("&")[0];
    var val_lon = tab[1].split("&")[0];
    var val_lat = tab[2].split("&")[0];
    var filter = tab[4].split("&")[0]

    document.getElementById("val_rad").value = val_rad;
    document.getElementById("val_lon").value = val_lon;
    document.getElementById("val_lat").value = val_lat;
    document.getElementById("filter").value = filter;

    //console.log(map);
    map.setView(new ol.View({
      center: ol.proj.fromLonLat([val_lon, val_lat]),
      zoom: 12,
      maxZoom: 20
    }));

  } );

  document.getElementById("update").addEventListener("click", function(event){
    event.preventDefault();
    var center = map.getView().getCenter();
    var proj_coo = ol.proj.toLonLat([center[0], center[1]]);

    document.getElementById("val_lon").value = proj_coo[0];
    document.getElementById("val_lat").value = proj_coo[1];

    var current_zoom = map.getView().getZoom();

    map.setView(new ol.View({
      center: center,
      zoom: current_zoom,
      maxZoom: 20
    }));
  });

  document.getElementById("extent").addEventListener("click", function(event){
    event.preventDefault();
    var ex = map.previousExtent_;
    var topLeftCorner = [ex[0],ex[1]];
    topLeftCorner = ol.proj.toLonLat(topLeftCorner);
    var center = map.getView().getCenter();
    center = ol.proj.toLonLat([center[0], center[1]]);

    var dist = Math.sqrt((topLeftCorner[0] - center[0])**2 + (topLeftCorner[1] - center[1])**2);

    console.log(topLeftCorner, center);

    document.getElementById("val_rad").value = dist;
  });

  var checkbox = document.querySelector("input[name=checkbox]");

var checkbox = document.getElementById("check");
checkbox.addEventListener('change', function() {
  if (this.checked) {
    console.log("Checkbox is checked..");

    /*var form_lon = document.getElementById("val_lon");
    var form_lat = document.getElementById("val_lat");

    form_lon.addEventListener*/

    map.on('moveend', onMoveEnd);
  } else {
    console.log("Checkbox is not checked..");
    map.un('moveend', onMoveEnd);
  }
});

function onMoveEnd(evt) {
  var map = evt.map;

  var center = map.getView().getCenter();
  var proj_coo = ol.proj.toLonLat([center[0], center[1]]);

  document.getElementById("val_lon").value = proj_coo[0];
  document.getElementById("val_lat").value = proj_coo[1];



}

