datamodule.value('UserData', {
	user_name:"",
	calendar: { years:{}},
	user_data: {},
	beenEdited:0,
	datacomplete:false,
});


datamodule.value('ApiUrls', {
	amount: 100,
	user_url: "http://www.reddit.com/user/",
  user_posts: "/submitted/.json?limit=",
	user_info: "/about.json",
	user_comments:"/comments/.json?limit=",
	json_p:"/about.json",
	configUrls:function(term){
		this.user_posts = this.user_url+term+this.user_posts+this.amount;
		this.user_comments = this.user_url+term+this.user_comments+this.amount;
		this.user_info = this.user_url+term+this.user_info;
		this.json_p = this.user_url+term+this.user_info+"&jsonp=JSON_CALLBACK"
	}
});


datamodule.value('ActiveCalObj', {
	name:"",
	key: {},
	data: {},
});