var app = angular.module('ngApp', [])

app.factory("DictionarySvc", function($q, $http) {
  return {
    getEntries: function (count) {
      var dfd = $q.defer();
      $http.get('/api/entries/' + count).then(function (result) {
        dfd.resolve(result.data)
      })
      return dfd.promise
    }
  }
})

app.controller('EntryCtrl', function ($scope, DictionarySvc) {
  DictionarySvc.getEntries(10).then(function (entries) {
    $scope.entries = entries
  })
})
