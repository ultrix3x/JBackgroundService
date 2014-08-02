exports.UExecute = function(parts) {
  return false;
};

exports.TExecute = function(parts, client) {
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
    html = coffee.compile(parts[1]);
    client.write(html);
    client.end();
  } else {
    client.write("404: Coffee-Script not available");
    client.end();
  }
};
