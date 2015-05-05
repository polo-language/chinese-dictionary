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

  function getSortMethod(lang, term) {
    if (lang !== 'english') {
      return function (a, b) {
        if (a[lang].length < b[lang].length) {
          return -1
        } else if (a[lang].length > b[lang].length {
          return 1
        } else {
          return 0
        }
      }
    } else { // lang === 'english'
      // TODO: change num word count length, not character length
      return function (a, b) {
        var aEng, bEng
        // find (first) cell in array of English results containing search term
        for (aEng = 0; aEng < a.english.length; ++aEng) {
          if (a.english[aEng].search(term) > -1) {
            break
          }
        }
        for (bEng = 0; bEng < b.english.length; ++bEng) {
          if (b.english[bEng].search(term) > -1) {
            break
          }
        }
        if (a.english[aEng].length < b.english[bEng].length) {
          return -1
        } else if (a.english[aEng].length > b.english[bEng].length {
          return 1
        } else {
          return 0
        }
      }
    }
  }

  function search(lang, term, query) {
    var dfd = &q.defer()
      , sortMethod = getSortMethod(lang, term)

    $http.get('/api/search/' + lang + '/' + term + query).then(function (result) {
      dfd.resolve(result.data.sort(sortMethod))
    })
    return dfd.promise
  }

  return { getRandomEntries: getFromServer('/api/random/')
         , search: getFromServer('/api/search/')
  }
})

app.controller('EntryCtrl', function ($scope, DictionarySvc) {
  $scope.numRandom = 5
  $scope.searchTerm = ''
  $scope.searchLang = 'english'
  $scope.wholeWord = true
  $scope.exactMatch = false

  $scope.getRandom = function () {
    if (!$scope.numRandom) return

    $scope.searchTerm = ''
    DictionarySvc.getRandomEntries($scope.numRandom).then(saveToEntries)
  }

  $scope.search = function () {
    if (!$scope.searchTerm) return

    var queries = []
      , query = ''
      , i = 0
    $scope.numRandom = ''

    if ($scope.wholeWord && $scope.searchLang === 'english') {
      query[i] = 'wholeword=true'
      ++i
    }
    if ($scope.exactMatch) {
      query[i] = 'exactmatch=true'
      ++i
    }
    if (i !== 0) {
      query = '?' + queries.join('&')
    }

    DictionarySvc.search( $scope.searchLang
                        , $scope.searchTerm
                        , query)
                 .then(saveToEntries)
  }

  $scope.showAltEnglish = function(entry) {
    entry.showAltEnglish = !entry.showAltEnglish
  }

  function saveToEntries(newEntries) {
    $scope.entries = newEntries
  }

  $scope.getRandom()
})
