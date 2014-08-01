exports.UExecute = function(parts) {
  return false;
};

exports.TExecute = function(parts, client) {
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
    s = parts[1];
    console.log(s);
    return less.render(s, function(e, css) {
      return client.write(css);
    });
  } else {
    return client.write("404: LESS not available");
  }
};
