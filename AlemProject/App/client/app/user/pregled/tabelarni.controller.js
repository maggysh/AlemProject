'use strict';
(function(ng) {

angular.module('appApp')
  .controller('tabelarniPrikazCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {

    $scope.collection = [];
    $scope.displayed = [];
    $scope.info = [];
    $scope.pregled = [];
    $scope.max = 0;
    $scope.min = 0;
    $scope.avg = 0;
    $scope.vrijednosti = [];

    $scope.$watch('displayed', function(newValue) {
      $scope.vrijednosti = [];
      angular.forEach($scope.displayed, function(entry, key){
        $scope.vrijednosti.push(entry.Vrijednost);
      });
      $scope.max = Math.max.apply(Math, $scope.vrijednosti);
      $scope.min = Math.min.apply(Math, $scope.vrijednosti);
      var total = 0;
      angular.forEach($scope.vrijednosti, function(entry, key){
        if(entry==undefined) total=total;
        else
          total = total + entry;
      });
      if (total==0) $scope.avg=0;
      else
        $scope.avg = (total/$scope.vrijednosti.length).toFixed(2);
      console.log($scope.avg);
    }, true);

    //--------------------------------------------------------

    $scope.pregledInit = function() {
      $http.get('/loggedin').then(function (response) {
        $scope.info.id = response.data.user.id;
        $http.get('/api/user/link/' + $scope.info.id).then(function (data) {
           angular.forEach(data.data, function(value) {
                $scope.ucitajVrijednosti(value[0].id);
           });
        });
        $scope.displayed = [].concat($scope.collection);
      });
    }

    //-----------------------------------------------------------------------------------------------------
    //ucitavanje vrijednosti za stanicu
    $scope.ucitajVrijednosti = function(id) {

      $http.get('/api/user/pregled/tabela/' + id).then(function(data){
        angular.forEach(data.data, function(value, key){
          angular.forEach(value.vrijednosti, function(entry, key){
            //console.log(new Date(entry.Datum));
            $scope.collection.push({
              "Vrijednost": entry.Vrijednost,
              //"Datum": new Date(entry.Datum),
              "Datum": $filter('date')(entry.Datum, "dd/MM/yyyy")+ ' ' + $filter('date')(entry.Datum, "HH:mm:ss"),
              "Kod_senzora": value.senzor.Kod_senzora,
              "Tip_senzora": value.senzor.Tip_senzora.Tip_Senzora,
              "Naziv": value.senzor.Stanica.Naziv
            });
          });
        });
      });

    };

    //-----------------------------------------------------------------------------------------------------
  }])

  //=========================================================================================================
  //=========================================================================================================


.directive('stSelectDistinct', [function() {
      return {
        restrict: 'E',
        require: '^stTable',
        scope: {
          collection: '=',
          predicate: '@',
          predicateExpression: '='
        },
        template: '<select ng-model="selectedOption" ng-change="optionChanged(selectedOption)" ng-options="opt for opt in distinctItems"></select>',
        //template: 'app/user/pregled/distinct.html',
        link: function(scope, element, attr, table) {

          var getPredicate = function() {
            var predicate = scope.predicate;
            if (!predicate && scope.predicateExpression) {
              predicate = scope.predicateExpression;
            }
            return predicate;
          }

          scope.$watch('collection', function(newValue) {
            var predicate = getPredicate();

            if (newValue) {
              var temp = [];
              scope.distinctItems = ['Sve'];

              angular.forEach(scope.collection, function(item) {
                var value = item[predicate];

                if (value && value.trim().length > 0 && temp.indexOf(value) === -1) {
                  temp.push(value);
                }
              });
              temp.sort();

              scope.distinctItems = scope.distinctItems.concat(temp);
              scope.selectedOption = scope.distinctItems[0];
              scope.optionChanged(scope.selectedOption);
            }
          }, true);

          scope.optionChanged = function(selectedOption) {
            var predicate = getPredicate();

            var query = {};

            query.distinct = selectedOption;

            if (query.distinct === 'Sve') {
              query.distinct = '';
            }

            table.search(query, predicate);
          };

        }
      }
    }])

    //=================================================================================================================
    //=================================================================================================================
    .directive('stSelectMultiple', [function() {
           return {
             restrict: 'E',
             require: '^stTable',
             scope: {
               collection: '=',
               predicate: '@',
               predicateExpression: '='
             },
             templateUrl: 'app/user/pregled/multiple.html',
             link: function(scope, element, attr, table) {
               scope.dropdownLabel = '';
               scope.filterChanged = filterChanged;

               scope.$watch('collection', function(newValue) {
                     initialize();
               }, true);

               function initialize() {
                 bindCollection(scope.collection);
                 //console.log(scope.collection);
               }

               function getPredicate() {
                 var predicate = scope.predicate;
                 if (!predicate && scope.predicateExpression) {
                   predicate = scope.predicateExpression;
                 }
                 return predicate;
               }

               function getDropdownLabel() {
                 var allCount = scope.distinctItems.length;

                 var selected = getSelectedOptions();

                 if (allCount === selected.length || selected.length === 0) {
                   return 'Sve';
                 }

                 if (selected.length === 1) {
                   return selected[0];
                 }

                 return selected.length + ' stavke';
               }

               function getSelectedOptions() {
                 var selectedOptions = [];

                 angular.forEach(scope.distinctItems, function(item) {
                   if (item.selected) {
                     selectedOptions.push(item.value);
                   }
                 });

                 return selectedOptions;
               }

               function bindCollection(collection) {
                 var predicate = getPredicate();
                 var distinctItems = [];

                 angular.forEach(collection, function(item) {
                   var value = item[predicate];
                   fillDistinctItems(value, distinctItems);
                 });

                 distinctItems.sort(function(obj, other) {
                   if (obj.value > other.value) {
                     return 1;
                   } else if (obj.value < other.value) {
                     return -1;
                   }
                   return 0;
                 });

                 scope.distinctItems = distinctItems;
                 //console.log(scope.distinctItems);
                 filterChanged();
               }

               function filterChanged() {
                 scope.dropdownLabel = getDropdownLabel();

                 var predicate = getPredicate();

                 var query = {
                   matchAny: {}
                 };

                 query.matchAny.items = getSelectedOptions();
                 var numberOfItems = query.matchAny.items.length;
                 if (numberOfItems === 0 || numberOfItems === scope.distinctItems.length) {
                   query.matchAny.all = true;
                 } else {
                   query.matchAny.all = false;
                 }

                 table.search(query, predicate);
               }

               function fillDistinctItems(value, distinctItems) {
                 if (value && value.trim().length > 0  && !findItemWithValue(distinctItems, value)) { //----------------------------
                   distinctItems.push({
                     value: value,
                     selected: true
                   });
                 }
               }

               function findItemWithValue(collection, value) {
                 var found = _.find(collection, function(item) {
                   return item.value === value;
                 });

                 return found;
               }
             }
           }
         }])
      //===============================================================================================================
      //===============================================================================================================
  .directive('stDateRange', ['$timeout', function ($timeout) {
    return {
      restrict: 'E',
      require: '^stTable',
      scope: {
        before: '=',
        after: '='
      },
      templateUrl: 'app/user/pregled/date.html',

      link: function (scope, element, attr, table) {

        var inputs = element.find('input');
        var inputBefore = ng.element(inputs[0]);
        var inputAfter = ng.element(inputs[1]);
        var predicateName = attr.predicate;


        [inputBefore, inputAfter].forEach(function (input) {

          input.bind('blur', function () {


            var query = {};

            if (!scope.isBeforeOpen && !scope.isAfterOpen) {

              if (scope.before) {
                query.before = scope.before;
              }

              if (scope.after) {
                query.after = scope.after;
              }

              scope.$apply(function () {
                table.search(query, predicateName);
              })
            }
          });
        });

        function open(before) {
          return function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            if (before) {
              scope.isBeforeOpen = true;
            } else {
              scope.isAfterOpen = true;
            }
          }
        }

        scope.openBefore = open(true);
        scope.openAfter = open();
      }
    }
  }])
  //=============================================================================================
  //=============================================================================================
  .directive('stNumberRange', ['$timeout', function ($timeout) {
    return {
      restrict: 'E',
      require: '^stTable',
      scope: {
        lower: '=',
        higher: '='
      },
      templateUrl: 'app/user/pregled/number.html',
      link: function (scope, element, attr, table) {
        var inputs = element.find('input');
        var inputLower = ng.element(inputs[0]);
        var inputHigher = ng.element(inputs[1]);
        var predicateName = attr.predicate;

        [inputLower, inputHigher].forEach(function (input, index) {

          input.bind('blur', function () {
            var query = {};

            if (scope.lower) {
              query.lower = scope.lower;
            }

            if (scope.higher) {
              query.higher = scope.higher;
            }

            scope.$apply(function () {
              table.search(query, predicateName)
            });
          });
        });
      }
    };
  }])
    //=================================================================================================================
    //=================================================================================================================
  .directive('stRatio',[function(){
    return {
      link:function(scope, element, attr){
        var ratio=+(attr.stRatio);

        element.css('width',ratio+'%');

      }
    };
  }])
  //--------------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------
    .filter('customFilter', ['$filter', function($filter) {
          var filterFilter = $filter('filter');
          var standardComparator = function standardComparator(obj, text) {
            text = ('' + text).toLowerCase();
            return ('' + obj).toLowerCase().indexOf(text) > -1;
          };

          return function customFilter(array, expression) {
            function customComparator(actual, expected) {

              var isBeforeActivated = expected.before;
              var isAfterActivated = expected.after;
              var isLower = expected.lower;
              var isHigher = expected.higher;
              var higherLimit;
              var lowerLimit;
              var itemDate;
              var queryDate;

              if (ng.isObject(expected)) {
                //exact match
                if (expected.distinct) {
                  if (!actual || actual.toLowerCase() !== expected.distinct.toLowerCase()) {
                    return false;
                  }

                  return true;
                }

                //matchAny
                if (expected.matchAny) {
                  if (expected.matchAny.all) {
                    return true;
                  }

                  if (!actual) {
                    return false;
                  }

                  for (var i = 0; i < expected.matchAny.items.length; i++) {
                    if (actual.toLowerCase() === expected.matchAny.items[i].toLowerCase()) {
                      return true;
                    }
                  }

                  return false;
                }

                //date range
                if (expected.before || expected.after) {
                  try {
                    if (isBeforeActivated) {
                      higherLimit = expected.before;

                      itemDate = new Date(actual);
                      queryDate = new Date(higherLimit);

                      if (itemDate > queryDate) {
                        return false;
                      }
                    }

                    if (isAfterActivated) {
                      lowerLimit = expected.after;


                      itemDate = new Date(actual);
                      queryDate = new Date(lowerLimit);

                      if (itemDate < queryDate) {
                        return false;
                      }
                    }

                    return true;
                  } catch (e) {
                    return false;
                  }

                } else if (isLower || isHigher) {
                  //number range
                  if (isLower) {
                    higherLimit = expected.lower;

                    if (actual > higherLimit) {
                      return false;
                    }
                  }

                  if (isHigher) {
                    lowerLimit = expected.higher;
                    if (actual < lowerLimit) {
                      return false;
                    }
                  }

                  return true;
                }
                //etc

                return true;

              }
              return standardComparator(actual, expected);
            }

            var output = filterFilter(array, expression, customComparator);
            return output;
          };
        }]);
        })(angular);
