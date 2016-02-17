var React = require('react');
var StoreStore = require('../stores/store_store.js');
var ApiUtil = require('../util/api_util.js');
var MapStore = require('../stores/map_store.js');

var Map = React.createClass({
  getInitialState: function () {
    return { markers: [], newMarkers: [], cuisine_type: null};
  },
  componentDidMount: function () {

    this.storeListener = StoreStore.addListener(this._onStoreChange);
    this.mapListener = MapStore.addListener(this._onMapChange);
    var coordinates = {lat: 40.7127, lng: -74.0059};
    map = new google.maps.Map(document.getElementById('main-map'), {
      center: coordinates,
      disableDefaultUI: true,
      zoom: 12,
      styles: [
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 100
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 100
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#000000"
            },
            {
                "saturation": -100
            },
            {
                "lightness": -100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 100
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 100
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": 0
            },
            {
                "lightness": 100
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#000000"
            },
            {
                "saturation": 0
            },
            {
                "lightness": -100
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": 0
            },
            {
                "lightness": 100
            },
            {
                "visibility": "off"
            }
        ]
    }
]
    });

  google.maps.event.addListener(map, 'tilesloaded', function () {
    var options = {bounds: map.getBounds().toJSON(), cuisine_type: this.state.cuisine_type}
    ApiUtil.fetchMap(options);
  }.bind(this));

  google.maps.event.addListener(map, 'idle', function() {
      var options = {bounds: map.getBounds().toJSON(), cuisine_type: this.state.cuisine_type}
      ApiUtil.fetchMap(options);
    }.bind(this));

  //
  // var panorama;
  // panorama = new google.maps.StreetViewPanorama(
  //   document.getElementById('street-view'),
  //   {
  //     position: coordinates,
  //     disableDefaultUI: true,
  //     streetViewControl: false,
  //     pov: {heading: 165, pitch: 0},
  //     zoom: 1
  //   });

},

componentWillUnmount: function () {
  this.storeListener.remove();
  this.mapListener.remove();
},
_onMapChange: function () {
  this.setState({ markers: [] });
  var newMarkers = [];

  MapStore.all().forEach(function(marker) {
    var grade;
    var hex;
    var text = "FFF";
    var shadow = "_withshadow";

  if (marker.camis === this.props.camis) {
      grade = marker.calc.average;
      hex = "FFF";
      shadow = "";
      text = "FFF";
  }
  else if (marker.calc.average <= 13) {
      grade = marker.calc.average;
      hex = "0056ac";
    } else if (marker.calc.average <= 27) {
      grade = marker.calc.average;
      hex = "49ac42";
    } else {
      grade = marker.calc.average;
      hex="fa9828";
    }


    var coordinates = {lat: Number(marker.lat), lng: Number(marker.lng) };
    var newMarker = new google.maps.Marker({
      position: coordinates,
      map: map,
      icon: "https://chart.googleapis.com/chart?chst=d_map_pin_letter" + shadow + "&chld=" +
        grade + "|" + hex + "|" + text,
      title: marker.name,
    });


    newMarkers.push(newMarker);
  }.bind(this));

  this.state.markers.forEach(function(marker) {
    marker.setMap(null)
  });

  this.setState({ markers: newMarkers});


},
_onStoreChange: function () {
  // this.setState({map: StoreStore.getMap()});

},

  render: function () {
    // <div id="street-view"></div>

    return (
      <div className="main-page-holder">

    <div id="main-map"></div>
    <div className="options">
      <i className="fa fa-reply"></i>
      <input type="checkbox" name="cuisine" value="American"/>American<br/>

    </div>
    </div>

  );
}

});

module.exports = Map;
