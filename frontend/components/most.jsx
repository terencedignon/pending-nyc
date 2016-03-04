var React = require('react');
var ApiUtil = require('../util/api_util.js');
var StoreStore = require('../stores/store_store.js');

var Most = React.createClass({
  getInitialState: function () {
    return { query: "score", most: [], boro: "", autoZip: "", zipcode: "", cuisine_type: ""}
  },
  componentDidMount: function () {
    ApiUtil.fetchMost(this.state);
    this.storeListener = StoreStore.addListener(this._onStoreChange);
  },
  componentWillUnmount: function () {
    this.storeListener.remove();
  },
  formatPhone: function(n) {
    return [
      n.slice(0, 3),
      n.slice(3, 6),
      n.slice(6)
    ].join("-")
  },
  boroInput: function (e) {
    this.setState({ boro: e.currentTarget.value });
    this.updateList();
  },

  cuisineInput: function (e) {
    this.setState({ cuisine_type: e.currentTarget.value });
    this.updateList();
  },
  expand: function(e) {
    $(e.currentTarget.parentElement).find(".wrapper").css("display", "flex");
    $(e.currentTarget.parentElement).find(".fa-minus").css("display", "inline");
    $(e.currentTarget).css("display", "none");
    $(e.currentTarget.parentElement).find(".details").css("display", "block");
  },
  collapse: function(e) {
    $(e.currentTarget.parentElement).find(".wrapper").css("display", "none");
    $(e.currentTarget.parentElement).find(".fa-plus").css("display", "inline");
    $(e.currentTarget).css("display", "none");
    $(e.currentTarget.parentElement).find(".details").css("display", "none");
  },
  zipcodeInput: function (e) {
    // ApiUtil.autoComplete({ value: e.currentTarget.value, query: "zipcode"});
    this.setState({ zipcode: e.currentTarget.value });
    setTimeout(function () {
      this.updateList();
    }.bind(this), 200);
  },

  _onStoreChange: function () {
    this.setState({ most: StoreStore.getMost() });
  },
  updateList: function () {
    ApiUtil.fetchMost(this.state);
  },
  setGrade: function (store) {
        imageObject = {
          A: "http://i.imgur.com/8PkvwVo.jpg",
          B: "http://i.imgur.com/pt3dIsE.jpg",
          C: "http://i.imgur.com/NUoquVG.jpg",
          P: "http://i.imgur.com/fksRyj5.jpg",
          Z: "http://i.imgur.com/fksRyj5.jpg"
        };

          return imageObject[store.calc.grade];
  },
  changeQuery: function (e) {
    e.preventDefault();
    this.setState({ query: e.currentTarget.id, most: []})
    this.updateList($.extend(this.state, {query: e.currentTarget.id}));
    // var input = e.currentTarget.id;
  },
  render: function () {
    var mostList = <div className="most-loading"><i className="fa fa-circle-o-notch fa-spin most-spin"></i></div>  ;
    if (this.state.most.length > 1) {
      mostList = StoreStore.getMost().map(function (store) {

        var image = <img src={this.setGrade(store)}/>;
        // (store.image_url ?  <img src={store.image_url.replace("ms.jpg", "348s.jpg")}/> : <img src="http://i.imgur.com/8PkvwVo.jpg"/>);

        return <li key={Math.random()}><i onClick={this.expand} className="fa fa-plus fa-border"></i>
        <i onClick={this.collapse} className="fa fa-minus fa-border"></i>
      <a href={"#/rest/" + store.id}>{store.name}</a>
          <span className="fa-stack most-stack ">
            <i className="fa fa-square fa-stack-2x"></i>
            <span className="fa-stack-1x most-text">{store.calc[this.state.query]}</span>
            </span>
            <br/>
    <span className="expanded-details-row wrapper">
      <div className="google-image-holder details">
        {image}
      </div>
      <div className="address details">

            <span className="details"><i className="fa fa-building fa-border"></i>{store.building} {store.street} </span>
            <span className="details"><i className="fa fa-building fa-border fa-hide"></i>{store.boro}, NY {store.zipcode}</span>
            <span className="details"><i className="fa fa-phone fa-border"></i>{this.formatPhone(store.phone)} </span>
            <span className="details"><i className="fa fa-cutlery fa-border"></i> {store.cuisine_type} </span>
  </div>


    </span>
         </li>;

        }.bind(this));
    }



    return (
      <div>
        <div className="filter-by">
          <h3>Search by: </h3> <input className="zipcode" onChange={this.zipcodeInput} type="text" placeholder="Zipcode"/> {this.state.autoZip}



        <input id="cuisine_type"  onChange={this.cuisineInput} type="text" placeholder="Cuisine"/>
        <input id="boro" onChange={this.boroInput} type="text" placeholder="Boro"/>
          <p/>
          <hr/>
      </div>
      <div className="most-header">
      <a id="score" onClick={this.changeQuery} href="#">Pending.nyc Aggregate Score</a>
        <a id="average" onClick={this.changeQuery} href="#">Average</a>
          <a id="first_average" onClick={this.changeQuery} href="#">Surprise Inspection Average</a><p/>
            <a id="worst" onClick={this.changeQuery} href="#">Worst</a>
    <a id="mice_percentage" onClick={this.changeQuery} href="#">Mice Percent</a>  <a id="mice" onClick={this.changeQuery} href="#">Mice Number</a><p/>
     <a id="roach_percentage" onClick={this.changeQuery} href="#">Roach Percent</a>  <a id="roaches" onClick={this.changeQuery} href="#">Roach Number</a>
    <a id="flies_percentage" onClick={this.changeQuery} href="#">Flies Percent</a> <a id="flies" onClick={this.changeQuery} href="#">Flies Number</a>
    </div>
    <hr/>
    <ul className="filter-links">
      {mostList}
    </ul>
    </div>
    );
  }
});

module.exports = Most;
