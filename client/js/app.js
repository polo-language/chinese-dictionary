var app = angular.module('ngApp', [])

app.factory('DictionarySvc', function($q, $http) {
  function getRandomEntries(count) {
    var dfd = $q.defer();
    $http.get('/api/random/' + count).then(function (result) {
      dfd.resolve(result.data)
    })
    return dfd.promise
  }

  function getFromServer(apiPath) {
    // api path must always include trailing forward slash!
    return function (msg) {
      var dfd = $q.defer()
      $http.get(apiPath + msg).then(function (result) {
        dfd.resolve(result.data)
      })
      return dfd.promise
    }
  }

  return { getRandomEntries: getRandomEntries
         , searchEnglish: getFromServer('/api/search/english/')
         , searchChinese: getFromServer('/api/search/chinese/')
         , searchPinyin: getFromServer('/api/search/pinyin/')
  }
})

app.controller('EntryCtrl', function ($scope, DictionarySvc) {
  $scope.count = 5
  $scope.englishTerm = ''
  $scope.chineseTerm = ''
  $scope.pinyinTerm = ''

  $scope.getRandom = function () {
    $scope.englishTerm = ''
    $scope.chineseTerm = ''
    $scope.pinyinTerm = ''
    DictionarySvc.getRandomEntries($scope.count).then(saveToEntries)
  }

  $scope.searchEnglish = function () {
    $scope.chineseTerm = ''
    $scope.pinyinTerm = ''
    DictionarySvc.searchEnglish($scope.englishTerm).then(saveToEntries)
  }

  $scope.searchChinese = function () {
    $scope.englishTerm = ''
    $scope.pinyinTerm = ''
    DictionarySvc.searchChinese($scope.chineseTerm).then(saveToEntries)
  }

  $scope.searchPinyin = function () {
    $scope.englishTerm = ''
    $scope.chineseTerm = ''
    DictionarySvc.searchPinyin($scope.pinyinTerm).then(saveToEntries)
  }

  function saveToEntries(newEntries) {
    $scope.entries = newEntries
  }

  $scope.getRandom()
})
