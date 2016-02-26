var React = require('react');
var StoreStore = require('../stores/store_store.js');
var ApiUtil = require('../util/api_util.js');
var MapStore = require('../stores/map_store.js');
var History = require('react-router').History;

var Map = React.createClass({

  mixins: [History],

  getInitialState: function () {
    return { markers: [], markerSetting: "average", newMarkers: [], zipcode: "11375", boro: "", cuisine_type: "", name: ""};
  },
  componentDidMount: function () {

    // setInterval(function () {
    //   this.setState({ markers: MapStore.getMainMap() });
    // }.bind(this), 3000);


    this.storeListener = StoreStore.addListener(this._onStoreChange);
    this.mapListener = MapStore.addListener(this._onMapChange);

    var coordinates = {lat: 40.7127, lng: -74.0059};

    map = new google.maps.Map(document.getElementById('main-map'), {
      center: coordinates,
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
      disableDefaultUI: true,
      zoom: 12

    });

  var query = {
    boro: this.state.boro,
    cuisine_type: this.state.cuisine_type,
    zipcode: this.state.zipcode,
    name: this.state.name
  }

  google.maps.event.addListener(map, 'tilesloaded', function () {
    var options = {bounds: map.getBounds().toJSON(), query: query};
    ApiUtil.fetchMainMap(options);
  }.bind(this));

  google.maps.event.addListener(map, 'idle', function() {
      var options = {bounds: map.getBounds().toJSON(), query: {
        boro: this.state.boro,
        zipcode: this.state.zipcode,
        name: this.state.name,
        cuisine_type: this.state.cuisine_type
      } };
      ApiUtil.fetchMainMap(options);
      setTimeout(function() {
        this._onMapChange();
      }.bind(this), 500);
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
        this.history.pushState(null, "rest/" + newMarker.id, {});
      }.bind(this));


    newMarkers.push(newMarker);
  }.bind(this));

  this.state.markers.forEach(function(marker) {
    marker.setMap(null)
  }.bind(this));
  this.setState({ markers: newMarkers});

  },
  changeName: function (e) {
    this.setState({ name: e.currentTarget.value});
      this.mapUpdate();
  },
  changeCuisine: function (e) {
    this.setState({ cuisine_type: e.currentTarget.value});
      this.mapUpdate();
  },
  changeZipcode: function (e) {

    this.setState({ zipcode: e.currentTarget.value});

    this.mapUpdate();
  },
  changeBoro: function (e) {
    this.setState({ boro: e.currentTarget.value});
      this.mapUpdate();
  },
  mapUpdate: function () {

    clearInterval(this.timeout);
    this.timeout = setInterval(function () {

      var options = { bounds: map.getBounds().toJSON(), query: {
        boro: this.state.boro,
        zipcode: this.state.zipcode,
        name: this.state.name,
        cuisine_type: this.state.cuisine_type
      } };
      ApiUtil.fetchMainMap(options);
      setTimeout(function () {
        this._onMapChange();
      }.bind(this), 500);
      clearInterval(this.timeout);
    }.bind(this), 1000);
  },
  changeSettings: function (e) {

    this.setState({ markerSetting: e.currentTarget.id });
  },
  _onStoreChange: function () {
    // this.setState({map: StoreStore.getMap()});

  },
    render: function () {
      // <div id="street-view"></div>
      // <i className="fa fa-reply"></i>
      // <input type="checkbox" name="cuisine" value="American"/>American<br/>

      return (
        <div className="main-page-holder">
          <div className="options">

          <input type="text" placeholder="Name" onChange={this.changeName} value={this.state.name}/>
          <input type="text" placeholder="Cuisine" onChange={this.changeCuisine} value={this.state.cuisine_type} />
          <input type="text" placeholder="Zipcode" onChange={this.changeZipcode} value={this.state.zipcode} />
          <input type="text" placeholder="Boro" onChange={this.changeBoro} value={this.state.boro}/>
        </div>
      <div id="main-map">
      </div>
      </div>

    );
  }

});

module.exports = Map;
