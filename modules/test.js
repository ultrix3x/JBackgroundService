exports.UExecute = function(parts) {
  return "Test";
};

exports.TExecute = function(parts, client) {
  client.write("Test");
  client.end();
};
