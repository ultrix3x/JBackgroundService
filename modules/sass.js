exports.UExecute = function(msg, parts, utils) {
  return false;
};

exports.TExecute = function(data, parts, utils, client) {
  var css, e, nodeSass, s, sass;
  nodeSass = true;
  try {
    s = require.resolve("node-sass");
    if (s.length === 0) {
      nodeSass = false;
    }
  } catch (_error) {
    e = _error;
    nodeSass = false;
  }
  if (nodeSass) {
    sass = require('node-sass');
    data = data.substring(5, data.length);
    css = sass.renderSync({
      "data": data
    });
    return client.write(css);
  } else {
    return client.write("404: SASS not available");
  }
};
