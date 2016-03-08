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
    data.last = this.props.store.inspections[0].score;
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

  render: function () {

    var data = this.propsData();
    var store = this.props.store;

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

                    // <table>
          //   <th >
          //     Recent
          //   </th>
          //   <th>
          //     Avg
          //   </th>
          //   <th>
          //     Surprise Insp.
          //   </th>
          //   <th>
          //     Worst
          //   </th>
          //   <th>
          //     Best
          //   </th>
          //   <th>
          //     Mice
          //   </th>
          //   <th>
          //     Flies
          //   </th>
          //   <th>
          //     Roaches
          //   </th>
          //   <tbody>
          //     <tr>
          //       <td>
          //         {data.last}
          //       </td>
          //       <td className="bad">
          //         {data.average}
          //       </td>
          //       <td className="bad">
          //         {data.first_average}
          //       </td>
          //       <td className="good">
          //         {data.worst}
          //       </td>
          //       <td className="bad">
          //         {data.best}
          //       </td>
          //       <td className="good">
          //         {data.mice}
          //       </td>
          //       <td className="good">
          //         {data.flies}
          //       </td>
          //       <td className="bad">
          //         {data.roaches}
          //       </td>
          //     </tr>
          //     <tr>
          //       <td>
          //
          //       </td>
          //       <td>
          //         {this.props.store.zipcode_calc.average}
          //       </td>
          //       <td>
          //         {this.props.store.zipcode_calc.first_average}
          //
          //       </td>
          //       <td>
          //         {data.worst}
          //       </td>
          //       <td>
          //         {data.best}
          //       </td>
          //       <td>
          //         {data.mice}
          //       </td>
          //       <td>
          //         {data.flies}
                    //       </td>
          //       <td>
          //         {data.roaches}
          //       </td>
          //     </tr>
          //   </tbody>
          // </table>
    return (
      <span className="overview-holder">
        <span className="store-name">{this.props.store.name} Overview: <span className="question-highlight">{this.props.store.calc.score}</span></span><p/>

        <table>

          <tbody>
            <tr>
              <td className="thumbs">
                <i className={"fa fa-" + this.iconParse(data.last)}></i>
              </td>
              <td >
                Most Recent Inspection
              </td>
              <td className="score">
                {data.last}
              </td>
              <td className="grade">
                 {this.translate(data.last)}
               </td>
            </tr>
            <tr>
            <td className="thumbs">
              <i className={"fa fa-" + this.iconParse(data.average)}></i>
            </td>
            <td>
              Average of {data.inspections} Inspections
            </td>
            <td className="score">
              {data.average}
            </td>
            <td className="grade">
              {this.translate(data.average)}
            </td>
          </tr>
          <tr>
            <td className="thumbs">
              <i className={"fa fa-" + this.iconParse(data.first_average)}></i>
            </td>
            <td>
              Avg of <span onMouseOver={this.showUnannounced} onMouseOut={this.hideUnannounced} className="question-highlight">Unannounced Inspections
                <span className="unannounced">The Health Department conducts unannounced inspections of restaurants at least once a year.</span></span> &nbsp;  
            </td>
            <td className="score">
              {data.first_average}
            </td>
            <td className="grade">
               {this.translate(data.first_average)}
             </td>
        </tr>
        <tr>
          <td className="thumbs">
            <i className={"fa fa-" + this.iconParse(data.best)}></i>
          </td>
          <td>
            Best Score
          </td>
          <td className="score">
            {data.best}
          </td>
          <td className="grade">
            {this.translate(data.best)}
          </td>
      </tr>
        <tr>
          <td className="thumbs">
            <i className={"fa fa-" + this.iconParse(data.worst)}></i>
          </td>
          <td>
            Worst Score
          </td>
          <td className="score">
            {data.worst}
          </td>
          <td className="grade">
            {this.translate(data.worst)}
          </td>
      </tr>
      <tr>
        <td className="thumbs">
          <i className={"fa fa-" + this.iconParse(data.mice)}></i>
        </td>
        <td>
          Probability of Mice
        </td>
        <td className="score">
          {data.mice}%
        </td>
        <td className="grade">
            {this.translate(data.mice)}
        </td>
    </tr>
    <tr>
      <td className="thumbs">
        <i className={"fa fa-" + this.iconParse(data.flies)}></i>
      </td>
      <td className="subject">
        Probability of Flies
      </td>
      <td className="score">
        {data.flies}%
      </td>
      <td className="grade">
          {this.translate(data.flies)}
      </td>
  </tr>
  <tr>
    <td>
      <i className={"fa fa-" + this.iconParse(data.roaches)}></i>
    </td>
    <td>
      Probability of Roaches
    </td>
    <td className="score">
      {data.roaches}%
    </td>
    <td className="grade">
        {this.translate(data.roaches)}
    </td>
</tr>

          </tbody>
        </table>



  </span>
);
  }

});

module.exports = Overview;
