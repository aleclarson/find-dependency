
const path = require('path');
const fs = require('fs');

const {S_IFMT, S_IFDIR, S_IFLNK} = fs.constants;

const homePath = require('os').homedir();
let globalPaths = process.env.NODE_PATH;
if (globalPaths) {
  globalPaths = globalPaths.replace(/^:/, '').split(':');
}

function findDependency(name, cwd) {
  let dir = cwd || process.cwd();

  // Check the current directory.
  let dep = getDir(path.join(dir, 'node_modules', name));
  if (dep) return dep;

  // Check every parent directory.
  while ((dir = path.dirname(dir)) != homePath) {
    dep = getDir(path.join(dir, 'node_modules', name));
    if (dep) return dep;
  }

  // Check every global directory.
  if (globalPaths) {
    return findGlobalDependency(name);
  }
}

function findGlobalDependency(name) {
  for (let i = 0; i < globalPaths.length; i++) {
    const dep = getDir(path.join(globalPaths[i], name));
    if (dep) return dep;
  }
}

// Returns a directory path if one exists.
function getDir(initialPath) {
  let path = initialPath;
  let mode = getMode(path);

  let loops = 0;
  while (mode == S_IFLNK) {
    path = fs.readlinkSync(path);
    mode = getMode(path);
    if (++loops > 100) {
      throw Error('Symlink caused infinite recursion: ' + initialPath);
    }
  }

  if (mode == S_IFDIR) {
    return path;
  }
}

function getMode(path) {
  try {
    return fs.lstatSync(path).mode & S_IFMT;
  } catch (e) {}
}

module.exports = findDependency;
