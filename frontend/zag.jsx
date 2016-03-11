var Router = require('react-router').Router;
var IndexRoute = require('react-router').IndexRoute;
var Route = require('react-router').Route;
var History = require('history').createHashHistory();
var ReactDOM = require('react-dom');
var React = require('react');

var StoreShow = require('./components/store_show.jsx');
var StoreIndex = require('./components/store_index.jsx');
var Header = require('./components/header.jsx');
var Map = require('./components/main_map.jsx');
var Footer = require('./components/footer.jsx');
var Most = require('./components/most.jsx');
var About = require('./components/about.jsx');

var App = React.createClass({
  render: function () {
    return (
      <div className="body-container">
        <Header />
        <Sidebar />
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

var route = (
  <Router history={History}>
    <Route path="/" component={App}>

    <IndexRoute component={StoreIndex} />
    <Route path="rest/:id" component={StoreShow} />
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
