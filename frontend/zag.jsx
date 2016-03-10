var Router = require('react-router').Router;
var IndexRoute = require('react-router').IndexRoute;
var Route = require('react-router').Route;
var history = require('history').createHashHistory();
BrowserHistory = require('history');
var ReactDOM = require('react-dom');
var React = require('react');
var StoreShow = require('./components/store_show.jsx');
var StoreIndex = require('./components/store_index.jsx');
var SearchStore = require('./stores/search_store.js');
var StoreStore = require('./stores/store_store.js');
var Header = require('./components/header.jsx');
var Sidebar = require('./components/sidebar.jsx');
var Map = require('./components/main_map.jsx');
var MapStore = require('./stores/map_store.js');
var Browse = require('./components/browse.jsx');
var Footer = require('./components/footer.jsx');
var Most = require('./components/most.jsx');
var About = require('./components/about.jsx');

// <Sidebar />
var App = React.createClass({
  render: function () {
    return (
      <div className="body-container">
        <Header />
          <div className="container">
              <div className="main">
                {this.props.children}
              </div>
          </div>
          <Footer />
      </div>
    );
  }

});

// <IndexRoute component={StoreIndex}
var route = (
  <Router history={history}>
    <Route path="/" component={App}>

    <IndexRoute component={StoreIndex} />
    <Route path="rest/:id" component={StoreShow} />
    <Route path="browse" component={Browse} />
    <Route path="about" component={About} />
    <Route path="top" component={Most} />
    <Route path="map" component={Map} />
    </Route>
  </Router>
)


document.addEventListener("DOMContentLoaded", function () {
  ReactDOM.render(
    route, document.getElementById('root')
  );
});
