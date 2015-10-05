angular.module('appStore',['ngRoute'])
.config(['$routeProvider',function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/itemlist.html',
        controller: 'appController'
      }).when('/item/:itemId',{		
		 templateUrl: 'views/itemdetails.html',
		controller:'itemdetailsController'
	  }).
      otherwise({
        redirectTo: '/'
      });
  }])

.controller("appController",['$scope','storeService',function(scope, storeService){

	storeService.getStoreItems(function(data){
	
		scope.items = data;
	})
	
	scope.cart = storeService;
	
	scope.selectedFilter = [];
	
	scope.itemFilter = function (category) {
        
		scope.selectedFilter = [];
		if(category){console.log("...." + category);
			scope.selectedFilter.push(category);
			
			console.log(scope.selectedFilter);
			}
	};
}])

.service("storeService",['$http',function(http){

 this.items = null;
 
 this.getStoreItems=function(callback){
		var refThis = this;
		
		if(!this.items){
			http.get('/data/data.json').success(function(data){
				refThis.items=data;
				callback(data);
		});
		}else{
			callback(this.items);
		}
	}
 }])

.service("cartService",['$http',function(http){

 }])

.filter("itemFilter",function(){
	
	return function(items,selectedFilter){
		//console.log("1 "+items+ " "+ selectedFilter + " "+ selectedFilter.length);
		var filteredItems = [];
	
	if(selectedFilter.length > 0){
	//console.log("2 "+ selectedFilter.length);
		for (var i = 0; i < items.length; i++) {
		//console.log("3 " + items[i].category + " " + selectedFilter);
			if(items[i].category==selectedFilter) {
					console.log("....  "+ filteredItems);
                filteredItems.push(items[i]);
				
				}
            }
		//console.log(filteredItems+ " "+ filteredItems);
		return filteredItems;
	} else 
		return items;
	}
})

.filter('customfilter',function(){ 
	return function(items,key,val){
		var result =[];
		for(var i in items){
			var item = items[i];
			
			if(item[key]==val){	result.push(item);		}
		}
		return result;
	}
 })

;
