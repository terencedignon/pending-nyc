var React = require('react');
var StoreStore = require('../stores/store_store.js');
var ApiUtil = require('../util/api_util.js');
var MapStore = require('../stores/map_store.js');
var History = require('react-router').History;

var Map = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return { markers: [] };
  },
  componentDidMount: function () {
    this.storeListener = StoreStore.addListener(this._onStoreChange);
    this.mapListener = MapStore.addListener(this._onMapChange);

    var coordinates = {lat: Number(this.props.lat), lng: Number(this.props.lng)};

    map = new google.maps.Map(document.getElementById('map'), {
      center: coordinates,
      zoomControl: false,
      styles: [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e9e9e9"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dedede"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#333333"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
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
                "color": "#f2f2f2"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    }
],
      streetViewControl: false,
      mapTypeControl: false,
      zoom: 14
    });

  google.maps.event.addListener(map, 'tilesloaded', function () {
    var options = {bounds: map.getBounds().toJSON(), cuisine_type: this.props.cuisine_type}
    ApiUtil.fetchMap(options);
  }.bind(this));

  google.maps.event.addListener(map, 'idle', function() {
      clearInterval(this.mapInterval);
      this.mapInterval = setInterval(function () {
      var options = {bounds: map.getBounds().toJSON(), cuisine_type: this.props.cuisine_type}
      ApiUtil.fetchMap(options);
      clearInterval(this.mapInterval)
    }.bind(this), 1000);
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
  // this.setState({ markers: [] });
  var newMarkers = [];
  // this.setState({markers: []});
  MapStore.all().forEach(function(marker) {

    var icon;

  if (marker.calc.average <= 13) {
      icon = "http://i.imgur.com/E2oZQ4V.png";

    } else if (marker.calc.score <= 27) {
      icon = "http://i.imgur.com/h0qBo2q.png";

    } else {
      icon = "http://i.imgur.com/ejjOVXB.png";

    }
    var coordinates = {lat: Number(marker.lat), lng: Number(marker.lng) };
    var newMarker = new google.maps.Marker({
      position: coordinates,
      map: map,
      icon: icon,
      title: marker.name,
      id: marker.id
    });

    google.maps.event.addListener(newMarker, 'click', function() {
      ApiUtil.fetchComparison(newMarker.id, newMarker.title);
      // this.history.pushState(null, "rest/" + newMarker.id, {});
    }.bind(this));

    newMarkers.push(newMarker);

  }.bind(this));

  this.state.markers.forEach(function(marker) {
    marker.setMap(null)
  });


  this.setState({ markers: newMarkers});
},
_onStoreChange: function () {
  // this.setState(this.state);
},
  render: function () {
    // <div id="street-view"></div>

    return (
      <div>
        <div id="map">
        </div>
    </div>

  );
}

});

module.exports = Map;
