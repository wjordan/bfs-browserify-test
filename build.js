var fs = require('fs');
if (!fs.existsSync('./build')) {
  fs.mkdirSync('./build');
}

var b = require('browserify')(['./browser.js'], {
  builtins: {
    "fs": require.resolve("bfs-fs"),
    "path": require.resolve("browser-path"),
    "buffer": require.resolve("browser-buffer")
  },
  insertGlobalVars: {
    "process": function () { return "require('browser-process')" },
    'Buffer': function () { return "require('browser-buffer').Buffer" }
  },
  debug: true,
  // REQUIRED, otherwise browserify will replace internal references to things to
  // other things. Also causes wrappers to fail!
  noParse: ["browserfs", "browser-buffer"]
}).bundle();
b.pipe(fs.createWriteStream('./build/bfs-test.js'));
b.on('end', function() {
  var UglifyJS = require("uglify-js");
  var result = UglifyJS.minify("./build/bfs-test.js", {
    outSourceMap: "bfs-test.min.js.map"
  });
  fs.writeFileSync('./build/bfs-test.min.js', result.code);
  fs.writeFileSync('./build/bfs-test.min.js.map', result.map);
});
