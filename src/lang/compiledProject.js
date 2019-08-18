	const A=require("../lib/assert");
	const root=require("../lib/root");
	const document=root.document;
	var CPR=module.exports=function (ns, url) {
		// ns:String url:String(for URL) / File
		//A.is(arguments,[String,String]);
		return {
			getNamespace:function () {return ns;},
			sourceDir: function () {return null;},
			getDependingProjects: function () {return [];},// virtual
			loadDependingClasses: function (ctx) {
				//Same as projectCompiler /TPR/this/ (XXXX)
				var task=Promise.resolve();
				var myNsp=this.getNamespace();
				this.getDependingProjects().forEach(function (p) {
					if (p.getNamespace()==myNsp) return;
					task=task.then(function () {
						return p.loadClasses(ctx);
					});
				});
				return task;
			},
			loadClasses: function (ctx) {
				console.log("Loading compiled classes ns=",ns,"url=",url);
				var src = url;//+(WebSite.serverType==="BA"?"?"+Math.random():"");
				//var u=window.navigator.userAgent.toLowerCase();
				/*if (WebSite.isNW && u.indexOf("mac")!=-1) {
					//Resolved in WebSite
					src = "/www/Kernel/js/concat.js";
				}*/
				var t=this;
				return this.loadDependingClasses(ctx).then(function () {
					if (typeof src==="string") {
						if (document) {
							return t.requirejs(src);
						}
						/*global importScripts*/
						return importScripts(src);
					} else {
						if (typeof global!=="undefined" && global.require) {
							return global.require(src.path());
						} else {
							/*global URL*/
							return t.requirejs(URL.createObjectURL(src.getBlob()));
						}
					}
				}).then(function () {
					console.log("Done Loading compiled classes ns=",ns,"url=",src);//,Tonyu.classes);
				});
			},
			requirejs: function (src) {
				return new Promise(function (s) {
					var head = document.getElementsByTagName("head")[0] || document.documentElement;
					var script = document.createElement("script");
					if (root.tonyu_app_version) src+="?"+root.tonyu_app_version;
					script.src = src;
					var done = false;
					script.onload = script.onreadystatechange = function() {
						if ( !done && (!this.readyState ||
								this.readyState === "loaded" || this.readyState === "complete") ) {
							done = true;
							console.log("Done load ",src);
							script.onload = script.onreadystatechange = null;
							if ( head && script.parentNode ) {
								head.removeChild( script );
							}
							s();
						}
					};
					head.insertBefore( script, head.firstChild );
				});
			}
		};
	};
