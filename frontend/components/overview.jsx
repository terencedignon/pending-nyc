var React = require('react');
var Map = require('./map.jsx');
var Comparison = require('./comparison.jsx');

var Overview = React.createClass({
  formatName: function (string) {
    return string.trim().toLowerCase().split(" +").map(function(word) {
      return word[0].toUpperCase() + word.slice(1);
    }.bind(this)).join(" ");
  },
  percentageCalc: function (num, div) {
    return (num > 0 ? Math.round((num / div) * 100) + "%" : "0")
  },
  translate: function (number) {
    if (number <= 13) return "A";
    if (number <= 27) return "B";
    return "C";
  },
  propsData: function () {
    var calc = this.props.store.calc;

    var data = {};
    data.average = calc.average;
    data.worst = calc.worst;
    data.inspections = calc.inspections;
    data.best = calc.best;
    data.last = calc.last;
    data.first_average = calc.first_average;
    data.name = this.formatName(this.props.store.name);
    data.bestDate = new Date(calc.best_date);
    data.worstDate = new Date(calc.worst_date);
    data.flies = calc.flies_percentage;
    data.mice = calc.mice_percentage;
    data.roaches = calc.roach_percentage;
    // data.flies = this.percentageCalc(calc.flies, calc.inspections);
    // data.mice = this.percentageCalc(calc.mice, calc.inspections);
    // data.roaches = this.percentageCalc(calc.roaches, calc.inspections);


    data.total = Math.round((data.last + data.average + data.worst + data.best + ((calc.flies / calc.inspections) * 100) + ((calc.mice / calc.inspections) * 100) + ((calc.roaches / calc.inspections) * 100) + data.first_average) / 8);

    return data;
  },

  showUnannounced: function (e) {
    $(e.currentTarget).find('.unannounced').css("display", "block");
  },
  hideUnannounced: function (e) {
    $(e.currentTarget).find('.unannounced').css("display", "none");
  },

  iconParse: function (grade) {
    if (grade instanceof Array) {
      for (var i = 0; i < grade.length; i++) {
        var num = grade[i];

        if (num >= 25) {

          return "thumbs-o-down";
      }
    }
    return "thumbs-o-up";
  }
      if (grade <= 13) {
        return "thumbs-o-up";
      } else if (grade <= 27) {
        return "minus";
      } else {
        return "thumbs-o-down";
      }
  },

  translateRankings: function (n) {
    if (n >= 75) {
      return "A";
    } else if (n > 25) {
      return "B";
    } else {
      return "C";
    }
  },
  propsRankings: function () {
    var store = this.props.store;
    var calc = store.calc;
    var boro = store.boro_ranking;
    var zip = store.zipcode_ranking;
    var cuisine = store.cuisine_ranking;



    var data = {
      boroRecent:  Math.round(100 - (boro.recent.indexOf(store.calc.last) / boro.recent.length).toFixed(2) * 100),
      boroMice: Math.round(100 - (boro.mice.indexOf(calc.mice_percentage) / boro.mice.length).toFixed(2) * 100),
      boroRoaches: Math.round(100 - (boro.roaches.indexOf(calc.roach_percentage) / boro.roaches.length).toFixed(2) * 100),
      boroFlies: Math.round(100 - (boro.flies.indexOf(calc.flies_percentage) / boro.flies.length).toFixed(2) * 100),
      boroWorst: Math.round(100 - (boro.worst.indexOf(calc.worst) / boro.worst.length).toFixed(2) * 100),
      boroAverage: Math.round(100 - (boro.average.indexOf(calc.average) / boro.average.length).toFixed(2) * 100),
      boroFirstAverage: Math.round(100 - (boro.first_average.indexOf(calc.first_average) / boro.first_average.length).toFixed(2) * 100),
      boroScore: Math.round(100 - (boro.score.indexOf(calc.score) / boro.score.length).toFixed(2) * 100),

      zipcodeRecent:  Math.round(100 - (zip.recent.indexOf(store.calc.last) / zip.recent.length).toFixed(2) * 100),
      zipcodeMice: Math.round(100 - (zip.mice.indexOf(store.calc.mice_percentage) / zip.mice.length).toFixed(2) * 100),
      zipcodeRoaches: Math.round(100 - (zip.roaches.indexOf(store.calc.roach_percentage) / zip.roaches.length).toFixed(2) * 100),
      zipcodeFlies: Math.round(100 - (zip.flies.indexOf(store.calc.flies_percentage) / zip.flies.length).toFixed(2) * 100),
      zipcodeWorst: Math.round(100 - (zip.worst.indexOf(store.calc.worst) / zip.worst.length).toFixed(2) * 100),
      zipcodeAverage: Math.round(100 - (zip.average.indexOf(store.calc.average) / zip.average.length).toFixed(2) * 100),
      zipcodeFirstAverage: Math.round(100 - (zip.first_average.indexOf(store.calc.first_average) / zip.first_average.length).toFixed(2) * 100),
      zipcodeScore: Math.round(100 - (zip.score.indexOf(calc.score) / zip.score.length).toFixed(2) * 100),

      cuisineRecent:  Math.round(100 - (cuisine.recent.indexOf(store.calc.last) / cuisine.recent.length).toFixed(2) * 100),
      cuisineMice: Math.round(100 - (cuisine.mice.indexOf(store.calc.mice_percentage) / cuisine.mice.length).toFixed(2) * 100),
      cuisineRoaches: Math.round(100 - (cuisine.roaches.indexOf(store.calc.roach_percentage) / cuisine.roaches.length).toFixed(2) * 100),
      cuisineFlies: Math.round(100 - (cuisine.flies.indexOf(store.calc.flies_percentage) / cuisine.flies.length).toFixed(2) * 100),
      cuisineWorst: Math.round(100 - (cuisine.worst.indexOf(store.calc.worst) / cuisine.worst.length).toFixed(2) * 100),
      cuisineAverage: Math.round(100 - (cuisine.average.indexOf(store.calc.average) / cuisine.average.length).toFixed(2) * 100),
      cuisineFirstAverage: Math.round(100 - (cuisine.first_average.indexOf(store.calc.first_average) / cuisine.first_average.length).toFixed(2) * 100),
      cuisineScore: Math.round(100 - (cuisine.score.indexOf(calc.score) / cuisine.score.length).toFixed(2) * 100)
    }

    return data;
  },

  render: function () {

    var data = this.propsData();
    var store = this.props.store;
    var rankings = this.propsRankings();

  //   <span className="store-name"><strong className="overview-emphasis">Analyze</strong></span><br/>
  //   BY <a href="#" onClick={this.analyzeBy}>{this.props.store.cuisine_type.trim() + " Cuisine"}</a>  <a href="#">{this.props.store.zipcode}</a>  <a href="#">{this.props.store.boro[0] + this.props.store.boro.slice(1).toLowerCase()}</a><br/>
  // <div className="comparison">
  //   <Comparison store={this.props.store}/>
  // </div>

          //     <div className="legend"><span className="a">A:</span> <span className="range">0-13</span>&nbsp;
          //     <span className="b">B:</span> <span className="range">14-27</span>&nbsp;
          //       <span className="c">C:</span> <span className="range">28 and up</span></div>
          // <span className="unannounced">An average of best, worst, average, surprise average, and percentage of infestations </span></span></span><p/>
          //
          // <a href="#" onClick={this.findOtherLikeThis}>Find other restaurants like this in your area</a>
    return (
      <span className="overview-holder">
        <span className="store-name">{this.props.store.name} Overview: <span className="question-highlight">{this.props.store.calc.score}</span></span><p/>

        <span className="overview-address">
              <i className="fa fa-building fa-border"></i>{store.building} {store.street} {store.boro}, NY {store.zipcode}<br/>
              <i className="fa fa-phone fa-border"></i>{store.phone} <br/>
              <i className="fa fa-cutlery fa-border"></i> {store.cuisine_type}<br/>
        </span>
        <hr/>
        <table>

          <tbody>
            <tr className={this.translate(data.last)}>
              <td className="thumbs">

              </td>
              <td className="subject">
                Most Recent Inspection
              </td>
              <td className="score">
                {data.last}
              </td>
              <td className={"grade " + this.translate(data.last)}>
                 {this.translate(data.last)}
               </td>
            </tr>
            <tr className={this.translate(data.average)}>
            <td className="thumbs">

            </td>
          <td className="subject">
              Average of {data.inspections} Inspections
            </td>
            <td className="score">
              {data.average}
            </td>
            <td className={"grade " + this.translate(data.average)}>
              {this.translate(data.average)}
            </td>
          </tr>
          <tr className={this.translate(data.first_average)}>
            <td className="thumbs">

            </td>
            <td className="subject">
              Average  <span onMouseOver={this.showUnannounced} onMouseOut={this.hideUnannounced} className="question-highlight">Unannounced
                <span className="unannounced">The Health Department conducts unannounced inspections of restaurants at least once a year.</span></span> &nbsp;
            </td>
            <td className="score">
              {data.first_average}
            </td>
            <td className={"grade " + this.translate(data.first_average)}>
               {this.translate(data.first_average)}
             </td>
        </tr>
          <tr className={this.translate(data.best)}>
          <td className="thumbs">

          </td>
          <td className="subject">
            Best Score
          </td>
          <td className="score">
            {data.best}
          </td>
          <td className={"grade " + this.translate(data.best)}>
            {this.translate(data.best)}
          </td>
      </tr>
        <tr className={this.translate(data.worst)}>
          <td className="thumbs">

          </td>
          <td className="subject">
            Worst Score
          </td>
          <td className="score">
            {data.worst}
          </td>
          <td className={"grade " + this.translate(data.worst)}>
            {this.translate(data.worst)}
          </td>
      </tr>
      <tr className={this.translate(data.mice)}>
        <td className="thumbs">

        </td>
        <td className="subject">
            Probability of Mice
        </td>
        <td className="score">
          {data.mice}
        </td>
        <td className={"grade " + this.translate(data.mice)}>
            {this.translate(data.mice)}
        </td>
    </tr>
    <tr className={this.translate(data.flies)}>
      <td className="thumbs">

      </td>
      <td className="subject">
        Probability of Flies
      </td>
      <td className="score">
        {data.flies}
      </td>
      <td className={"grade " + this.translate(data.flies)}>
          {this.translate(data.flies)}
      </td>
  </tr>
  <tr className={this.translate(data.roaches)}>
    <td>

    </td>
    <td className="subject">
      Probability of Roaches
    </td>
    <td className="score">
      {data.roaches}
    </td>
    <td className={"grade " + this.translate(data.roaches)}>
        {this.translate(data.roaches)}
    </td>
</tr>

          </tbody>
        </table>
        <hr/>

      <span className="store-name">Percent of restaurants that {store.name} is greater than or equal to</span>

          <table>

            <tbody>
              <tr>
              <th className="subject" colSpan="2">

              </th>
              <th>{store.zipcode}</th>
              <th>{store.boro}</th>
              <th>{store.cuisine_type}</th>
              </tr>
              <tr className={this.translate(data.last)}>
                <td className="thumbs">

                </td>
                <td className="subject">
                  Most Recent Inspection
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
              </td>
            <td className="subject">
                Average of {data.inspections} Inspections
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

              </td>
              <td className="subject">
                Average  <span onMouseOver={this.showUnannounced} onMouseOut={this.hideUnannounced} className="question-highlight">Unannounced
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

            </td>
            <td className="subject">
              Worst Score
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

          </td>
          <td className="subject">
              Probability of Mice
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

        </td>
        <td className="subject">
          Probability of Flies
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
      <td>

      </td>
      <td className="subject">
        Probability of Roaches
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
