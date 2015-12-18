(function () {
  angular.module('jiraBugsApp.transform.service', [])
    .service('TransformDataService', [TransformDataService])
  ;

  var ONE_DAY_IN_MS = 86400000;

  function getDateConfig(issues) {

    var dates = _.map(_.pluck(issues, 'fields.created'), function (date) {
      return new Date(date.substring(0, 10)).getTime();
    });

    var startDate = _.min(dates);
    var endDate = _.max(dates);

    return {
      startDate: startDate,
      endDate: endDate,
      numberOfDays: (endDate - startDate) / ONE_DAY_IN_MS
    };
  }

  function groupIssuesByPriority(issues) {
    return _.groupBy(issues, function (issue) {
      return issue.fields.priority.name;
    });
  }

  function groupIssuesByDate(issues) {
    return _.groupBy(issues, function (issue) {
      return new Date(issue.fields.created.substring(0, 10)).getTime();
    });
  }

  function mapIssuesToDates(issues, dateConfig) {
    var result = [];

    var issuesGroupedByDate = groupIssuesByDate(issues);

    for (var i = 0; i < dateConfig.numberOfDays; i++) {

      var date = (dateConfig.startDate + i * ONE_DAY_IN_MS);
      var numberOfIssuesAtDate = issuesGroupedByDate[date] ? issuesGroupedByDate[date].length : 0;

      result.push([date, numberOfIssuesAtDate])
    }

    return result;
  }


  function transform(data) {
    var result = [];

    var dateConfig = getDateConfig(data.issues);
    var issuesByTypes = groupIssuesByPriority(data.issues);
    var issueTypes = _.keys(issuesByTypes);

    _.each(issueTypes, function (type) {
      result.push({key: type, values: mapIssuesToDates(issuesByTypes[type], dateConfig)});
    });

    return result;
  }

  function TransformDataService() {
    var service = this;
    service.transform = transform;
  }

})();