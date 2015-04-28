var app = angular.module('ngApp', [])

app.factory('DictionarySvc', function($q, $http) {
  function getFromServer(apiPath) {
    // apiPath must always include trailing forward slash
    return function (msg) {
      var dfd = $q.defer()
      $http.get(apiPath + msg).then(function (result) {
        dfd.resolve(result.data)
      })
      return dfd.promise
    }
  }

  return { getRandomEntries: getFromServer('/api/random/')
         , search: getFromServer('/api/search/')
  }
})

app.controller('EntryCtrl', function ($scope, DictionarySvc) {
  $scope.numRandom = 5
  $scope.searchTerm = ''
  $scope.searchLang = 'english'

  $scope.getRandom = function () {
    $scope.searchTerm = ''
    DictionarySvc.getRandomEntries($scope.numRandom).then(saveToEntries)
  }

  $scope.search = function () {
    $scope.numRandom = ''
    DictionarySvc.search($scope.searchLang + '/' + $scope.searchTerm).then(saveToEntries)
  }

  $scope.showAltEnglish = function(entry) {
    entry.showAltEnglish = !entry.showAltEnglish
  }

  function saveToEntries(newEntries) {
    $scope.entries = newEntries
  }

  $scope.getRandom()
})
