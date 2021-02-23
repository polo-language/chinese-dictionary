angular.module('ngApp').controller('EntryCtrl', function ($scope, DictionarySvc) {
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
