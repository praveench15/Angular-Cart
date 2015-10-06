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

.controller("appController",['$rootScope','$scope','storeService',function(rootScope,scope, storeService){

	storeService.getStoreItems(function(data){

		scope.items = data;
	})
		//console.log("scope.items "+ scope.items);
	scope.cart = storeService;
	
	rootScope.selectedFilter = [];
	
	scope.itemFilter = function (category) {
        
		rootScope.selectedFilter = [];
		if(category){//console.log("...." + category);
			rootScope.selectedFilter.push(category);
			
			console.log(rootScope.selectedFilter);
			}
	};
}])

.controller("itemdetailsController",['$scope','storeService','$routeParams',function(scope,storeService,routeParams){
console.log("Item Id "+ routeParams.itemId);
	scope.item = storeService.getItemByid(routeParams.itemId);


}])

.service("storeService",['$http',function(http){

 this.items = null;
 
 this.getStoreItems=function(callback){
		var refThis = this;
		
		if(!this.items){
			http.get('data/data.json').success(function(data){
				//console.log("Data "+ data);
				refThis.items=data;
				callback(data);
		});
		}else{
			//console.log("In Else Data "+ this.items);
			callback(this.items);
		}
	}
	
	this.getCartItemsCount = function(){
		var totalCount = 0;
            var items = this.cartitems;
            angular.forEach(items, function (item) {
                totalCount += item.qty;
            });
        return totalCount;
	}
	
	this.getItemByid = function(itemId){
	
	 var items = this.items;
	 var itemObj;
            angular.forEach(items, function (item) {
	           if  (item.id == itemId) {
	                itemObj = item;
                }
            });
			return itemObj;
        };
		
	this.cartitems={}

	this.addToCart = function(item){
	console.log("Item Id "+ item.id + " isChecked "+item.checked + " quantity "+item.qty);
	
	if(item.checked){

	if(!this.cartitems[item.id]){
		this.cartitems[item.id]={qty:item.qty*1};
		item.qty = "";
		item.checked = false;
	}else{
		var olditem = this.cartitems[item.id];
		olditem.qty+=item.qty*1;
		item.qty = "";
		item.checked = false;
	}
	} else {
		alert(" Please select item and fill quantity");
	}
}
 }])

.service("cartService",['$http',function(http){

 }])

.filter("itemFilter",function(){
	
	return function(items,selectedFilter){
		//console.log("1 "+items+ " "+ selectedFilter + " "+ selectedFilter.length);
		var filteredItems = [];
	
	if(null!=selectedFilter && selectedFilter.length > 0){
	//console.log("2 "+ selectedFilter.length);
		for (var i = 0; i < items.length; i++) {
		//console.log("3 " + items[i].category + " " + selectedFilter);
			if(items[i].category==selectedFilter) {
					//console.log("....  "+ filteredItems);
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
