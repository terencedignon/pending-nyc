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
    var mapOptions = {
      center: coordinates,
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      zoom: 12,
      styles: [
    {
        "featureType": "landscape",
        "stylers": [
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
        "featureType": "poi",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 51
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 30
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 40
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": -25
            },
            {
                "saturation": -100
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "steelblue"
            },
            {
                "lightness": 0
            },
            {
                "saturation": 100
            }
        ]
    }
],
    };

    // scroll:{x:$(window).scrollLeft(),y:$(window).scrollTop()}
    map = new google.maps.Map(document.getElementById('map'), mapOptions);


    // var offset=$(map.getDiv()).offset();
    //   map.panBy(((mapOptions.scroll.x-offset.left)/30),((mapOptions.scroll.y-offset.top)/30));
    //   google.maps.event.addDomListener(window, 'scroll', function(){
    //     var scrollY=$(window).scrollTop() * -0.5,
    //       scrollX=$(window).scrollLeft() * 0.5,
    //       scroll=map.get('scroll');
    //         if(scroll){
    //             map.panBy(-((scroll.x-scrollX)/3),-((scroll.y-scrollY)/3));
    //           }
    //           map.set('scroll',{x:scrollX,y:scrollY});
    // }.bind(this));


    this.idleListener = google.maps.event.addListener(map, 'idle', function() {
      clearInterval(this.mapInterval);
      this.mapInterval = setInterval(function () {
      var options = {bounds: map.getBounds().toJSON(), cuisine_type: this.props.cuisine_type}
      ApiUtil.fetchMap(options);

      $('#map').css("opacity", "0.99");
      clearInterval(this.mapInterval)
      }.bind(this), 0);
    }.bind(this));

  },

  componentWillUnmount: function () {

    this.storeListener.remove();
    this.mapListener.remove();
    google.maps.event.removeListener(this.idleListener);
    google.maps.event.removeListener(this.tilesLoaded);

  },

  _onMapChange: function () {

    var newMarkers = [];
    MapStore.all().forEach(function(marker) {
      var icon;
      if (marker.calc.average <= 13) { icon = "http://i.imgur.com/3uNIbP4.png"; } else
      if (marker.calc.score <= 27) { icon = "http://i.imgur.com/UsMdUyz.png"; }
      else { icon = "http://i.imgur.com/QjqYs0V.png"; }

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

    $('.map-holder > i').css("display", "none");
    $('#map').css("opacity", "1");
    setTimeout(function () {
      this.setState({ markers: newMarkers});
    }.bind(this), 1000);
  },

  _onStoreChange: function () {
  },
  render: function () {
    // <div id="street-view"></div>

    return (
      <div className="map-holder">
        <i className="fa fa-circle-o-notch fa-pulse most-spin"></i>
         <span className="map-header">Select marker for comparison</span><p/>
        <div id="map">
        </div>
      </div>
    );
  }
});

module.exports = Map;
