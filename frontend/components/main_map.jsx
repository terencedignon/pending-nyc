var React = require('react');
var StoreStore = require('../stores/store_store.js');
var ApiUtil = require('../util/api_util.js');
var MapStore = require('../stores/map_store.js');
var History = require('react-router').History;

var Map = React.createClass({

  mixins: [History],

  getInitialState: function () {
    return { markers: [], markerSetting: "average", newMarkers: [], zipcode: "", boro: "", cuisine_type: "", name: ""};
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

  this.setState({ markers: [] });
  var newMarkers = [];

  MapStore.getMainMap().forEach(function(marker) {
    var grade;
    var hex;
    var text = "FFF";
    var shadow = "_withshadow";

  if (marker.camis === this.props.camis) {
      grade = marker.calc[this.state.markerSetting];
      hex = "FFF";
      shadow = "";
      text = "FFF";
  }
  else if (marker.calc[this.state.markerSetting] <= 13) {
      grade = marker.calc[this.state.markerSetting];
      hex = "0056ac";
    } else if (marker.calc[this.state.markerSetting] <= 27) {
      grade = marker.calc[this.state.markerSetting];
      hex = "49ac42";
    } else {
      grade = marker.calc[this.state.markerSetting];
      hex="fa9828";
    }


    var coordinates = {lat: Number(marker.lat), lng: Number(marker.lng) };
    var newMarker = new google.maps.Marker({
      position: coordinates,
      map: map,
      icon: "https://chart.googleapis.com/chart?chst=d_map_pin_letter" + shadow + "&chld=" +
        grade + "|" + hex + "|" + text,
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
