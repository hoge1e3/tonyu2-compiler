:start
call browserify src\browser\BuilderWorker.js -o test\fixture\BuilderWorker.js
call browserify src\browser\BuilderClient.js -o test\fixture\BuilderClient.js
call browserify src\browser\BuilderClient4Sys.js -o test\fixture\BuilderClient4Sys.js
call browserify src\browser\BuilderClientTest.js -o test\fixture\BuilderClientTest.js
call browserify src\browser\Debugger.js -o test\fixture\Debugger.js
call browserify src\runtime\TonyuRuntime.js -o test\fixture\TonyuRuntime.js
pause
goto start
