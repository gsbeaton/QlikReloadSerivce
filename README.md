# QlikReloadService
A Node.js service that listens for a GET request and updates a CSV file with a Qlik time and flag.  Can be used with my Qlik HTTP button to schedule a reload.

This is a simple service that listens for a get request at 
http://domain.tld/api/s/{ControlFileName}

This is a lightweight web service utilising Node.js and Express. The service listens on port 8080 for a simple get request and sets a flag in a file which is later read by a scheduled QlikView reload. If the flag is set to 0, the reload process exits using minimal resources. If it is set to 1, the reload will continue. The process can be overridden to force a periodic reload to ensure the data remains fresh in the event that a user driven reload has not been triggered.

 1.	Download and install Node.JS for Windows.
 2.	Download the code base and extract to D:\QlikReloadService.
 3.	Open Windows Powershell and navigate to application folder: cd D:\QlikReloadService.
 4.	Initialise the file dependencies by typing npm install.
 5.	Now we need to install node-windows, which allows us to run Node.js as a Windows service.
    * Install the package globally: npm install -g node-windows.
    * Run the following command, npm link node-windows
 6. Finally, bring up the service by running node node_service.js.

