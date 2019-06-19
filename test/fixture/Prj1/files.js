function loadFiles(dir){
   if (WebSite.isNW) return;
	dir.rel('res.json').obj({"images":[],"sounds":[]});
	dir.rel('options.json').obj({"compiler":{"defaultSuperClass":"Actor","commentLastPos":true,"diagnose":false},"run":{"mainClass":"Main","bootClass":"Boot","globals":{"$defaultFPS":60}},"kernelEditable":false,"plugins":{}});
}