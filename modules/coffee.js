exports.UExecute = function(msg, parts, utils) {
  return false;
};

exports.TExecute = function(data, parts, utils, client) {
  var coffee, e, html, nodeCoffee, s;
  nodeCoffee = true;
  try {
    s = require.resolve("coffee-script");
    if (s.length === 0) {
      nodeCoffee = false;
    }
  } catch (_error) {
    e = _error;
    nodeCoffee = false;
  }
  if (nodeCoffee) {
    coffee = require("coffee-script");
    data = data.substring(7, data.length);
    html = coffee.compile(data);
    return client.write(html);
  } else {
    return client.write("404: Coffee-Script not available");
  }
};
