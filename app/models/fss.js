var fs = require('fs');


var update = function(config, callback){
  // Read the data from the qlikview CSV file.
  fs.readFile(
     config.filePath + config.controlFile
    ,'utf8'
    , (err, data) => {
        if (err) throw err;
  
        var lines    = data.trim().split('\n');
        var lastLine = lines.slice(-1)[0];
        var col      = lastLine.split(',');  
        
        var AccessTime          = col[0];
        var PreviousAccessTime  = col[1];
        var ReloadFlag          = col[2];

        fs.readFile(  //read in the template file
           config.filePath + config.templateFile
          ,'utf8'
          , (err, tmpl) => {
              if (err) throw err;
              
              var d = new Date();
              var n = unixToQlikTime(d.getTime());
            
              var newStream = tmpl.replace("{AccessTime}", n)
                                  .replace("{PreviousAccessTime}", AccessTime)
                                  .replace("{ReloadFlag}",1);
              
              fs.writeFile(
                config.filePath + config.controlFile //save the new file
                , newStream
                , function(err) {
                  if(err) {
                    return console.log(err);
                  }

                 response = {message: 'The reload was scheduled successfully.', success: true, PreviousAccessTime: Number(AccessTime), AccessTime: n};
                 callback(response);
                 });
            }
         );

      }
  );

};

/*
| -------------------------------------------------------------------
|  Qlik to Unix time 
| -------------------------------------------------------------------
|  Convert a Qlik timestamp to a Unix time.
|  Credit to Ralf Belcher:
|      https://gist.github.com/ralfbecher/3dd6fa134eefacb18f40
|
*/
var qlikToUnixTime = function(n){
    var d = new Date((n - 25569)*86400*1000);
    // since date was created in UTC shift it to the local timezone
    d.setTime( d.getTime() + d.getTimezoneOffset()*60*1000 );
    return d;
};

/*
| -------------------------------------------------------------------
|  Unix to Qlik time 
| -------------------------------------------------------------------
|  Convert a unix timestamp to a Qlik timestamp.
|
*/
var unixToQlikTime = function(){
    a      = new Date(1900,0,1);  //this is Qlik's Epoch date.
    b      = new Date();
    offset = 2; //QlikView 12.2 - epoch seems to be 30/12/1899.

    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    var time = ((b.getHours() * 60 * 60) + (b.getMinutes() * 60) + b.getSeconds()) *1000 / (24*60*60*1000);
    return ((utc2 - utc1) /(24*60*60*1000))+offset+time;
};


module.exports = {
  update : update,
};