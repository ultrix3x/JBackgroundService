exports.UExecute = function(parts) {
  return false;
};

exports.TExecute = function(parts, client) {
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
    parser = require('roole-parser');
    compiler = require('roole-compiler');
    ast = parser.parse(parts[1]);
    css = compiler.compile(ast);
    return client.write(css);
  } else {
    return client.write("404: Roole not available");
  }
};
