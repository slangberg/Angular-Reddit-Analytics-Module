
app.filter('humanize', function() {
   return function(input, anniversary) {
      var original_date = moment(input, "X");
      var now = moment();
      var next_date = moment(original_date.month()+":"+original_date.day()+":"+":"+original_date.hour()+":"+original_date.minute(),"MM:DD:HH:mm");
      
      var full_age_string = moment.duration(original_date.diff(now, 'minutes'), "minutes").format(" y [Years] d [Days] h [Hours] m [Minutes Old]");
       date_string = original_date.format('h:mm a On MM/DD/YYYY'); 

      if(!anniversary){
         date_string = original_date.format('h:mm a On MM/DD/YYYY'); 
      }

      else{
          date_string =  full_age_string.replace("-", "");
      }

    return date_string;
  }
});

app.filter('percent', function() {
   return function(input,total) {
     var result = (input/ total) * 100;
     result = result.toFixed(2);
    return result;
  }
});