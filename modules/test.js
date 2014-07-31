exports.UExecute = function(msg, parts, utils) {
  return "Test";
};

exports.TExecute = function(data, parts, utils, client) {
  return client.write("Test");
};
