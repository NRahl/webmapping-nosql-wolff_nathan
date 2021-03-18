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

    console.log(window.location.search);
    var string = r.url;
    var tab = string.split("=");
    var val_rad = tab[3]
    var val_lon = tab[1].split("&")[0];
    var val_lat = tab[2].split("&")[0];

    document.getElementById("val_rad").value = val_rad;
    document.getElementById("val_lon").value = val_lon;
    document.getElementById("val_lat").value = val_lat;

    //code to set view

  } );
