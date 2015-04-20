var app = angular.module('ngApp', [])

app.factory('DictionarySvc', function($q, $http) {
  function getFromServer(apiPath) {
    // apiPath must always include trailing forward slash!
    return function (msg) {
      var dfd = $q.defer()
      $http.get(apiPath + msg).then(function (result) {
        dfd.resolve(result.data)
      })
      return dfd.promise
    }
  }

  return { getRandomEntries: getFromServer('/api/random/')
         , searchEnglish: getFromServer('/api/search/english/')
         , searchChinese: getFromServer('/api/search/chinese/')
         , searchPinyin: getFromServer('/api/search/pinyin/')
  }
})

app.controller('EntryCtrl', function ($scope, DictionarySvc) {
  $scope.numRandom = 5
  $scope.englishTerm = ''
  $scope.chineseTerm = ''
  $scope.pinyinTerm = ''

  $scope.getRandom = function () {
    $scope.englishTerm = ''
    $scope.chineseTerm = ''
    $scope.pinyinTerm = ''
    DictionarySvc.getRandomEntries($scope.numRandom).then(saveToEntries)
  }

  $scope.searchEnglish = function () {
    $scope.numRandom = ''
    $scope.chineseTerm = ''
    $scope.pinyinTerm = ''
    DictionarySvc.searchEnglish($scope.englishTerm).then(saveToEntries)
  }

  $scope.searchChinese = function () {
    $scope.numRandom = ''
    $scope.englishTerm = ''
    $scope.pinyinTerm = ''
    DictionarySvc.searchChinese($scope.chineseTerm).then(saveToEntries)
  }

  $scope.searchPinyin = function () {
    $scope.numRandom = ''
    $scope.englishTerm = ''
    $scope.chineseTerm = ''
    DictionarySvc.searchPinyin($scope.pinyinTerm).then(saveToEntries)
  }

  function saveToEntries(newEntries) {
    $scope.entries = newEntries
  }

  $scope.getRandom()
})
