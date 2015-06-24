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

  function getSortMethod(data, lang, term) {
    if (lang !== 'english') {
      return function (a, b) {
        // use length of trad string for chinese and pinyin
        var aLength = a.trad.length
          , bLength = b.trad.length
        if (aLength < bLength) {
          return -1
        } else if (aLength > bLength) {
          return 1
        } else {
          return 0
        }
      }
    } else { // lang === 'english'
      // TODO: close over arrays of lengths to reduce calculatsions (requires call to indexOf)
      return function (a, b) {
        var iA, iB, aLength, bLength
        // find (first) cell in array of English results containing search term
        for (iA = 0; iA < a.english.length; ++iA) {
          if (a.english[iA].search(new RegExp(term, 'i')) > -1) {
            // current iA gives index of cell containing term (defaults last cell)
            break
          }
        }
        for (iB = 0; iB < b.english.length; ++iB) {
          if (b.english[iB].search(new RegExp(term, 'i')) > -1) {
            break
          }
        }
        aLength = a.english[iA].split(' ').length
        bLength = b.english[iB].split(' ').length
        if (aLength < bLength) {
          return -1
        } else if (aLength > bLength) {
          return 1
        } else {
          return 0
        }
      }
    }
  }

  function search(lang, term, query) {
    var dfd = $q.defer()
    $http.get('/api/search/' + lang + '/' + term + query).then(function (result) {
      var sortMethod = getSortMethod(result.data, lang, term)
      dfd.resolve(result.data.sort(sortMethod))
    })
    return dfd.promise
  }

  return { getRandomEntries: getFromServer('/api/random/')
         , search: search
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
      queries[i] = 'wholeword=true'
      ++i
    }
    if ($scope.exactMatch) {
      queries[i] = 'exactmatch=true'
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

  $scope.exactMatchSync = function (clickEvent) {
    if (clickEvent.target.checked) {
      $scope.wholeWord = false
    }
  }

  $scope.wholeWordSync = function (clickEvent) {
    if (clickEvent.target.checked) {
      $scope.exactMatch = false
    }
  }
  
  function saveToEntries(newEntries) {
    $scope.entries = newEntries
  }

  $scope.getRandom()
})
