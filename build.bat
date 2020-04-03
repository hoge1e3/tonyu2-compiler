:start
call .\node_modules\.bin\browserify src\browser\BuilderWorker.js --no-detect-globals -o test\fixture\BuilderWorker.js
call .\node_modules\.bin\browserify src\browser\BuilderClient.js -s TonyuBuilderClient --no-detect-globals -o test\fixture\BuilderClient.js
call .\node_modules\.bin\browserify src\browser\BuilderClient4Sys.js -s TonyuBuilderClient --no-detect-globals -o test\fixture\BuilderClient4Sys.js
rem call browserify src\browser\BuilderClientTest.js --no-detect-globals -o test\fixture\BuilderClientTest.js
rem call browserify src\browser\Debugger.js --no-detect-globals -o test\fixture\Debugger.js
call .\node_modules\.bin\browserify src\runtime\TonyuRuntime.js --no-detect-globals -o test\fixture\TonyuRuntime.js
pause
goto start
