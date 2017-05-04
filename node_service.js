var Service = require('node-windows').Service; 
// Create a new service object
var svc = new Service({
  name       :'Qlik Node Reload Service'
 ,description: 'A node.js HTTP service to allow a reload on demand.'
 ,script     : 'D:\\QlikReloadService\\server.js'}); 
 
 // Listen for the "install" event, which indicates the
 // process is available as a service. 
 
 svc.on('install',function(){
     svc.start();
   });
  
  svc.install();
