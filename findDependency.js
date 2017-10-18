
var path = require('path');
var fs = require('fsx');

var homePath = require('os').homedir();
var globalPaths = process.env.NODE_PATH;
if (globalPaths) {
  globalPaths = globalPaths.replace(/^:/, '').split(':');
  console.log('globalPaths = ' + globalPaths.join(', '))
}

function findDependency(name, cwd) {
  var dir = cwd || process.cwd();

  // Check the current directory.
  var dep = path.join(dir, 'node_modules', name);
  console.log('Checking: ' + dep);
  if (fs.isDir(dep)) return dep;

  // Check every parent directory.
  while ((dir = path.dirname(dir)) !== homePath) {
    dep = path.join(dir, 'node_modules', name);
    console.log('Checking: ' + dep);
    if (fs.isDir(dep)) return dep;
  }

  // Check every global directory.
  if (globalPaths) {
    return findGlobalDependency(name);
  }
}

function findGlobalDependency(name) {
  for (var i = 0; i < globalPaths.length; i++) {
    dep = path.join(globalPaths[i], name);
    console.log('Checking: ' + dep);
    if (fs.isDir(dep)) return dep;
  }
}

module.exports = findDependency;
