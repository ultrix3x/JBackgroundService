exports.UExecute = function(parts) {
  return false;
};

exports.TExecute = function(parts, client) {
  var crypto, exec, fileName, fs, jsName, shasum;
  exec = require('child_process').exec;
  fs = require('fs');
  crypto = require('crypto');
  shasum = crypto.createHash('sha1');
  shasum.update(parts[1]);
  fileName = './modules/tmp/' + shasum.digest('hex');
  jsName = fileName + '.js';
  fileName = fileName + '.ts';
  return fs.writeFile(fileName, parts[1], 'utf-8', function(err) {
    var child;
    return child = exec('tsc ' + fileName, function(error, stdout, stderr) {
      var js, status;
      js = fs.readFileSync(jsName, 'utf-8');
      fs.unlinkSync(fileName);
      client.write(js);
      if (error !== null) {
        client.write('<!--');
        client.write('exec error: ' + error);
        client.write('<!--');
        status = false;
      } else {
        status = true;
      }
      client.end();
    });
  });
};
