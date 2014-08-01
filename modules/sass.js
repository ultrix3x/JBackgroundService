exports.UExecute = function(parts) {
  return false;
};

exports.TExecute = function(parts, client) {
  var css, e, nodeSass, s, sass;
  nodeSass = true;
  try {
    s = require.resolve("node-sass");
    if (s.length === 0) {
      nodeSass = false;
    }
  } catch(_error) {
    e = _error;
    nodeSass = false;
  }
  if(nodeSass) {
    sass = require('node-sass');
    css = sass.renderSync({
      "data": parts[1]
    });
    return client.write(css);
  } else {
    return client.write("404: SASS not available");
  }
};
