var React = require('react');
var StoreStore = require('../stores/store_store.js');
var ApiUtil = require('../util/api_util.js');
var MapStore = require('../stores/map_store.js');
var History = require('react-router').History;

var Map = React.createClass({

  mixins: [History],

  getInitialState: function () {
    return { searching: false, markers: [], markerSetting: "average", newMarkers: [], zipcode: "", boro: "", cuisine_type: "", name: ""};
  },

  componentDidMount: function () {

    this.setState({ markers: MapStore.getMainMap() });

    this.storeListener = StoreStore.addListener(this._onStoreChange);
    this.mapListener = MapStore.addListener(this._onMapChange);

    var coordinates = {lat: 40.7127, lng: -74.0059};

    mainMap = new google.maps.Map(document.getElementById('main-map'), {
      center: coordinates,
      disableDefaultUI: true,
      zoom: 12

    });

    setTimeout(function() {
      var options = {bounds: mainMap.getBounds().toJSON(), query: {
          boro: this.state.boro,
          zipcode: this.state.zipcode,
          name: this.state.name,
          cuisine_type: this.state.cuisine_type
        }
    };

    ApiUtil.fetchMainMap(options);

    setTimeout(function() {
        this._onMapChange();
      }.bind(this), 10000);
    }.bind(this), 2000);

    google.maps.event.addListener(mainMap, 'idle', function() {
      var options = {bounds: mainMap.getBounds().toJSON(), query: {
        boro: this.state.boro,
        zipcode: this.state.zipcode,
        name: this.state.name,
        cuisine_type: this.state.cuisine_type
      }
    };
    ApiUtil.fetchMainMap(options);
    setTimeout(function() {
      this._onMapChange();
      }.bind(this), 500);
    }.bind(this));

},

componentWillUnmount: function () {
  this.storeListener.remove();
  this.mapListener.remove();
},

_onMapChange: function () {

  var newMarkers = [];

  MapStore.getMainMap().forEach(function(marker) {
    var icon;

    if (marker.calc.average <= 13) { icon = "http://i.imgur.com/E2oZQ4V.png"; } else
    if (marker.calc.score <= 27) { icon = "http://i.imgur.com/h0qBo2q.png"; }
    else { icon = "http://i.imgur.com/ejjOVXB.png"; }

    var coordinates = {
      lat: Number(marker.lat),
      lng: Number(marker.lng)
    };

    var newMarker = new google.maps.Marker({
      position: coordinates,
      map: mainMap,
      icon: icon,
      title: marker.name,
      id: marker.id
    });

    google.maps.event.addListener(newMarker, 'click', function() {
      this.history.pushState(null, "rest/" + newMarker.id, {});
    }.bind(this));


    newMarkers.push(newMarker);
    this.setState({ searching: false })
  }.bind(this));

  this.state.markers.forEach(function(marker) {
    marker.setMap(null)
  }.bind(this));

  $('.main-map-wrapper > i').css("display", "none");
  $('#main-map').css("opacity", "1");

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
      $('.main-map-wrapper > i').css("display", "block");
        $('#main-map').css("opacity", "0.8");
      var options = { bounds: mainMap.getBounds().toJSON(), query: {
        boro: this.state.boro,
        zipcode: this.state.zipcode,
        name: this.state.name,
        cuisine_type: this.state.cuisine_type
      } };
      ApiUtil.fetchMainMap(options);
      setTimeout(function () {
        this._onMapChange();
      }.bind(this), 1000);
      clearInterval(this.timeout);
    }.bind(this), 1000);
  },

  changeSettings: function (e) {
    this.setState({ markerSetting: e.currentTarget.id });
  },

  _onStoreChange: function () {
  },

  setRestaurants: function () {
    return MapStore.getMainMap().map(function(store) {
      return (
        <div className="main-map-store">
          <div>
            {store.name}<br/>
            {store.zipcode} {store.boro}
          </div>
          <div>
            AVG: {store.calc.average}<br/>
            FIRST AVG: {store.calc.first_average}
          </div>
        </div>
      );
    });
  },

  render: function () {
    var restaurants = this.setRestaurants();

    return (
      <div className="main-page-holder">
        <div className="options">
          <input type="text" placeholder="Name" onChange={this.changeName} value={this.state.name}/>
          <input type="text" placeholder="Cuisine" onChange={this.changeCuisine} value={this.state.cuisine_type} />
          <input type="text" placeholder="Zipcode" onChange={this.changeZipcode} value={this.state.zipcode} />
          <input type="text" placeholder="Boro" onChange={this.changeBoro} value={this.state.boro}/>
        </div>
        <div className="main-map-wrapper">
          <i className="fa fa-circle-o-notch fa-pulse most-spin"></i>
          <div id="main-map">
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Map;
