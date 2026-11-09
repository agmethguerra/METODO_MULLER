/*
 * MÜLLER CHALLENGE - Método numérico de Müller
 * Depende de math-parser.js.
 * Expone: window.MullerMethod.createSession(), run(), next(), calculateNext()
 */
(function (global) {
  "use strict";
  const C = global.MathParser.complex;
  const add=C.add, sub=C.sub, mul=C.mul, div=C.div, neg=C.neg, abs=C.abs, sqrt=C.sqrt;
  const fmt = z => {
    const r = Math.abs(z.re) < 1e-14 ? 0 : z.re;
    const i = Math.abs(z.im) < 1e-14 ? 0 : z.im;
    if (i === 0) return Number(r.toPrecision(12)).toString();
    if (r === 0) return Number(i.toPrecision(12)).toString() + "i";
    return Number(r.toPrecision(12)) + (i < 0 ? " - " : " + ") + Number(Math.abs(i).toPrecision(12)) + "i";
  };
  const asComplex = n => typeof n === "number" ? {re:n,im:0} : {re:Number(n.re),im:Number(n.im)};
  const scale = (z,k) => ({re:z.re*k,im:z.im*k});
  const finite = z => Number.isFinite(z.re) && Number.isFinite(z.im);

  function calculateNext(fn, points) {
    const [x0,x1,x2] = points.map(asComplex);
    const h0 = sub(x1,x0), h1 = sub(x2,x1);
    if (abs(h0) < 1e-14 || abs(h1) < 1e-14) throw new Error("Hay valores iniciales repetidos o demasiado cercanos.");
    const f0=fn(x0), f1=fn(x1), f2=fn(x2);
    const delta0=div(sub(f1,f0),h0);
    const delta1=div(sub(f2,f1),h1);
    const d=div(sub(delta1,delta0),add(h1,h0));
    const a=d;
    const b=add(delta1,mul(h1,d));
    const c=f2;
    const discriminant=sub(mul(b,b),scale(mul(a,c),4));
    const rootD=sqrt(discriminant);
    const denPlus=add(b,rootD), denMinus=sub(b,rootD);
    const denominator=abs(denPlus)>=abs(denMinus)?denPlus:denMinus;
    if (abs(denominator)<1e-14) throw new Error("El denominador es inestable; prueba otros valores iniciales.");
    const x3=sub(x2,div(scale(c,2),denominator));
    if (!finite(x3)) throw new Error("La aproximación produjo un valor no finito.");
    const fx3=fn(x3);
    const error=abs(sub(x3,x2));
    return {
      x0,x1,x2,x3,fx3,error,
      h0,h1,delta0,delta1,d,a,b,c,discriminant,denominator,
      values: { h0, h1, delta0, delta1, d, a, b, c, discriminant, denominator },
      text: { x0:fmt(x0),x1:fmt(x1),x2:fmt(x2),x3:fmt(x3),fx3:fmt(fx3),
        error:error.toExponential(6), discriminant:fmt(discriminant) }
    };
  }

  function createSession(options) {
    const config = Object.assign({
      expression:"x^3-x-1", x0:1, x1:1.5, x2:2,
      tolerance:0.0001, maxIterations:50
    }, options || {});
    const tolerance=Number(config.tolerance), maxIterations=Math.floor(Number(config.maxIterations));
    if (!(tolerance>0) || !Number.isFinite(tolerance)) throw new Error("La tolerancia debe ser un número positivo.");
    if (!(maxIterations>0) || !Number.isFinite(maxIterations)) throw new Error("El máximo de iteraciones debe ser positivo.");
    const fn=global.MathParser.compile(config.expression);
    let points=[asComplex(Number(config.x0)),asComplex(Number(config.x1)),asComplex(Number(config.x2))];
    if (points.some(p=>!finite(p))) throw new Error("Los valores iniciales deben ser números válidos.");
    const initial=points.map(p=>({re:p.re,im:p.im}));
    const rows=[];
    let status="ready", message="Listo para calcular.", root=null;

    function next() {
      if (status==="converged" || status==="max-iterations" || status==="error") return snapshot();
      if (rows.length>=maxIterations) {
        status="max-iterations"; message="Se alcanzó el máximo de iteraciones."; return snapshot();
      }
      try {
        const row=calculateNext(fn,points);
        row.iteration=rows.length+1;
        row.residual=abs(row.fx3);
        row.converged = row.error < tolerance; /* Etapa 4 (Said): criterio |x3 - x2| < tol, igual al módulo 5 de Valery */
        rows.push(row);
        points=[points[1],points[2],row.x3];
        root=row.x3;
        if (row.converged) {
          status="converged";
          message="La aproximación alcanzó el criterio de convergencia.";
        } else if (rows.length>=maxIterations) {
          status="max-iterations";
          message="Se alcanzó el máximo de iteraciones sin cumplir la tolerancia.";
        } else {
          status="running";
          message="Iteración calculada. Puedes avanzar a la siguiente.";
        }
      } catch (error) {
        status="error"; message=error.message;
      }
      return snapshot();
    }
    function run() {
      while (status!=="converged" && status!=="max-iterations" && status!=="error") next();
      return snapshot();
    }
    function reset() {
      points=initial.map(p=>({re:p.re,im:p.im}));
      rows.length=0; status="ready"; message="Cálculo reiniciado."; root=null;
      return snapshot();
    }
    function snapshot() {
      return { status,message,root,rootText:root?fmt(root):null,iterations:rows.length,
        rows:rows.slice(),points:points.map(p=>({re:p.re,im:p.im})),
        converged:status==="converged" };
    }
    return { next,run,reset,snapshot,calculateNext:()=>calculateNext(fn,points), config };
  }

  function run(options) {
    const session=createSession(options);
    return session.run();
  }
  global.MullerMethod={createSession,calculateNext,run,formatComplex:fmt,complex:C};
})(window);
