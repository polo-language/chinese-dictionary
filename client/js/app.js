var app = angular.module('ngApp', [])

app.factory('DictionarySvc', function($q, $http) {
  function getRandomEntries(count) {
    var dfd = $q.defer();
    $http.get('/api/random/' + count).then(function (result) {
      dfd.resolve(result.data)
    })
    return dfd.promise
  }

  function searchEnglish(term) {
    var dfd = $q.defer()
    $http.get('/api/search/en/' + term).then(function (result) {
      dfd.resolve(result.data)
    })
    return dfd.promise
  }
  // TODO: template to following and use like:
  // searchEnglish = getFromServer('/api/search/en/')
  /*function getFromServer(apiPath) {
    // api path must always include trailing forward slash!
    return function (msg) {
      var dfd = $q.defer()
      $http.get(apiPath + msg).then(function (result) {
        dfd.resolve(result.data)
      })
      return dfd.promise
    }
  }*/

  return { getRandomEntries: getRandomEntries
         , searchEnglish: searchEnglish
  }
})

app.controller('EntryCtrl', function ($scope, DictionarySvc) {
  $scope.count = 5
  $scope.englishTerm = ''

  $scope.refreshEntries = function () {
    DictionarySvc.getRandomEntries($scope.count).then(saveToEntries)
  }

  $scope.searchEnglish = function () {
    DictionarySvc.searchEnglish($scope.englishTerm).then(saveToEntries)
  }

  function saveToEntries(newEntries) {
    $scope.entries = newEntries
  }

  $scope.refreshEntries()
})
