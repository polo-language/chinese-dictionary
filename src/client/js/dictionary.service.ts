angular.module('ngApp').factory('DictionarySvc', function($q: any /*IQService*/, $http: any /*IHttpService*/) {
  function getFromServer(apiPath: string) {
    // apiPath must always include trailing forward slash
    return function (msg: string) {
      const dfd = $q.defer()
      $http.get(apiPath + msg)
      .then((result: any) => {
        dfd.resolve(result.data)
      })
      return dfd.promise
    }
  }

  function search(lang: string, term: string, query: string) {
    return getFromServer('/api/search/')(lang + '/' + term + query)
  }

  return {
    getRandomEntries: getFromServer('/api/random/'),
    search: search
  }
})
