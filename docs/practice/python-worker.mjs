// Python runs in a disposable worker, never on the interface thread.
let runtime;
self.onmessage = async ({data}) => {
  const {id,code,name,tests}=data;
  let scope,fn;
  try {
    if (!runtime) {
      self.postMessage({id,type:'loading'});
      const {loadPyodide}=await import('https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs');
      runtime=await loadPyodide({stdout:()=>{},stderr:()=>{}});
    }
    self.postMessage({id,type:'running'});
    scope=runtime.toPy({});
    await runtime.runPythonAsync(code,{globals:scope});
    fn=scope.get(name);
    if(typeof fn!=='function')throw new Error(`Define a function named ${name} before running the checks.`);
    const results=tests.map(test=>{
      // Pyodide maps JS undefined to Python None; JS null is a distinct JsNull.
      try {let actual=fn(test.input===null?undefined:test.input);if(actual&&typeof actual.toJs==='function'){const obj=actual;actual=String(obj);obj.destroy();}return {...test,actual:actual===undefined?null:actual,passed:actual===test.expected};}
      catch(e){return {...test,passed:false,error:String(e.message||e).slice(-1500)};}
    });
    self.postMessage({id,type:'results',results});
  } catch(e) {self.postMessage({id,type:'error',message:String(e.message||e).slice(-3000)});}
  finally {fn?.destroy?.();scope?.destroy?.();}
};
