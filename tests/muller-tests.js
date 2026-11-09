(function(){
  'use strict';
  const cases=[]; const assert=(name,condition,detail)=>cases.push({name,ok:!!condition,detail:detail||''});
  function run(){cases.length=0;
    try{const f=MathParser.compile('x^3-x-1');assert('Parser: polinomio',Math.abs(f(2).re-5)<1e-10,'f(2) = 5');}catch(e){assert('Parser: polinomio',false,e.message);}
    try{const f=MathParser.compile('2x+3(x+1)');assert('Parser: multiplicación implícita',Math.abs(f(2).re-13)<1e-10,'2x + 3(x + 1)');}catch(e){assert('Parser: multiplicación implícita',false,e.message);}
    try{const f=MathParser.compile('sin(pi/2)');assert('Parser: función trigonométrica',Math.abs(f(0).re-1)<1e-10,'sin(π/2) = 1');}catch(e){assert('Parser: función trigonométrica',false,e.message);}
    try{const f=MathParser.compile('sqrt(-4)');const z=f(0);assert('Parser: raíz compleja',Math.abs(z.re)<1e-10&&Math.abs(Math.abs(z.im)-2)<1e-10,'sqrt(-4) = 2i');}catch(e){assert('Parser: raíz compleja',false,e.message);}
    const roots=[{name:'Müller: x³ − x − 1',o:{expression:'x^3-x-1',x0:1,x1:1.5,x2:2},root:1.324717957},{name:'Müller: x² − 2',o:{expression:'x^2-2',x0:0,x1:1,x2:2},root:Math.sqrt(2)},{name:'Müller: x³ + 1',o:{expression:'x^3+1',x0:-2,x1:-1.5,x2:-.5},root:-1}];
    roots.forEach(t=>{try{const r=MullerMethod.run(Object.assign({tolerance:.0001,maxIterations:50},t.o));assert(t.name,r.converged&&Math.abs(r.root.re-t.root)<1e-3&&Math.abs(r.root.im)<1e-7,'Raíz calculada: '+r.rootText);}catch(e){assert(t.name,false,e.message);}});
    try{MathParser.compile('window.alert(1)');assert('Seguridad: rechaza código JavaScript',false,'La expresión fue aceptada.');}catch(e){assert('Seguridad: rechaza código JavaScript',true,'Expresión no permitida rechazada.');}
    return cases;
  }
  document.getElementById('run').addEventListener('click',()=>{const results=run();document.getElementById('results').innerHTML=results.map(t=>'<li class="'+(t.ok?'ok':'bad')+'"><b>'+(t.ok?'APROBADA':'FALLIDA')+'</b> · '+t.name+' <small>'+t.detail+'</small></li>').join('');const passed=results.filter(t=>t.ok).length;document.getElementById('summary').textContent=passed+' de '+results.length+' pruebas aprobadas.';document.getElementById('summary').className=passed===results.length?'ok':'bad';});
})();
