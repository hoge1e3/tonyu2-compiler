export         function extractSrcFromFunction(f,startMark,endMark) {
            startMark=startMark||/(.|\s)*WORKER[_]SRC[_]BEGIN\*\//;
            endMark=endMark||/\/\*WORKER[_]SRC[_]END(.|\s)*/;
            var src=(""+f).replace(startMark,"").replace(endMark,"");
            return src;
        }
export        function createFromFunction(f,startMark,endMark) {
            var src=this.extractSrcFromFunction(f,startMark,endMark);
            return this.createFromString(src);
        }
export         function urlFromString(src) {
            return URL.createObjectURL( new Blob([src] ,{type:"text/javascript"} ));
        }
export         function createFromString(src) {
            var url=this.urlFromString(src);
            return new Worker(url);
        }
export        function requireUrl(name) {
            return "worker.js?main="+name;
        }
export        function requireMod(name) {
            return new Worker(this.requireUrl(name));
        }
export      function create(src) {
            if (typeof src==="string") {
                return this.require(src);
            } else if (typeof src==="function") {
                return this.createFromFunction(src);
            }
            throw new Error("Invaluid src type "+src);
        }
