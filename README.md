# Angular Reddit Analytics Module
This module was designed to be that data component to be used in a full Reddit Analytics app. The Module is still in alpha, it has not gone through detailed testing or optimization so it is slow and limited in functionality and error reporting 

##Overview
All functions of this Module are set and accessed through the dataApi factory in the module, once a user name is provided the module will populate the UserData value with both basic data about the user from reddit and a calendar object that contains objects for each year, month and day for the duration of the users account history.

These date objects contain all the  post and comments from that period in object form as well as the  link, comment , total  and average karma earned during that period. Each of these objects also contain the list of subreddits objects that represent the subreddits posted in during that period. These subreddit objects contain their associated comments and post objects, along with their  link, comment , total  and average karma.  


##Setup

###Module Dependencies   
* [jQuery](http://jquery.com/)
* [AngularJS](https://github.com/angular/angular.js)
* [Moment.js](https://github.com/moment/moment/)
* [Moment Duration Format](https://github.com/jsmreese/moment-duration-format)


###Including The Module In Your App
In the section of your app that handles script include the module files and its dependencies
```html
<script src=".../jquery.js"></script>
<script src=".../angular.js"></script>
<script src=".../dist/reddit_data.js"></script>
<script src=".../dist/plugins/moment-duration-format.js"></script>
```
In your app be sure to include the module with the name **reddit-data-module**
```JavaScript
var app = angular.module('yourapp', ['reddit-data-module']);
```

###How To Use Module
All functions of this Module are set and accessed through the dataApi factory in the module, all the restived data is stored in the modules UserData value store, a break down of the data structure can be found in the UserData Break Down Section below

#####DataApi.setData(username)#####
The first step is to set the user name with the setData	method
```JavaScript
DataApi.setData(username).then(function(payload){
    //On sucess payload will be the compiled UserData value in the module
},
function(reason){
    //On fail reason will the error descritption
});
```
#####DataApi.setActiveCalObj(String or array)#####
This method will return a slected data object, ehtier provide the string all for all data object or an one, two or three key array that corrsponds the the date period you are looking for
```JavaScript
var result = DataApi.setActiveCalObj('all');
var result = DataApi.setActiveCalObj([year,month,day]);
```

###UserData Break Down
The UserData has nested objects that reprsent the data retrived from the reddit api these include the following 

**User Data Object Break Down**
```JavaScript
user_data {
    name: "USERNAME",
    totalkar: "total karam from reddit",
    user_info:{//comes from reddit api json blob
        cakeday: "MM/DD/YYYY",
        comment_karma: int,
        created: date int,
        created_utc:  date int,
        has_verified_email: bool,
        hide_from_robots: bool,
        id: "string",
        is_friend:  bool,
        is_gold:  bool,
        is_mod:  bool,
        link_karma:  bool,
        name: "string"
    }
}
```
**Calendar Object Break Down**
```JavaScript
calendar:{
    total:{
        //date object values
    },
    years:{
        YYYY:{
            //date object values
            months:{
                0-11:{
                    //date object values
                    days:{
                        1-31:{
                         //date object values
                        }
                    }
                }
            }
        }
    }
}
```

**Module Date Object Break Down**
```JavaScript
dateobject: {
    calkeyprefix_comments: Array[],
    calkeyprefix_comments_kar: int,
    calkeyprefix_posts: Array[],
    calkeyprefix_posts_kar: int,
    calkeyprefix_subs: Array[],
    calkeyprefix_total_kar: int,
    cal_key: "String",
    comments_avg: int,
    comments_count: int,
    comments_kar: int,
    comments_top_score: int,
    date: "string" or null,
    empty: bool,
    moment: moment object,
    name: "String",
    posts_avg: int,
    posts_count: int,
    posts_kar: int,
    posts_top_score: int,
    top_comments: Comment Object{},
    top_posts: Post Object{},
    total_avg: int,
    total_count: int,
    totalkar: int
}
```



