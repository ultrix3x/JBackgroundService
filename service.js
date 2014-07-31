var catchAllErrors, config, counter, dgram, fs, logCatchToError, name, net, port, server, tcpserver, udpserver, util, verboseOutput, _i, _len;

dgram = require("dgram");

net = require("net");

util = require("util");

fs = require("fs");

if (typeof fs.exists === 'undefined') {
  fs = require("path");
}

counter = 0;

verboseOutput = false;

catchAllErrors = true;

logCatchToError = false;

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

udpserver = {};

tcpserver = {};

if (catchAllErrors) {
  process.on("uncaughtException", function() {
    if (logCatchToError) {
      console.error("Error: An error occured");
    }
    if (verboseOutput) {
      return console.log("Log: An error occured");
    }
  });
}

config = JSON.parse(fs.readFileSync('./service.config', 'utf-8'));

for (_i = 0, _len = config.length; _i < _len; _i++) {
  server = config[_i];
  port = server.port;
  name = server.name;
  udpserver[name] = dgram.createSocket("udp4");
  udpserver[name].on("message", function(msg, rinfo) {
    var filename, moduleName, parts, s;
    s = msg.toString();
    parts = s.split(':');
    moduleName = parts[0].replace(/[^a-zA-Z0-9\-\_]/g, '');
    if (moduleName === 'getCounter') {

    } else {
      filename = './modules/' + moduleName + '.js';
      return fs.exists(filename, function(exists) {
        var modObj;
        if (exists) {
          modObj = require(filename);
          counter++;
          return modObj.UExecute(msg, parts, util);
        } else {
          return counter++;
        }
      });
    }
  });
  udpserver[name].on("listening", function() {
    var address;
    address = this.address();
    if (verboseOutput) {
      return console.log("UDP Server is now listening at " + address.address + ":" + address.port);
    }
  });
  udpserver[name].bind(port);
  tcpserver[name] = net.createServer(function(client) {
    client.setEncoding('utf-8');
    client.on('end', function() {});
    client.on('close', function() {});
    return client.on('data', function(data) {
      var address, filename, moduleName, parts, udpport;
      address = client.address();
      udpport = address.port;
      data = data.trim();
      if (data === 'helo') {
        client.write('oleh');
        return client.write('\n');
      } else if (data === 'hello') {
        client.write('olleh');
        return client.write('\n');
      } else if (data === 'getCounter') {
        client.write('Counter: ' + counter);
        return client.write('\n');
      } else {
        parts = data.split(':');
        moduleName = parts[0].replace(/[^a-zA-Z0-9\-\_]/g, '');
        filename = './modules/' + moduleName + '.js';
        return fs.exists(filename, function(exists) {
          var modObj;
          if (exists) {
            modObj = require(filename);
            counter++;
            modObj.TExecute(data, parts, util, client);
            return client.write('\n');
          } else {
            client.write('400: Unknown request');
            return client.write('\n');
          }
        });
      }
    });
  });
  tcpserver[name].listen(port, function() {
    var address;
    address = this.address();
    if (verboseOutput) {
      return console.log('TCP Server listening to port ' + address.port);
    }
  });
}
