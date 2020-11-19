const { join, dirname, resolve } = require('path')
const fs = require('fs')

const realpathSync = fs.realpathSync.native || fs.realpathSync
const { S_IFMT, S_IFDIR, S_IFLNK } = fs.constants

const homePath = require('os').homedir()
let globalPaths = process.env.NODE_PATH
if (globalPaths) {
  globalPaths = globalPaths.replace(/^:/, '').split(':')
}

function findDependency(name, cwd) {
  let dir = resolve(cwd || process.cwd())

  // Check the current directory.
  let dep = getDir(join(dir, 'node_modules', name))
  if (dep) return dep

  // Check every parent directory.
  while ((dir = dirname(dir)) != homePath) {
    dep = getDir(join(dir, 'node_modules', name))
    if (dep) return dep
  }

  // Check every global directory.
  if (globalPaths) {
    return findGlobalDependency(name)
  }
}

function findGlobalDependency(name) {
  for (let i = 0; i < globalPaths.length; i++) {
    const dep = getDir(join(globalPaths[i], name))
    if (dep) return dep
  }
}

// Returns a directory path if one exists.
function getDir(path) {
  try {
    path = realpathSync(path)
    if ((fs.lstatSync(path).mode & S_IFMT) == S_IFDIR) {
      return path
    }
  } catch (e) {}
}

module.exports = findDependency
