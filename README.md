# tonyu2-compiler
Compiler of Tonyu2 language, used in [Tonyu System 2](https://github.com/hoge1e3/Tonyu2), a game engine.

# Command line usage

~~~
node index.js <project-directory> [-r] [-d]
~~~
- `-r` Run compiled *.js(creates `Main` object)
- `-d` Run and watch *.tonyu files, if modified, compile again and create another `Main` object

# Build(for browser)

The following files in `test/fixture/` are built by `built.bat`, required node.js libraries: `browserify`.

- BuilderWorker.js - Web-Worker which compiles *.tonyu -> *.js
- BuilderClient.js - A minimum browser-side library which calls BuilderWorker.
- BuliderClient4Sys.js - BuilderClient+Debugger Utils, used in [Tonyu System 2](https://github.com/hoge1e3/Tonyu2)
- TonyuRuntime.js - Runtime library for Tonyu class definition, threading and iteration. Required to run generated *.js files.
