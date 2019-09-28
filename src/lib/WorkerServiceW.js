/*global self*/
// Worker Side
    var idseq=1;
    var paths={},queue={},root=self;
    root.WorkerService={
        install: function (path, func) {
            paths[path]=func;
        },
        serv: function (path,func) {
            this.install(path,func);
        },
        ready: function () {
            root.WorkerService.isReady=true;
            self.postMessage({ready:true});
        },
        reverse: function (path, params) {
            var id=idseq++;
            return new Promise(function (succ,err) {
                queue[id]=function (e) {
                    if (e.status=="ok") {
                        succ(e.result);
                    } else {
                        err(e.error);
                    }
                };
                self.postMessage({
                    reverse: true,
                    id: id,
                    path: path,
                    params: params
                });

            });
        }
    };
    self.addEventListener("message", function (e) {
        var d=e.data;
        var id=d.id;
        var context={id:id};
        if (d.reverse) {
            queue[d.id](d);
            delete queue[d.id];
            return;
        }
        try {
            Promise.resolve( paths[d.path](d.params,context) ).then(function (r) {
                self.postMessage({
                    id:id, result:r, status:"ok"
                });
            },sendError);
        } catch (ex) {
            sendError(ex);
        }
        function sendError(e) {
            e=Object.assign({name:e.name, message:e.message, stack:e.stack},e||{});
            try {
                const j=JSON.stringify(e);
                e=JSON.parse(j);
            } catch(je) {
                e=e ? e.message || e+"" : "unknown";
                console.log("WorkerServiceW", je, e);
            }
            self.postMessage({
                id:id, error:e, status:"error"
            });
        }
    });
    root.WorkerService.install("WorkerService/isReady",function (){
        return root.WorkerService.isReady;
    });
    if (!root.console) {
        root.console={
            log: function () {
                root.WorkerService.reverse("console/log",Array.prototype.slice.call(arguments));
            }
        };
    }
    module.exports=self.WorkerService;
