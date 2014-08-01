exports.UExecute = function(parts) {
  return false;
};

exports.TExecute = function(parts, client) {
  var e, html, jade, nodeJade, options, s;
  nodeJade = true;
  try {
    s = require.resolve("jade");
    if (s.length === 0) {
      nodeJade = false;
    }
  } catch (_error) {
    e = _error;
    nodeJade = false;
  }
  if (nodeJade) {
    jade = require("jade");
    options = {};
    html = jade.render(parts[1], options);
    return client.write(html);
  } else {
    return client.write("404: JADE not available");
  }
};
