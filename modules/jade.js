exports.UExecute = function(msg, parts, utils) {
  return false;
};

exports.TExecute = function(data, parts, utils, client) {
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
    data = data.substring(5, data.length);
    html = jade.render(data, options);
    return client.write(html);
  } else {
    return client.write("404: JADE not available");
  }
};
