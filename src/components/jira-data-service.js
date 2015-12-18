(function () {
  angular.module('jiraBugsApp.jira.service', ['jiraBugsApp.mock.data.service'])
    .service('JiraDataService', ['$http', '$location', 'MockDataService', JiraDataService])
  ;

  function JiraDataService($http, $location, MockDataService) {
    var service = this;

    service.getList = function () {

      if ($location.$$protocol === 'file') {
        return MockDataService.getList();
      }

      return $http.get('api/bugs.json').then(function (response) {
        return response.data;
      });
    };

  }

})();