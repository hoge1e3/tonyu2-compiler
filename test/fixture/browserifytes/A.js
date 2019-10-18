const B=require("./B");
module.exports={
  A:()=>{
	B.b();
	B.b();
  }
};
if (typeof window!=="undefined") window.A=module.exports;
