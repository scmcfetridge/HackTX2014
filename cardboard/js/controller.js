angular.module('airDraw', [])
  .controller('Controller', ['$scope', '$timeout', function($scope, $timeout, $interval) {
    $scope.words= [
      'an apple',
      'a dog',
      'a house', 
      'a sandwich', 
      'a camel', 
      'a buttons', 
      'a woman', 
      'a car', 
      'an ocean', 
      'a tree', 
      'a peanut',
      'window', 
      'shirt',
      'mother',
      'bear',
      'hair',
      'fish',
      'shovel',
      'candy',
      'coffee'
    ];
    $scope.wordNum = 0;
    $scope.showCanvas = true;
    $scope.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
  // Format cardboard upon loading page.
  $scope.formatCardBoard = function() {
    if (isMobile) {
      $("body").css({"margin":"0px", "overflow":"hidden"});
      $("#example").css({"position":"absolute", "top":"0", "left":"0", "right":"0", "bottom":"0", });
    }
    else {
      var width = $( window ).width()/2;
      $("#example").css({"width": width, "height":width*9/16, });
    }
  }
  $timeout($scope.formatCardBoard);
  
  //Stopwatch
  var timeoutId;
  var nextTimeoutId;
  $scope.seconds = 0;
  $scope.minutes = 0;
  $scope.running = false;
  $scope.stop = function() {
    $timeout.cancel(timeoutId);
    $scope.running = false;
  };

  $scope.start = function() {
    timer();
    $timeout(function(){$scope.showCanvas = false;}, 5000, true);
    $scope.running = true;
  };

  $scope.next = function() {
    $timeout.cancel(nextTimeoutId);
    $scope.seconds = 0;
    $scope.minutes = 0;
    $scope.wordNum++;
    if ($scope.wordNum > $scope.words.length - 1) {
      $scope.wordNum = 0;
    }
    $scope.showCanvas = true;
    nextTimeoutId = $timeout(function(){$scope.showCanvas = false;}, 5000, true);
  };

  function timer() {
    timeoutId = $timeout(function() {
      updateTime(); // update Model
      timer();
    }, 1000);
  }

  function updateTime() {
    $scope.seconds++;
    if ($scope.seconds === 60) {
      $scope.seconds = 0;
      $scope.minutes++;
    }
  }
}]);