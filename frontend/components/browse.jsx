var React = require('react');
var ApiUtil = require('../util/api_util.js');
var StoreStore = require('../stores/store_store.js');


var Browse = React.createClass({
  getInitialState: function () {
    return { filters: StoreStore.getFilters(), filter: "", browse: [] };
  },
  componentDidMount: function () {
    this.storeListener = StoreStore.addListener(this._onStoreChange);
    ApiUtil.fetchFilters();
  },
  componentWillUnmount: function () {
    this.storeListener.remove();
  },
  isSelected: function (el) {
    if (el === this.state.filter) return "selected";
    return "";
  },
  fetchBrowse: function (e) {
    var query = {};
    query = [this.state.filter, e.currentTarget.id];

    ApiUtil.fetchBrowse(query);
  },
  headerHandler: function (e) {
    this.setState({ filter: e.currentTarget.id });
  },
  _onStoreChange: function () {
    this.setState({ filters: StoreStore.getFilters(), browse: StoreStore.getBrowse() });
  },
  render: function () {
    var detailBrowse = <div></div>;
    var detailResults = <div></div>;
    if (this.state.filter !== "") {
      detailBrowse = this.state.filters[this.state.filter].map(function(filter) {
        return <div onClick={this.fetchBrowse} id={filter} className="browse-second-level" key={Math.random()}>{filter}</div>;
      }.bind(this));
    }
    if (this.state.browse.length !== 0) {

      detailResults = this.state.browse.map(function(store) {
        
        return <div className="browse-list-item" key={Math.random()}><span className="badge"></span>{store.name}</div>;
      });
      detailResults = <div className="list-holder"> {detailResults} </div>;

    }


    // <span className="browse-intro">Browse By:</span><br/>

    return (
      <div>
        <div>
        <span onClick={this.headerHandler} id="boro" className={"browse-header " + this.isSelected("boro")}>Borough</span>
        <span onClick={this.headerHandler} id="zipcode" className={"browse-header " + this.isSelected("zipcode")}>Zipcode</span>
        <span onClick={this.headerHandler} id="cuisine_type" className={"browse-header " + this.isSelected("cuisine_type")}>Cuisine</span>

    </div>
      <div className="browse-second">
        <div className="detail-browse">
        {detailBrowse}
      </div>
      <div className="detail-holder">
        {detailResults}
      </div>
      </div>

    </div>


    );
  }


});

module.exports = Browse;
