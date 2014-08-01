exports.UExecute = function(parts) {
  return "Test";
};

exports.TExecute = function(parts, client) {
  return client.write("Test");
};
