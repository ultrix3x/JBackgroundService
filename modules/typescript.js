exports.UExecute = function(msg, parts, utils) {
  return false;
};

exports.TExecute = function(data, parts, utils, client) {
  var crypto, exec, fileName, fs, jsName, shasum;
  exec = require('child_process').exec;
  fs = require('fs');
  crypto = require('crypto');
  shasum = crypto.createHash('sha1');
  shasum.update(data);
  fileName = './modules/tmp/' + shasum.digest('hex');
  jsName = fileName + '.js';
  fileName = fileName + '.ts';
  data = data.substring(11, data.length);
  return fs.writeFile(fileName, data, 'utf-8', function(err) {
    var child;
    return child = exec('tsc ' + fileName, function(error, stdout, stderr) {
      var js, status;
      js = fs.readFileSync(jsName, 'utf-8');
      client.write(js);
      if (error !== null) {
        client.write('<!--');
        client.write('exec error: ' + error);
        client.write('<!--');
        status = false;
      } else {
        status = true;
        fs.unlinkSync(fileName);
      }
      return status;
    });
  });
};
