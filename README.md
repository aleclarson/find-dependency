
# find-dependency v1.0.2 

Find the path to the package that will be used by `require`.

```js
const findDependency = require('find-dependency');

// Search current directory, all parent directories, and all $NODE_PATH directories.
const packagePath = findDependency('foo', process.cwd());
```

NOTE: The second argument is optional (defaults to `process.cwd()`).

### How it works

When you call `findDependency('foo', __dirname)`:

- Check if `__dirname/node_modules/foo` is a directory
- Check if `__dirname/../node_modules/foo` is a directory
- Continue adding `..` until the home directory is checked
- Check every directory in `process.env.NODE_PATH` (eg: `global_path/foo`)
- At any point, if the checked path exists, return it

This simulates how `require` resolves the package path, before checking the `main` field of its `package.json` file.

