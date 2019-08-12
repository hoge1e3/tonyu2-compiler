var tmp = require('tmp');
var fs = require('fs');

tmp.file({postfix:".js"},function (err, path, fd, cleanupCallback) {
    if (err) throw err;

    console.log("File: ", path);
    console.log("Filedescriptor: ", fd);
    fs.writeFileSync(path, "Hello world!");
});
