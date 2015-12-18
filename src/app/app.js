(function () {
  angular.module('jiraBugsApp', ['nvd3', 'jiraBugsApp.jira.service', 'jiraBugsApp.transform.service'])
    .controller('JiraBugsChartController', ['JiraDataService', 'TransformDataService', JiraBugsChartController])
  ;

  function JiraBugsChartController(JiraDataService, TransformDataService) {
    var ctrl = this;

    ctrl.options = {
      title: {
        enable: true,
        text: 'JIRA Issues Grouped by priority and date'
      },
      chart: {
        type: 'stackedAreaChart',
        height: 450,
        margin: {
          top: 20,
          right: 20,
          bottom: 30,
          left: 40
        },
        x: function (d) {
          return d[0];
        },
        y: function (d) {
          return d[1];
        },
        useVoronoi: true,
        clipEdge: true,
        duration: 100,
        useInteractiveGuideline: true,
        xAxis: {
          showMaxMin: false,
          tickFormat: function (d) {
            return d3.time.format('%x')(new Date(d))
          }
        },
        yAxis: {
          tickFormat: function (d) {
            return d3.format(',.d')(d);
          }
        },
        zoom: {
          enabled: false
        }
      }
    };

    function init() {
      JiraDataService.getList().then(function (data) {
        ctrl.data = TransformDataService.transform(data);
      });
    }

    init();

  }


})();