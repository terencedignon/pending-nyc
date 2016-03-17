var React = require('react');
var Map = require('./map.jsx');
var Comparison = require('./comparison.jsx');

var Overview = React.createClass({

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

  propsRankings: function () {
    var store = this.props.store;
    var calc = store.calc;
    var boro = store.boro_ranking;
    var zipcode = store.zipcode_ranking;
    var cuisine = store.cuisine_ranking;

      var data = {
      boroRecent: this.percentRank(store.calc.last, boro, "recent"),
      boroMice: this.percentRank(calc.mice_percentage, boro, "mice"),
      boroRoaches: this.percentRank(calc.roach_percentage, boro, "roaches"),
      boroFlies: this.percentRank(calc.flies_percentage, boro, "flies"),
      boroWorst: this.percentRank(calc.worst, boro, "worst"),
      boroAverage: this.percentRank(calc.average, boro, "average"),
      boroFirstAverage: this.percentRank(calc.first_average, boro, "first_average"),
      boroScore: this.percentRank(calc.score, boro, "score"),

      zipcodeRecent: this.percentRank(store.calc.last, zipcode, "recent"),
      zipcodeMice: this.percentRank(calc.mice_percentage, zipcode, "mice"),
      zipcodeRoaches: this.percentRank(calc.roach_percentage, zipcode, "roaches"),
      zipcodeFlies: this.percentRank(calc.flies_percentage, zipcode, "flies"),
      zipcodeWorst: this.percentRank(calc.worst, zipcode, "worst"),
      zipcodeAverage: this.percentRank(calc.average, zipcode, "average"),
      zipcodeFirstAverage: this.percentRank(calc.first_average, zipcode, "first_average"),
      zipcodeScore: this.percentRank(calc.score, zipcode, "score"),

      cuisineRecent: this.percentRank(store.calc.last, cuisine, "recent"),
      cuisineMice: this.percentRank(calc.mice_percentage, cuisine, "mice"),
      cuisineRoaches: this.percentRank(calc.roach_percentage, cuisine, "roaches"),
      cuisineFlies: this.percentRank(calc.flies_percentage, cuisine, "flies"),
      cuisineWorst: this.percentRank(calc.worst, cuisine, "worst"),
      cuisineAverage: this.percentRank(calc.average, cuisine, "average"),
      cuisineFirstAverage: this.percentRank(calc.first_average, cuisine, "first_average"),
      cuisineScore: this.percentRank(calc.score, cuisine, "score"),

    }

    return data;
  },

  render: function () {

    var data = this.propsData();
    var store = this.props.store;
    var rankings = this.propsRankings();

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

        <table>

            <tbody>
              <tr>

              <th colSpan="2" className="subject">

              </th>
              <th>{store.zipcode}</th>
              <th>{store.boro}</th>
              <th>{store.cuisine_type}</th>
              </tr>
              <tr className={this.translate(data.last)}>
                <td className="thumbs">
                  <i className={"fa fa-" + this.rankingsParse([
                      rankings.zipcodeRecent, rankings.boroRecent, rankings.cuisineRecent
                    ])}></i>
                </td>
                <td className="subject">
                  Most Recent
                </td>
                <td className="score" className={this.translateRankings(rankings.zipcodeRecent)}>
                  {rankings.zipcodeRecent}
                </td>
                <td className={this.translateRankings(rankings.boroRecent)}>
                  {rankings.boroRecent}
                 </td>
                 <td className={this.translateRankings(rankings.cuisineRecent)}>
                   {rankings.cuisineRecent}
                 </td>
              </tr>
              <tr>
              <td className="thumbs">
                <i className={"fa fa-" + this.rankingsParse([
                    rankings.zipcodeAverage, rankings.boroAverage, rankings.cuisineAverage
                  ])}></i>
              </td>
            <td className="subject">
                Average of {data.inspections}
              </td>
              <td className={this.translateRankings(rankings.zipcodeAverage)}>
                {rankings.zipcodeAverage}
              </td>
              <td className={this.translateRankings(rankings.boroAverage)}>
                {rankings.boroAverage}
              </td>
              <td className={this.translateRankings(rankings.cuisineAverage)}>
                {rankings.cuisineAverage}
              </td>
            </tr>
            <tr>
              <td className="thumbs">
                <i className={"fa fa-" + this.rankingsParse([
                    rankings.zipcodeFirstAverage, rankings.boroFirstAverage, rankings.cuisineFirstAverage
                  ])}></i>
              </td>
              <td className="subject">
                Average  <span onMouseOver={this.showUnannounced} onMouseOut={this.hideUnannounced} className="question-highlight">Surprise
                  <span className="unannounced">The Health Department conducts unannounced inspections of restaurants at least once a year.</span></span>&nbsp; &nbsp;
              </td>
              <td className={this.translateRankings(rankings.zipcodeFirstAverage)}>
                {rankings.zipcodeFirstAverage}
              </td>
              <td className={this.translateRankings(rankings.boroFirstAverage)}>
                {rankings.boroFirstAverage}
              </td>
              <td className={this.translateRankings(rankings.cuisineFirstAverage)}>
                {rankings.cuisineFirstAverage}
              </td>

          </tr>
            <tr>
            <td className="thumbs">
              <i className={"fa fa-" + this.rankingsParse([
                  rankings.zipcodeScore, rankings.boroScore, rankings.cuisineScore
                ])}></i>
            </td>
            <td className="subject">
              Aggreg Score
            </td>
            <td className={this.translateRankings(rankings.zipcodeScore)}>
              {rankings.zipcodeScore}
            </td>
            <td className={this.translateRankings(rankings.boroScore)}>
              {rankings.boroScore}
            </td>
            <td className={this.translateRankings(rankings.cuisineScore)}>
              {rankings.cuisineScore}
            </td>
        </tr>
          <tr>
            <td className="thumbs">
              <i className={"fa fa-" + this.rankingsParse([
                  rankings.zipcodeWorst, rankings.boroWorst, rankings.cuisineWorst
                ])}></i>
            </td>
            <td className="subject">
              Worst
            </td>
            <td className={this.translateRankings(rankings.zipcodeWorst)}>
              {rankings.zipcodeWorst}
            </td>
            <td className={this.translateRankings(rankings.boroWorst)}>
              {rankings.boroWorst}
            </td>
            <td className={this.translateRankings(rankings.cuisineWorst)}>
              {rankings.cuisineWorst}
            </td>
        </tr>
        <tr>
          <td className="thumbs">
            <i className={"fa fa-" + this.rankingsParse([
                rankings.zipcodeMice, rankings.boroMice, rankings.cuisineMice
              ])}></i>
          </td>
          <td className="subject">
              Pcnt. with Mice
          </td>
          <td className={this.translateRankings(rankings.zipcodeMice)}>
            {rankings.zipcodeMice}
          </td>
          <td className={this.translateRankings(rankings.boroMice)}>
            {rankings.boroMice}
          </td>
          <td className={this.translateRankings(rankings.cuisineMice)}>
            {rankings.cuisineMice}
          </td>
      </tr>
      <tr>
        <td className="thumbs">
            <i className={"fa fa-" + this.rankingsParse([
                rankings.zipcodeFlies, rankings.boroFlies, rankings.cuisineFlies
              ])}></i>
        </td>
        <td className="subject">
          Pcnt. with Flies
        </td>
        <td className={this.translateRankings(rankings.zipcodeFlies)}>
          {rankings.zipcodeFlies}
        </td>
        <td className={this.translateRankings(rankings.boroFlies)}>
          {rankings.boroFlies}
        </td>
        <td className={this.translateRankings(rankings.cuisineFlies)}>
          {rankings.cuisineFlies}
        </td>

    </tr>
    <tr>
      <td className="thumbs">

        <i className={"fa fa-" + this.rankingsParse([
            rankings.zipcodeRoaches, rankings.boroRoaches, rankings.cuisineRoaches
          ])}></i>

      </td>
      <td className="subject">
        Pcnt. with Roaches
      </td>
      <td className={this.translateRankings(rankings.zipcodeRoaches)}>
        {rankings.zipcodeRoaches}
      </td>
      <td className={this.translateRankings(rankings.boroRoaches)}>
        {rankings.boroRoaches}
      </td>
      <td className={this.translateRankings(rankings.cuisineRoaches)}>
        {rankings.cuisineRoaches}
      </td>

  </tr>
</tbody>
</table>




    </span>
);
  }

});

module.exports = Overview;
