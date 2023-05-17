import React from 'react';
import Chart from 'react-apexcharts'
var _seed = 42;
      Math.random = function() {
        _seed = _seed * 16807 % 2147483647;
        return (_seed - 1) / 2147483646;
      };
var data = []
let XAXISRANGE = 777600000
var lastDate = 0;
var TICKINTERVAL = 86400000

function getNewSeries(baseval, yrange) {
    var newDate = baseval + TICKINTERVAL;
    lastDate = newDate
  
    for(var i = 0; i< data.length - 10; i++) {
      // IMPORTANT
      // we reset the x and y of the data which is out of drawing area
      // to prevent memory leaks
      data[i].x = newDate - XAXISRANGE - TICKINTERVAL
      data[i].y = 0
    }
  
    data.push({
      x: newDate,
      y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
    })
  }
  function resetData(){
    // Alternatively, you can also reset the data at certain intervals to prevent creating a huge series 
    data = data.slice(data.length - 10, data.length);
  }
  function getDayWiseTimeSeries(baseval, count, yrange) {
    var i = 0;
    while (i < count) {
      var x = baseval;
      var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
  
      data.push({
        x, y
      });
      lastDate = baseval
      baseval += TICKINTERVAL;
      i++;
    }
  }
  
  getDayWiseTimeSeries(new Date().getTime(), 10, {
    min: 10,
    max: 90
  })

class RealChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                data: data.slice()
              }],
            options: {
                chart: {
                  id: 'realtime',
                  height: 350,
                  type: 'line',
                  animations: {
                    enabled: true,
                    easing: 'linear',
                    dynamicAnimation: {
                      speed: 1000
                    }
                  },
                  toolbar: {
                    show: false
                  },
                  zoom: {
                    enabled: false
                  }
                },
                dataLabels: {
                  enabled: false
                },
                stroke: {
                  curve: 'smooth'
                },
                title: {
                  text: 'Humidity over time chart',
                  align: 'left'
                },
                markers: {
                  size: 0
                },
                xaxis: {
                  type: 'numeric',
                  range: 10,
                },
                yaxis: {
                  max: 100
                },
                legend: {
                  show: false
                },
              },


        };
    }
    

    componentDidMount() {
        window.setInterval(() => {
          getNewSeries(lastDate, {
            min: 10,
            max: 90
          })
          
          ApexCharts.exec('realtime', 'updateSeries', [{
            data: data
          }])
        }, 1000)
        window.setInterval(function () {
            resetData()
            
          }, 60000)
      }

    render() {
        return (
            <div id="chart">
                <Chart options={this.state.options} series={this.state.series} type="line" height={350} />
            </div>);
    }
}

export default RealChart;