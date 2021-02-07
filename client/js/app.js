const app = angular.module('ngApp', [])

app.factory('DictionarySvc', function($q, $http) {
  function getFromServer(apiPath) {
    // apiPath must always include trailing forward slash
    return function (msg) {
      const dfd = $q.defer()
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
        const aLength = a.trad.length
        const bLength = b.trad.length
        if (aLength < bLength) {
          return -1
        } else if (aLength > bLength) {
          return 1
        } else {
          return 0
        }
      }
    } else { // lang === 'english'
      const regExTerm = new RegExp(term, 'i')
      for (let i = 0; i < data.length; ++i) {
        // find (first) cell in array of English results containing search term
        let j = 0
        while (j < data[i].english.length && data[i].english[j].search(regExTerm) < 0) {
          ++j
        }
        // current j gives index of cell containing term (falls through to array length)
        data[i].englishSearchLength = data[i].english[j].split(' ').length
      }

      return function (a, b) {
        if (a.englishSearchLength < b.englishSearchLength) {
          return -1
        } else if (a.englishSearchLength > b.englishSearchLength) {
          return 1
        } else {
          return 0
        }
      }
    }
  }

  function search(lang, term, query) {
    const dfd = $q.defer()
    $http.get('/api/search/' + lang + '/' + term + query).then(function (result) {
      dfd.resolve(result.data.sort(getSortMethod(result.data, lang, term)))
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
    if (!$scope.searchTerm) {
      return
    }

    $scope.numRandom = ''
    
    const queries = []
    if ($scope.wholeWord && $scope.searchLang === 'english') {
      queries.push('wholeword=true')
    }
    if ($scope.exactMatch) {
      queries.push('exactmatch=true')
    }
    DictionarySvc.search(
        $scope.searchLang,
        $scope.searchTerm,
        queries.length === 0 ? '' : '?' + queries.join('&'))
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
