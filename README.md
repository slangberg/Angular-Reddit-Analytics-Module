# Angular Reddit Analytics Module
This module was designed to be that data component to be used in a full Reddit Analytics app. The Module is still in alpha, it has not gone through detailed testing or optimization so it is slow and limited in functionality and error reporting 

##Overview
All functions of this Module are set and accessed through the dataApi factory in the module, once a user name is provided the module will populate the UserData value with both basic data about the user from reddit and a calendar object that contains objects for each year, month and day for the duration of the users account history.

These date objects contain all the  post and comments from that period in object form as well as the  link, comment , total  and average karma earned during that period. Each of these objects also contain the list of subreddits objects that represent the subreddits posted in during that period. These subreddit objects contain their associated comments and post objects, along with their  link, comment , total  and average karma.  


##Setup
More coming soon


##Use
More coming soon
