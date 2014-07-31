exports.UExecute = function(msg, parts, utils) {
  return false;
};

exports.TExecute = function(data, parts, utils, client) {
  var e, less, nodeLess, s;
  nodeLess = true;
  try {
    s = require.resolve("less");
    if (s.length === 0) {
      nodeLess = false;
    }
  } catch (_error) {
    e = _error;
    nodeLess = false;
  }
  if (nodeLess) {
    less = require("less");
    data = data.substring(5, data.length);
    return less.render(data, function(e, css) {
      return client.write(css);
    });
  } else {
    return client.write("404: LESS not available");
  }
};
