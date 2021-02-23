angular.module('ngApp').factory('DictionarySvc', function($q, $http) {
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

  return {
    getRandomEntries: getFromServer('/api/random/'),
    search: search
  }
})
