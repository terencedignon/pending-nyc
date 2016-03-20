var React = require('react');
var Map = require('./map.jsx');
var Comparison = require('./comparison.jsx');
var PieChart = require('react-chartjs').Pie;
var StoreActions = require('../actions/store_actions.js');


var Overview = React.createClass({

  getInitialState: function () {
    return {  };

  },

  translate: function (number) {
    if (number <= 13) { return "A"; } else
    if (number <= 27) { return "B"; }
    else { return "C"; }
  },

  propsData: function () {
    var calc = this.props.store.calc;

    var data = {
      average: calc.average,
      worst: calc.worst,
      inspections: calc.inspections,
      best: calc.best,
      last: calc.last,
      first_average: calc.first_average,
      name: this.props.store.name,
      bestDate: new Date(calc.best_date),
      worstDate: new Date(calc.worst_date),
      flies: calc.flies_percentage,
      mice: calc.mice_percentage,
      roaches: calc.roach_percentage,
      total: calc.score
    };

    return data;
  },

  showUnannounced: function (e) {
    $(e.currentTarget).find('.unannounced').css("display", "block");
  },

  hideUnannounced: function (e) {
    $(e.currentTarget).find('.unannounced').css("display", "none");
  },

  formatPhone: function(n) {

    if (!n) return "";
    return [
      n.slice(0, 3),
      n.slice(3, 6),
      n.slice(6)
    ].join("-")
  },

  iconParse: function (grade) {

      if (grade <= 13) { return "thumbs-o-up"; } else
      if (grade <= 27) { return "minus"; }
      else { return "thumbs-o-down"; }

  },

  rankingsParse: function (array) {

    var avg = 0;
    array.forEach(function(n) {
      avg += n;
    });

    avg = avg / array.length;

    if (avg >= 50) { return "thumbs-o-up"; }
    else { return "thumbs-o-down"; }
  },

  translateRankings: function (n) {

    if (n >= 75) { return "A"; } else
    if (n > 25) { return "B"; }
    else { return "C"; }

  },

  percentRank: function (store, group, category) {
    return Math.round(100 - (group[category].indexOf(store) / group[category].length).toFixed(2) * 100)
  },

  numberRank: function (store, group, category, zone, phrase) {
    var betterNum = group[category].length - group[category].indexOf(store);
    var worseNum = group[category].length - betterNum;
    // console.log("Of " + group[category].length + " restaurants in " + zone + ", " + this.props.store.name +
    //   "is better than " + betterNum + " and worse than " + worseNum);
    return "Of " + group[category].length + " restaurants in " + zone + ", " +
      this.props.store.name + "'s' " + phrase + " is better than " + betterNum + " and worse than " + worseNum;
    },

  tdMouseover: function (e) {
    if ($('.toggle-button').html() === "Hide Details") {
      var reference = this.refs[e.currentTarget.children[0].children[1].children[0].id];
      var description = e.currentTarget.parentElement.className.split(" ")[0];


      $(e.currentTarget).find('.table-legend').html("<span class='legend-header'>" + description + "</span>");
      $(e.currentTarget).find('.table-legend').append(reference.generateLegend());

      $(e.currentTarget).find('.table-details').show(50);
    }
  },

  tdMouseleave: function (e) {
    if ($('.toggle-button').html() === "Hide Details") {
      $(e.currentTarget).find('.table-details').hide(50);
    }
  },

  hoverPie: function (store, group, category, ref) {

    var betterNum = group[category].length - group[category].indexOf(store);
    var equalNum = group[category].filter(function(score) {
      return score === store;
    }).length;
    var worseNum = group[category].length - betterNum;
    var data = [
      {
        value: worseNum,
        color: "rgba(128, 0, 0, 0.7)",
        highlight: "maroon",
        label: "Worse: " + worseNum,
        labelColor: "#444444",
        labelFontSize: "16"
      },
      {
          value: betterNum - equalNum,
          color: "rgba(128, 0, 0, 0.1)",
          highlight: "steelblue",
          label: "Better: &nbsp;" + (betterNum - equalNum),
          labelColor: "#444444",
          labelFontSize: "16"
      },
      {
          value: equalNum,
          color: "rgba(128, 0, 0, 0.4)",
          highlight: "#eeeeee",
          label: "Equal: &nbsp;" + equalNum + "&nbsp; &nbsp;",
          labelColor: "#444444",
          labelFontSize: "16"
      }

    ];


    // console.log([worseNum, equalNum, betterNum]);
    // setTimeout(function() {
    //   StoreActions.getChart(<PieChart data={data}/>);
    // }, 1000);
    // segmentStrokeColor: "rgba(128, 0, 0, 0.7)"
    // tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>kb"
    var options = {
      segmentShowStroke: false,
      segmentStrokeWidth: 2,
      segmentStrokeColor: "white",
animateRotate: true,
animateScale: true,
percentageInnerCutout: 0,
tooltipTemplate: "<%= value %>"
    }



    return <PieChart className="pie-chart" key={ref} ref={ref} id={ref} data={data} width={100} height={75} options={options} />

},

  setLegend: function (ref) {
    setTimeout(function () {
    if (typeof this.refs[ref] !== "undefined") return this.refs[ref].generateLegend();
    return "";
  }.bind(this), 200)
  },


  propsRankings: function () {

    var store = this.props.store;
    var calc = store.calc;
    var boro = store.boro_ranking;
    var zipcode = store.zipcode_ranking;
    var cuisine = store.cuisine_ranking;

    // boroRecentHover: this.numberRank(store.calc.last, boro, "recent", store.boro, "last inspection"),
    var data = {

      boroRecent: this.percentRank(store.calc.last, boro, "recent"),
      boroRecentHover: this.hoverPie(store.calc.last, boro, "recent", Math.random()),

      boroMice: this.percentRank(calc.mice_percentage, boro, "mice"),
      boroMiceHover: this.hoverPie(calc.mice_percentage, boro, "mice", Math.random()),

      boroRoaches: this.percentRank(calc.roach_percentage, boro, "roaches"),
      boroRoachesHover: this.hoverPie(calc.roach_percentage, boro, "roaches", Math.random()),

      boroFlies: this.percentRank(calc.flies_percentage, boro, "flies"),
      boroFliesHover: this.hoverPie(calc.flies_percentage, boro, "flies", Math.random()),

      boroWorst: this.percentRank(calc.worst, boro, "worst"),
      boroWorstHover: this.hoverPie(calc.worst, boro, "worst", Math.random()),

      boroAverage: this.percentRank(calc.average, boro, "average"),
      boroAverageHover: this.hoverPie(calc.average, boro, "average", Math.random()),

      boroFirstAverage: this.percentRank(calc.first_average, boro, "first_average"),
      boroFirstAverageHover: this.hoverPie(calc.first_average, boro, "first_average", Math.random()),

      boroScore: this.percentRank(calc.score, boro, "score"),
      boroScoreHover: this.hoverPie(calc.score, boro, "score", Math.random()),

      zipcodeRecent: this.percentRank(store.calc.last, zipcode, "recent"),
      zipcodeRecentHover: this.hoverPie(store.calc.last, zipcode, "recent", Math.random()),

      zipcodeMice: this.percentRank(calc.mice_percentage, zipcode, "mice"),
      zipcodeMiceHover: this.hoverPie(calc.mice_percentage, zipcode, "mice", Math.random()),

      zipcodeRoaches: this.percentRank(calc.roach_percentage, zipcode, "roaches"),
      zipcodeRoachesHover: this.hoverPie(calc.roach_percentage, zipcode, "roaches", Math.random()),


      zipcodeFlies: this.percentRank(calc.flies_percentage, zipcode, "flies"),
      zipcodeFliesHover: this.hoverPie(calc.flies_percentage, zipcode, "flies", Math.random()),

      zipcodeWorst: this.percentRank(calc.worst, zipcode, "worst"),
      zipcodeWorstHover: this.hoverPie(calc.worst, zipcode, "worst", Math.random()),


      zipcodeAverage: this.percentRank(calc.average, zipcode, "average"),
      zipcodeAverageHover: this.hoverPie(calc.average, zipcode, "average", Math.random()),

      zipcodeFirstAverage: this.percentRank(calc.first_average, zipcode, "first_average"),
      zipcodeFirstAverageHover: this.hoverPie(calc.first_average, zipcode, "first_average", Math.random()),

      zipcodeScore: this.percentRank(calc.score, zipcode, "score"),
      zipcodeScoreHover: this.hoverPie(calc.score, zipcode, "score", Math.random()),


      cuisineRecent: this.percentRank(store.calc.last, cuisine, "recent"),
      cuisineRecentHover: this.hoverPie(calc.last, cuisine, "recent", Math.random()),


      cuisineMice: this.percentRank(calc.mice_percentage, cuisine, "mice"),
      cuisineMiceHover: this.hoverPie(calc.mice_percentage, cuisine, "mice", Math.random()),

      cuisineRoaches: this.percentRank(calc.roach_percentage, cuisine, "roaches"),
      cuisineRoachesHover: this.hoverPie(calc.roach_percentage, cuisine, "roaches", Math.random()),

      cuisineFlies: this.percentRank(calc.flies_percentage, cuisine, "flies"),
      cuisineFliesHover: this.hoverPie(calc.flies_percentage, cuisine, "flies", Math.random()),


      cuisineWorst: this.percentRank(calc.worst, cuisine, "worst"),
      cuisineWorstHover: this.hoverPie(calc.worst, cuisine, "worst", Math.random()),

      cuisineAverage: this.percentRank(calc.average, cuisine, "average"),
      cuisineAverageHover: this.hoverPie(calc.average, cuisine, "average", Math.random()),

      cuisineFirstAverage: this.percentRank(calc.first_average, cuisine, "first_average"),
      cuisineFirstAverageHover: this.hoverPie(calc.first_average, cuisine, "first_average", Math.random()),

      cuisineScore: this.percentRank(calc.score, cuisine, "score"),
      cuisineScoreHover: this.hoverPie(calc.score, cuisine, "score", Math.random()),


    }

    // console.log(data.cuisineRoachesHover);

    return data;
  },

  detailToggle: function () {
    if ($('.toggle-button').html() === "Hide Details") {
      $('.toggle-button').html("Show Details");
      // this.setState({ detail: false });
    } else {
      $('.toggle-button').html("Hide Details");
      // this.setState({ detail: true });
    }

  },

  render: function () {
    setTimeout(function () {
      $('.table-details').hide();
    });

    var rankings = this.propsRankings();
    var data = this.propsData();
    var store = this.props.store;

    return (
      <span className="overview-holder">
        <span className="store-name-header">{this.props.store.name} </span>

        <span className="overview-address">
            <i className="fa fa-building"></i> {store.building} {store.street} {store.boro}, NY {store.zipcode}<br/>
            <i className="fa fa-phone"></i> {this.formatPhone(store.phone)}<br/>
            <i className="fa fa-cutlery"></i> {store.cuisine_type}<br/>
        </span>

        <span className="store-name">Inspections Overview</span>

      <table>
          <tbody>
            <tr>
              <td className="thumbs">
                <i className={"fa fa-" + this.iconParse(data.last)}></i>
              </td>
              <td className="subject">
                Most Recent
              </td>
              <td className={"grade " + this.translate(data.last)}>
                {data.last}
              </td>
              <td className={"grade " + this.translate(data.last)}>
                 {this.translate(data.last)}
               </td>
            </tr>
            <tr>
              <td className="thumbs">
                  <i className={"fa fa-" + this.iconParse(data.average)}></i>
              </td>
              <td className="subject">
              Average of {data.inspections}
              </td>
              <td className={"grade " + this.translate(data.average)}>
                {data.average}
              </td>
              <td className={"grade " + this.translate(data.average)}>
                {this.translate(data.average)}
              </td>
            </tr>
            <tr>
              <td className="thumbs">
                  <i className={"fa fa-" + this.iconParse(data.first_average)}></i>
              </td>
              <td className="subject">
                Average  <span onMouseOver={this.showUnannounced} onMouseOut={this.hideUnannounced} className="question-highlight">Surprise
                <span className="unannounced">The Health Department conducts unannounced inspections of restaurants at least once a year.</span></span> &nbsp;
              </td>
              <td className={"grade " + this.translate(data.first_average)}>
                {data.first_average}
              </td>
              <td className={"grade " + this.translate(data.first_average)}>
                {this.translate(data.first_average)}
             </td>
           </tr>
           <tr>
             <td className="thumbs">
                 <i className={"fa fa-" + this.iconParse(data.best)}></i>
             </td>
             <td className="subject">
               Best
             </td>
             <td className={"grade " + this.translate(data.best)}>
               {data.best}
             </td>
             <td className={"grade " + this.translate(data.best)}>
               {this.translate(data.best)}
             </td>
           </tr>
           <tr>
             <td className="thumbs">
                 <i className={"fa fa-" + this.iconParse(data.worst)}></i>
             </td>
           <td className="subject">
             Worst
           </td>
           <td className={"grade " + this.translate(data.worst)}>
             {data.worst}
           </td>
           <td className={"grade " + this.translate(data.worst)}>
             {this.translate(data.worst)}
           </td>
         </tr>
         <tr>
           <td className="thumbs">
               <i className={"fa fa-" + this.iconParse(data.mice)}></i>
           </td>
           <td className="subject">
             Pcnt. with Mice
           </td>
           <td className={"grade " + this.translate(data.mice)}>
             {data.mice}
           </td>
           <td className={"grade " + this.translate(data.mice)}>
             {this.translate(data.mice)}
           </td>
         </tr>
        <tr>
          <td className="thumbs">
              <i className={"fa fa-" + this.iconParse(data.flies)}></i>
          </td>
          <td className="subject">
            Pcnt. with Flies
          </td>
          <td className={"grade " + this.translate(data.flies)}>
            {data.flies}
          </td>
          <td className={"grade " + this.translate(data.flies)}>
            {this.translate(data.flies)}
          </td>
        </tr>
        <tr>
          <td className="thumbs">
              <i className={"fa fa-" + this.iconParse(data.roaches)}></i>
          </td>
          <td className="subject">
            Pcnt. with Roaches
          </td>
          <td className={"grade " + this.translate(data.roaches)}>
            {data.roaches}
          </td>
          <td className={"grade " + this.translate(data.roaches)}>
            {this.translate(data.roaches)}
          </td>
        </tr>
      </tbody>
    </table>


    <span className="store-name">Percent of restaurants that {store.name} is greater than or equal to</span>
        <span className="toggle-button" onClick={this.detailToggle}>Show Details</span>
        <table>

            <tbody>
              <tr>

              <th colSpan="2" className="subject">

              </th>
              <th>{store.zipcode}</th>
              <th>{store.boro}</th>
              <th>{store.cuisine_type}</th>
              </tr>
              <tr className={"Recent " + this.translate(data.last)}>
                <td className="thumbs">
                  <i className={"fa fa-" + this.rankingsParse([
                      rankings.zipcodeRecent, rankings.boroRecent, rankings.cuisineRecent
                    ])}></i>
                </td>
                <td className="subject">
                  Most Recent
                </td>
                <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className="score" className={this.translateRankings(rankings.zipcodeRecent)}>
                  <span className="table-info">{rankings.zipcodeRecent}
                    <span className="table-details">
                      {rankings.zipcodeRecentHover}

                      <span className="table-legend">

                      </span>
                    </span>
                  </span>
                </td>
                <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.boroRecent)}>
                  <span className="table-info">{rankings.boroRecent}
                    <span className="table-details">
                      {rankings.boroRecentHover}
                      <span className="table-legend">

                      </span>
                    </span>
                  </span>
                 </td>
                 <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.cuisineRecent)}>
                   <span className="table-info">{rankings.cuisineRecent}
                     <span className="table-details">
                       {rankings.cuisineRecentHover}
                       <span className="table-legend">

                       </span>
                     </span>
                   </span>
                 </td>
              </tr>
              <tr className="Average">
              <td className="thumbs">
                <i className={"fa fa-" + this.rankingsParse([
                    rankings.zipcodeAverage, rankings.boroAverage, rankings.cuisineAverage
                  ])}></i>
              </td>
            <td className="subject">
                Average of {data.inspections}
              </td>
              <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.zipcodeAverage)}>
                <span className="table-info">{rankings.zipcodeAverage}
                  <span className="table-details">
                    {rankings.zipcodeAverageHover}
                    <span className="table-legend">

                    </span>
                  </span>
                </span>

              </td>
              <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.boroAverage)}>
                <span className="table-info">{rankings.boroAverage}
                  <span className="table-details">
                    {rankings.boroAverageHover}
                    <span className="table-legend">

                    </span>
                  </span>
                </span>


              </td>
              <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.cuisineAverage)}>
                <span className="table-info">{rankings.cuisineAverage}
                  <span className="table-details">
                    {rankings.cuisineAverageHover}
                    <span className="table-legend">

                    </span>
                  </span>
                </span>


              </td>
            </tr>
            <tr className="Unannounced">
              <td className="thumbs">
                <i className={"fa fa-" + this.rankingsParse([
                    rankings.zipcodeFirstAverage, rankings.boroFirstAverage, rankings.cuisineFirstAverage
                  ])}></i>
              </td>
              <td className="subject">
                Average  <span onMouseOver={this.showUnannounced} onMouseOut={this.hideUnannounced} className="question-highlight">Surprise
                  <span className="unannounced">The Health Department conducts unannounced inspections of restaurants at least once a year.</span></span>&nbsp; &nbsp;
              </td>
              <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.zipcodeFirstAverage)}>
                <span className="table-info">{rankings.zipcodeFirstAverage}
                  <span className="table-details">
                    {rankings.zipcodeFirstAverageHover}
                    <span className="table-legend">

                    </span>
                  </span>
                </span>

              </td>
              <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.boroFirstAverage)}>
                <span className="table-info">{rankings.boroFirstAverage}
                  <span className="table-details">
                    {rankings.boroFirstAverageHover}
                    <span className="table-legend">

                    </span>
                  </span>
                </span>

              </td>
              <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.cuisineFirstAverage)}>
                <span className="table-info">{rankings.cuisineFirstAverage}
                  <span className="table-details">
                    {rankings.cuisineFirstAverageHover}
                    <span className="table-legend">

                    </span>
                  </span>
                </span>


              </td>

          </tr>
            <tr className="Aggregate">
            <td className="thumbs">
              <i className={"fa fa-" + this.rankingsParse([
                  rankings.zipcodeScore, rankings.boroScore, rankings.cuisineScore
                ])}></i>
            </td>
            <td className="subject">
              Aggreg Score
            </td>
            <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.zipcodeScore)}>
              <span className="table-info">{rankings.zipcodeScore}
                <span className="table-details">
                  {rankings.zipcodeScoreHover}
                  <span className="table-legend">

                  </span>
                </span>
              </span>

            </td>
            <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.boroScore)}>
              <span className="table-info">{rankings.boroScore}
                <span className="table-details">
                  {rankings.boroScoreHover}
                  <span className="table-legend">

                  </span>
                </span>
              </span>

            </td>
            <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.cuisineScore)}>
              <span className="table-info">{rankings.cuisineScore}
                <span className="table-details">
                  {rankings.cuisineScoreHover}
                  <span className="table-legend">

                  </span>
                </span>
              </span>

            </td>
        </tr>
          <tr className="Worst">
            <td className="thumbs">
              <i className={"fa fa-" + this.rankingsParse([
                  rankings.zipcodeWorst, rankings.boroWorst, rankings.cuisineWorst
                ])}></i>
            </td>
            <td className="subject">
              Worst
            </td>
            <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.zipcodeWorst)}>
              <span className="table-info">{rankings.zipcodeWorst}
                <span className="table-details">
                  {rankings.zipcodeWorstHover}
                  <span className="table-legend">

                  </span>
                </span>
              </span>

            </td>
            <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.boroWorst)}>
              <span className="table-info">{rankings.boroWorst}
                <span className="table-details">
                  {rankings.boroWorstHover}
                  <span className="table-legend">

                  </span>
                </span>
              </span>

            </td>

            <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.cuisineWorst)}>
              <span className="table-info">{rankings.cuisineWorst}
                <span className="table-details">
                  {rankings.cuisineWorstHover}
                  <span className="table-legend">

                  </span>
                </span>
              </span>


            </td>
        </tr>

        <tr className="Mice">
          <td className="thumbs">
            <i className={"fa fa-" + this.rankingsParse([
                rankings.zipcodeMice, rankings.boroMice, rankings.cuisineMice
              ])}></i>
          </td>
          <td className="subject">
              Pcnt. with Mice
          </td>
          <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.zipcodeMice)}>
            <span className="table-info">{rankings.zipcodeMice}
              <span className="table-details">
                {rankings.zipcodeMiceHover}
                <span className="table-legend">

                </span>
              </span>
            </span>


          </td>
          <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.boroMice)}>
            <span className="table-info">{rankings.boroMice}
              <span className="table-details">
                {rankings.boroMiceHover}
                <span className="table-legend">

                </span>
              </span>
            </span>
          </td>
          <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.cuisineMice)}>
            <span className="table-info">{rankings.cuisineMice}
              <span className="table-details">
                {rankings.cuisineMiceHover}
                <span className="table-legend">

                </span>
              </span>
            </span>
          </td>
      </tr>
      <tr className="Flies">
        <td className="thumbs">
            <i className={"fa fa-" + this.rankingsParse([
                rankings.zipcodeFlies, rankings.boroFlies, rankings.cuisineFlies
              ])}></i>
        </td>
        <td className="subject">
          Pcnt. with Flies
        </td>
        <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.zipcodeFlies)}>
          <span className="table-info">{rankings.zipcodeFlies}
            <span className="table-details">
              {rankings.zipcodeFliesHover}
              <span className="table-legend">
              </span>
            </span>
          </span>

        </td>
        <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.boroFlies)}>
          <span className="table-info">{rankings.boroFlies}
            <span className="table-details">
              {rankings.boroFliesHover}
              <span className="table-legend">
              </span>
            </span>
          </span>
        </td>
        <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.cuisineFlies)}>
          <span className="table-info">{rankings.cuisineFlies}
            <span className="table-details">
              {rankings.cuisineFliesHover}
              <span className="table-legend">
              </span>
            </span>
          </span>
        </td>

    </tr>
    <tr className="Roaches">
      <td className="thumbs">

        <i className={"fa fa-" + this.rankingsParse([
            rankings.zipcodeRoaches, rankings.boroRoaches, rankings.cuisineRoaches
          ])}></i>

      </td>
      <td className="subject">
        Pcnt. with Roaches
      </td>
      <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.zipcodeRoaches)}>
        <span className="table-info">{rankings.zipcodeRoaches}
          <span className="table-details">
            {rankings.zipcodeRoachesHover}
            <span className="table-legend">
            </span>
          </span>
        </span>

      </td>
      <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.boroRoaches)}>
        <span className="table-info">{rankings.boroRoaches}
          <span className="table-details">{rankings.boroRoachesHover}
            <span className="table-legend">
            </span>
          </span>
        </span>


      </td>
      <td onMouseOver={this.tdMouseover} onMouseLeave={this.tdMouseleave} className={this.translateRankings(rankings.cuisineRoaches)}>
        <span className="table-info">{rankings.cuisineRoaches}
          <span className="table-details">
            {rankings.cuisineRoachesHover}
            <span className="table-legend">
            </span>
          </span>
        </span>

      </td>

  </tr>
</tbody>
</table>




    </span>
);
  }

});

module.exports = Overview;
