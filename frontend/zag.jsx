var Router = require('react-router').Router;
var IndexRoute = require('react-router').IndexRoute;
var Route = require('react-router').Route;
var ReactDOM = require('react-dom');
var React = require('react');
var StoreShow = require('./components/store_show.jsx');
var StoreIndex = require('./components/store_index.jsx');
SearchStore = require('./stores/search_store.js');
StoreStore = require('./stores/store_store.js');
var Header = require('./components/header.jsx');
var Sidebar = require('./components/sidebar.jsx');
var Map = require('./components/map.jsx');
MapStore = require('./stores/map_store.js');
var Browse = require('./components/browse.jsx');

// <Sidebar />
var App = React.createClass({
  render: function () {
    return (
      <div>
        <Header />
          <div className="container">
              <div className="main">
                {this.props.children}
              </div>
          </div>
      </div>
    );
  }

});

// <IndexRoute component={StoreIndex}
var route = (
  <Router>
    <Route path="/" component={App}>

    <IndexRoute component={StoreIndex} />
    <Route path="rest/:id" component={StoreShow} />
    <Route path="browse" component={Browse} />
    <Route path="map" component={Map} />
    </Route>
  </Router>
)


document.addEventListener("DOMContentLoaded", function () {
  ReactDOM.render(
    route, document.getElementById('root')
  );
});
