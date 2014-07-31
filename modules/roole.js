exports.UExecute = function(msg, parts, utils) {
  return false;
};

exports.TExecute = function(data, parts, utils, client) {
  var ast, compiler, css, e, nodeRoole, parser, s;
  nodeRoole = true;
  try {
    s = require.resolve("roole-compiler");
    if (s.length === 0) {
      nodeRoole = false;
    }
    s = require.resolve("roole-parser");
    if (s.length === 0) {
      nodeRoole = false;
    }
  } catch (_error) {
    e = _error;
    nodeRoole = false;
  }
  if (nodeRoole) {
    data = data.substring(6, data.length);
    parser = require('roole-parser');
    compiler = require('roole-compiler');
    ast = parser.parse(data);
    css = compiler.compile(ast);
    return client.write(css);
  } else {
    return client.write("404: Roole not available");
  }
};
