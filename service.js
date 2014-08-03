// Include basic modules used by this service
var dgram = require("dgram");
var net = require("net");
var util = require("util");
var fs = require("fs");
// For backwards compatibility check for exists otherwise use path
if (typeof fs.exists === 'undefined') {
  fs = require("path");
}
// Define variables used
var verboseOutput = false;
var catchAllErrors = true;
var logCatchToError = false;
// Define the server container objects
var udpserver = {};
var tcpserver = {};
// Check if switches were used upon start
process.argv.forEach(function(val, index, array) {
  if (val === '-v') {
    verboseOutput = true;
  }
  if (val === '-E') {
    catchAllErrors = true;
  }
  if (val === '-e') {
    catchAllErrors = false;
  }
  if (val === '-EE') {
    return logCatchToError = true;
  }
});
// If the service should catch all exceptions
if(catchAllErrors) {
  // Then setup a event catcher for uncaughtException
  process.on("uncaughtException", function() {
    if(logCatchToError) {
      console.error("Error: An error occured");
    }
    if(verboseOutput) {
      return console.log("Log: An error occured");
    }
  });
}
// Load the service configuration
var config = JSON.parse(fs.readFileSync('./service.config', 'utf-8'));
// Define the variables used by the for-loop handling the configuration
var _i, _len;
for(_i = 0, _len = config.length; _i < _len; _i++) {
  // Define the variables used in the for-loop
  var server = config[_i];
  var port = server.port;
  var name = server.name;
  // Create a datagram socket
  udpserver[name] = dgram.createSocket("udp4");
  // Setup a message handler for the datagram socket
  udpserver[name].on("message", function(msg, rinfo) {
    // Define the variables used by the message handler
    var filename, moduleName, parts, s;
    // Convert the incoming message to a string
    s = msg.toString();
    // Split the incoming message into two parts
    parts = s.split(':', 2);
    // Make sure there are two parts
    if(parts.length == 1) {
      // If there is only one part then assign an empty string as the
      // second part
      parts[1] = '';
    }
    // Make sure the data in the second parts is correct
    parts[1] = data.substring((parts[0].length + 1), data.length);
    // Cleanup the moduleName
    moduleName = parts[0].replace(/[^a-zA-Z0-9\-\_]/g, '');
    // Create a filename for the module define by the moduleName
    filename = './modules/' + moduleName + '.js';
    // Check if the filename exists
    return fs.exists(filename, function(exists) {
      // Define the variable holding the module to use
      var modObj;
      if (exists) {
        // If the filename exist then require the filename and assign its
        // exports to modObj
        modObj = require(filename);
        autoReload.add(filename);
        // Return the result from the call to the function UExecute 
        // exported by the module
        return modObj.UExecute(parts);
      }
    });
  });
  // Setup a handler for listening on the datagram sockets
  udpserver[name].on("listening", function() {
    // Define the variable used by this function
    var address;
    // Fetch the address used
    address = this.address();
    if (verboseOutput) {
      // If verbose output is defined then print out the address info
      return console.log("UDP Server is now listening at " + address.address + ":" + address.port);
    }
  });
  // Bind the datagram socket to the port specified in the configuration
  udpserver[name].bind(port);
  
  // Create a tcp socket
  tcpserver[name] = net.createServer(function(client) {
    // Define character encoding to use (utf-8)
    client.setEncoding('utf-8');
    // Define a handler for end events
    client.on('end', function() {});
    // Define a handler for close events
    client.on('close', function() {});
    // Define a handler for data events
    return client.on('data', function(data) {
      var address, filename, moduleName, parts, tcpport;
      // Fetch the address used
      address = client.address();
      // Find which port is used
      tcpport = address.port;
      // Trin the incoming data
      data = data.trim();
      if (data === 'helo') {
        // If the incoming data is helo then return oleh
        client.write('oleh');
        client.end();
      } else if (data === 'hello') {
        // If the incoming data is hello then return olleh
        client.write('olleh');
        client.end();
      } else if (data.substring(0, 6) == 'queue:') {
        // Check if the incoming data is a queue request
        if(data.substring(6, 9) == 'add') {
          // Is it an add queue request then
          // create a new job
          var job = new BackgroundJob();
          // Start the job
          job.start(data.substring(10,data.length));
          // Return the id for the job
          client.write('id:'+job.id);
          client.end();
        } else if(data.substring(6, 9) == 'get') {
          // Is it an get queue request then
          // get the reuested job id
          var id = data.substring(10, data.length).split(':');
          // Get the job object from the jobList
          var job = jobList[id[1]];
          // Call the jobs wait function
          job.wait(client);
        } else if(data.substring(6, 11) == 'check') {
          // Is it an get queue request then
          // get the reuested job id
          var id = data.substring(12, data.length).split(':');
          // Get the job object from the jobList
          var job = jobList[id[1]];
          // Return the jobs current status
          client.write(job.status.toString());
          client.end();
        } else {
          client.write('500: Unknown queue request');
          client.end();
        }
      } else {
        // Split the incoming data into two parts
        parts = data.split(':', 2);
        // Make sure there are two parts
        if(parts.length == 1) {
          // If there is only one part then assign an empty string as the
          // second part
          parts[1] = '';
        }
        // Make sure the data in the second parts is correct
        parts[1] = data.substring((parts[0].length + 1), data.length);
        // Cleanup the moduleName
        moduleName = parts[0].replace(/[^a-zA-Z0-9\-\_]/g, '');
        // Create a filename for the module define by the moduleName
        filename = './modules/' + moduleName + '.js';
        // Check if the filename exists
        return fs.exists(filename, function(exists) {
          // Define the variable holding the module to use
          var modObj;
          if (exists) {
            // If the filename exist then require the filename and assign its
            // exports to modObj
            modObj = require(filename);
            autoReload.add(filename);
            // Make a call to the function TExecute exported by the module
            modObj.TExecute(parts, client);
          } else {
            // Return an error message if a module wasn't found
            client.write('400: Unknown request');
            client.end();
          }
        });
      }
    });
  });
  // Setup a handler for listening on the datagram sockets
  tcpserver[name].listen(port, function() {
    // Define the variable used by this function
    var address;
    // Fetch the address used
    address = this.address();
    if (verboseOutput) {
      // If verbose output is defined then print out the address info
      return console.log('TCP Server listening to port ' + address.port);
    }
  });
}

// Define the jobList
var jobList = {};
// Define the jobID variable
var jobID = 0;

// Define the BackgroundJob class
function BackgroundJob() {
  // Initial status is set to 0
  this.status = 0;
  // The output content for the job is initially an empty string
  this.content = '';
  // The jobs id is set to 0 before start
  this.id = 0;
}

// Define the prototypes for the BackgroundJob
BackgroundJob.prototype = {
  // The start function
  start: function(data) {
    // Get a jobID
    this.id = (++jobID);
    // Change the jobs status to 1
    this.status = 1;
    // Add this job to the jobList
    jobList[this.id] = this;
    // Split the incoming data into two parts
    var parts = data.split(':', 2);
    // Get the modules name
    var moduleName = parts[0];
    // Cheanup the modules name
    moduleName = moduleName.replace(/[^a-zA-ZA0-9\-\_]/g, '');
    // Make sure the data in the second parts is correct
    parts[1] = data.substring((parts[0].length + 1), data.length);
    // Create a filename for the module define by the moduleName
    var filename = './modules/'+moduleName+'.js';
    // Define a variable that points to this but is usable later on as well
    var self = this;
    // Call a setTimeout to make it a "background process"
    setTimeout(function() {
      // Check if the filename exists
      return fs.exists(filename, function(exists) {
        // Define the variable holding the module to use
        var modObj;
        if (exists) {
          // If the filename exist then require the filename and assign its
          // exports to modObj
          modObj = require(filename);
          autoReload.add(filename);
          // Make a call to the function TExecute exported by the module
          // Note that the client socket is replaced by self
          modObj.TExecute(parts, self);
        } else {
          // Return an error message if a module wasn't found
          self.write('400: Unknown request');
          self.end();
        }
      });
    }, 1);
    // Return the job id
    return this.id;
  },
  // The wait function
  wait: function(client) {
    // Checks if the jobs status is set to 2
    if(this.status == 2) {
      // The job is done so write the content to the client socket
      client.write(this.content);
      client.end();
    } else {
      // The job is not done so wait 1 millisecond and check again
      var self = this;
      setTimeout(function() {
        self.wait(client);
      }, 1);
    }
  },
  // The write function
  write: function(data) {
    // Collect the data from the module.
    // The module believes this is a socket.
    this.content += data;
  },
  // The end function
  end: function() {
    // Change the status for the job to 2 which means that the job has
    // finnished.
    // The module believes this is a socket.
    this.status = 2;
  }
};

// Class for managing changes in the modules
function AutoReloadModule(autoStart) {
  // Define a list for the loaded modules
  this.moduleList = {};
  // The interval. Keeps track of start and stop.
  this.interval = null;
  // If true is given in the constructor then autostart
  if(autoStart !== false) {
    // Call start() to start the auto reloader
    this.start();
  }
}
// Define prototypes
AutoReloadModule.prototype = {
  // Start function
  start: function() {
    // If interval != null then auto reloader is acitve
    if(this.interval !== null) {
      // Stop the auto reloader
      clearInterval(this.interval);
    }
    // Know who we are
    var self = this;
    // Start a new interval
    this.interval = setInterval(function() {
      // Call the check function every 10 seconds
      self.check();
    }, 10000);
  },
  // Stop function
  stop: function() {
    // If the interval != null then auto reloader is active
    if(this.interval !== null) {
      // Clear the interval
      clearInterval(this.interval);
      // Set the local variable to null to indicate that we have stopped
      this.interval = null;
    }
  },
  // Check function
  check: function() {
    // Know who we are
    var self = this;
    // Loop through all items in the module list
    for(var key in this.moduleList) {
      // Assign the info about the module to the variable info
      var info = this.moduleList[key];
      // Check the file stats for the filename
      fs.stat(info.filename, function(err, stat) {
        // If the file has changed since added then unload
        if(stat.mtime.toString() != info.filetime) {
          // If the module exported an unload function
          if(info.exports.Unload) {
            // ... then call it
            info.exports.Unload();
          }
          // Get the name for the module
          var name = require.resolve(info.filename);
          // Delete the module from the require.cache
          delete require.cache[name];
          // Delete the module from the auto reloaders moduleList
          delete self.moduleList[key];
        }
      });
    }
  },
  // Add a new module
  add: function(filename, undef) {
    // Create a key from the filename
    var key = filename.replace(/[^a-zA-Z0-9\-\_]/g, '');
    // Know who we are
    var self = this;
    // If the module hasn't been added then add it
    if(this.moduleList[key] == undef) {
      // Get the full filename for the module
      var realname = require.resolve(filename);
      // Check if the filename exists
      fs.exists(realname, function(exists) {
        // If it exists
        if(exists) {
          // .. get the file stats
          fs.stat(realname, function(err, stats) {
            // Add the module info to the moduleList
            self.moduleList[key] = {"filename": realname, "filetime": stats.mtime.toString(), "exports": require(realname)};
          });
        }
      });
    }
  }
}
// Create an instance of the AutoReloadModule and autostart it.
var autoReload = new AutoReloadModule(true);