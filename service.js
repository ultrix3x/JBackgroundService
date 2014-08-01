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
        return client.write('\n');
      } else if (data === 'hello') {
        // If the incoming data is hello then return olleh
        client.write('olleh');
        return client.write('\n');
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
            // Make a call to the function UExecute exported by the module
            modObj.TExecute(parts, client);
            return client.write('\n');
          } else {
            // Return an error message if a module wasn't found
            client.write('400: Unknown request');
            return client.write('\n');
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
