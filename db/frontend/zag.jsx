var Router = require('react-router');
var IndexRoute = require('react-router').IndexRoute;
var Route = require('react-router').Route;
var React = require('react');


var App = React.createClass({
  render: function () {
    return (
      <div>
        <section>Hi</section>
      </div>
    );
  }

});

// <IndexRoute component={StoreIndex}
var route = (
  <Router>
    <Route path="/" component={App}/>
  </Router>;
)


document.addEventListener("DOMContentLoaded", function () {
  ReactDOM.render(
    <Router>{routes}</Router>, document.getElementById('root')
  );
});
