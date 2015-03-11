datamodule.factory('RedditApi', ['$http','$q','ApiUrls','UserData','Calendar', function($http,$q,ApiUrls,UserData,Calendar){
	var master_count  = 0;

	function cleanListing(result){
		if(_.has(result.data, "children")){
			var listings = result.data.children
			var cleaned_listing_data=[];
			for (var i = 0; i < listings.length; i++) {
				listings[i].type = result.kind;
				cleaned_listing_data.push(listings[i].data);
			};
			return cleaned_listing_data;
		}

		else{
			return result.data;
		}
		
	}

	function getNewData(url,returned_data,deferred){
		$http.get(url).success(function(data, status, headers, config) {
			var result_data = data.data;

			if(_.has(result_data, "children")){
				returned_data.push(cleanListing(data));
				returned_data = _.flatten(returned_data);
				if(result_data.after && master_count < 12){
					var index = url.indexOf("&after=");
					if(index != -1){url = url.substr(0,index)}
					 getNewData(url+"&after="+result_data.after,returned_data,deferred);
					 master_count++;
					}

				else{
					master_count = 0;
					deferred.resolve(returned_data)  
				}
			}

			else{
				deferred.resolve(result_data);
			}
		}).error(function(data, status, headers, config) {
			console.log("not valid username getnewdata");
			deferred.reject("Not vaild username")
  	});;
	}

	function getDataSet(key){
		 	var deferred = $q.defer();
		 	var returned_data = [];
      getNewData(ApiUrls[key],returned_data,deferred);
      return deferred.promise;
	}

	function rankPosts(collection,key){
	 		var top = _.sortBy(collection, function(post){ return post.score; });
	 		top = top.reverse();
	 		
	 		_.each(collection, function(post){
	 			var index = _.find(top, function(rankedpost,postInx){if(post.id == rankedpost.id){ post.rank = postInx; return true;}});
	 			post.rank = index.rank;
	 		});

		 return collection;
	}

	function isDataLoaded(alldeferred){
		if(UserData.beenEdited == 3){
			alldeferred.resolve(UserData);
		}
	}

	function creatCalendar(){
		var deferred = $q.defer();

		var user_info = getDataSet('user_info');
  	user_info.then(function(payload){
	  	UserData.user_data.user_info = payload;
	  	UserData.user_data.name = UserData.user_name;
	  	UserData.user_data.totalkar = payload.comment_karma + payload.link_karma;
	  	Calendar.createCalendar();
	  	UserData.beenEdited++;
	  	deferred.resolve();
 		},function(){
 			console.log("not valid username createCalendar");
 			deferred.reject();
 		});

		return deferred.promise;
	}

	return{
		 getAllData: function(term){
		 			var alldeferred = $q.defer();

				 	ApiUrls.configUrls(term);
				 	UserData.user_name = term;

		 	    creatCalendar().then(function(){
				  	var user_posts = getDataSet('user_posts');
			   		user_posts.then(function(payload){
					  	var sorted_data = rankPosts(payload,"submitted");
					    Calendar.buildData(sorted_data,"posts");
					    UserData.beenEdited++;
					    isDataLoaded(alldeferred);
				  	});

				  	var user_comments = getDataSet('user_comments');
				   	user_comments.then(function(payload){
					  	var sorted_data = rankPosts(payload,"comments");
					    Calendar.buildData(sorted_data,"comments");
					    UserData.beenEdited++;
					    isDataLoaded(alldeferred);
				  	});
			  	},function(){
			  		console.log("not valid username");
			  		alldeferred.reject("not valid username");
			  	});

			  	return alldeferred.promise;
		 }
	}
}])


datamodule.factory('DataObj',function(){
	var date_object = {
    		name:"",
    		empty:true,
    		moment: "",
				totalkar:0,
				date:"",
				posts_kar:0,
				comments_kar:0,
				cal_key:"",
				posts_count:0,
				posts_top_score:0,
				top_posts:"",
				comments_count:0,
				comments_top_score:0,
				top_comments:"",
				total_count:0,
				addPosts: function (post,prop){
					this["empty"] = false;
					this[prop+"_count"]++;
					this["total_count"]++;
					this[this.cal_key+"_"+prop].push(post);
					this[this.cal_key+"_all"].push(post);
					this[this.cal_key+"_"+prop+"_kar"] = this[this.cal_key+"_"+prop+"_kar"] + post.score;
					this[this.cal_key+"_total_kar"] = this[this.cal_key+"_total_kar"] + post.score;
					this[prop+"_avg"] = Math.round(this[this.cal_key+"_"+prop+"_kar"] /this[prop+"_count"]);
					this['total_avg'] = Math.round(this[this.cal_key+"_total_kar"]/this["total_count"]);

					if(post.score > this[prop+"_top_score"]){
						this[prop+"_top_score"] = post.score;
						this["top_"+prop] = post;
					}

				},
				addSub: function (post,prop){
					var subArray = this[this.cal_key+"_subs"];
					var sub = _.find(subArray, function(sub){ if(sub.name == post.subreddit){return sub;}});
					if(sub){
						sub.addPosts(post,prop);
					}

					else{
						var subobject = _.clone(sub_object);
						subobject.cal_key = this.cal_key;
	    			subobject['name'] = post.subreddit;
		    		subobject[post.subreddit+"_"+this.cal_key+"_posts"] = new Array();
						subobject[post.subreddit+"_"+this.cal_key+"_comments"] = new Array();
						subobject.addPosts(post,prop);
						subArray.push(subobject);
					}
					
				},
				getData: function (prop){
					return this[post.subreddit+"_"+this.cal_key+"_"+prop];
				}

    }

    var sub_object = {
    		name:"",
    		
				cal_key:"",
				posts_count:0,
				posts_top_score:0,
				top_posts:"",
				comments_count:0,
				comments_top_score:0,
				top_comments:"",
				total_count:0,
				addPosts: function (post,prop){
					this[prop+"_count"]++;
					this["total_count"]++;
					this[prop+"_kar"] += post.score;
					this['totalkar'] += post.score;
					this[this.name+"_"+this.cal_key+"_"+prop].push(post);
					this[prop+"_avg"] = Math.round(this[prop+"_kar"]/this[prop+"_count"]);
					this['total_avg'] = Math.round(this['totalkar']/this["total_count"]);

					if(post.score > this[prop+"_top_score"]){
						this[prop+"_top_score"] = post.score;
						this["top_"+prop] = post;
					}

				},
				getData: function (prop){
					return this[this.name+"_"+this.cal_key+"_"+prop];
				}
    }

    return {
    	create: function(name,moment,cal_key,date){	
    		dateobject = _.clone(date_object);
    		dateobject.cal_key = cal_key;
    		dateobject.name = name;
    		dateobject[cal_key+"_posts_kar"] = 0;
				dateobject[cal_key+"_comments_kar"] = 0;
				dateobject[cal_key+"_total_kar"] = 0;
    		dateobject[cal_key+"_posts"] = new Array();
				dateobject[cal_key+"_comments"] = new Array();
				dateobject[cal_key+"_subs"] = new Array();
				dateobject[cal_key+"_all"] = new Array();
  
    		if(moment){
    		dateobject.moment = moment;
    	  }
    		if(date){
    			dateobject.date = date;
    		}
				return dateobject;
			}
    }
})




datamodule.factory('Calendar', ['DataObj','UserData', function(DataObj,UserData){
		function stripNeg(val){
			return val *= -1;
		}


		function createCal(now,total_years){
			 var curyear = moment(now);
			UserData.calendar.total = DataObj.create("All Time",null,"all");
			for (var i = 0; i <= total_years+1; i++) {
		    if(i != 0){curyear.subtract(1, 'y')}
		    	var cal_key = curyear.format("YYYY");
		    	UserData.calendar.years[curyear.year()] = DataObj.create(curyear.format("YYYY"),curyear,cal_key);
		      createMonth(curyear);
			};
			
		}

		function createMonth(year){
			UserData.calendar.years[year.year()].months = {}
			var curmonthobj = UserData.calendar.years[year.year()].months;
			for (var i = 0; i < 12; i++) {
				var curmonth = moment({ y:year.year(), M:i});
				var cal_key = year.year()+"-"+i;
				UserData.calendar.years[year.year()].months[i] = DataObj.create(curmonth.format("MMMM"),curmonth,cal_key);
				createDays(curmonth);
			};
		}

		function createDays(curmonth){
			var dayofweek = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
			UserData.calendar.years[curmonth.year()].months[curmonth.month()].days = {}
			var curdaysobj =  UserData.calendar.years[curmonth.year()].months[curmonth.month()].days;
			var endofmonth = parseInt(moment(curmonth).endOf("month").format("DD"));
			for (var i = 1; i <= 31; i++) {
				var current_day = curmonth.day(i);
				var cal_key = curmonth.year()+"-"+curmonth.month()+"-"+i;
				curdaysobj[i] = DataObj.create(dayofweek[current_day.isoWeekday()-1],current_day,cal_key,i);
				if(i == endofmonth){
						break;
				}
			};
		}
	return{
		 createCalendar: function(term){
			var now = moment();
		  var original_date = moment(UserData.user_data.user_info.created, "X");
		  UserData.user_data.user_info.cakeday = original_date.format('MM[/]DD[/]YYYY');
		  var total_years = stripNeg(original_date.diff(now,"years"));
			createCal(now,total_years);
		 },
		 buildData:function(data,type){
		 	angular.forEach(data, function(post) {
		  	var post_date = moment(post.created, "X");
		  	var all_data_obj = UserData.calendar.total;
		    var year_data_obj = UserData.calendar.years[post_date.year()];
		    var month_data_obj = UserData.calendar.years[post_date.year()].months[post_date.month()];
		    var day_data_obj = UserData.calendar.years[post_date.year()].months[post_date.month()].days[post_date.date()];

		    _.each([all_data_obj, year_data_obj, month_data_obj,day_data_obj], function(obj){ 
		    	obj.addPosts(post,type);
		      obj.addSub(post,type);
		    });
			});
		 }
	}
}])

datamodule.factory('DataApi',['$q','UserData','RedditApi', function($q,UserData,RedditApi){
	return{
		setData:function(term){
			var deferred = $q.defer();
			RedditApi.getAllData(term).then(function(payload){
				deferred.resolve(payload);
			},function(reason){
				deferred.reject(reason)
			});
			return deferred.promise;
		},
		setActiveCalObj:function(calkey){
			if(calkey == 'all'){
				var ActiveCalObj = UserData.calendar.total;
			}
			return ActiveCalObj;
		}
	};
}]);
