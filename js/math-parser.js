/*
 * MÜLLER CHALLENGE - Analizador matemático seguro
 * No utiliza eval() ni Function().
 * Expone: window.MathParser.parse(), evaluate(), compile()
 */
(function (global) {
  "use strict";

  const C = {
    make: (re, im = 0) => ({ re: Number(re), im: Number(im) }),
    add: (a, b) => ({ re: a.re + b.re, im: a.im + b.im }),
    sub: (a, b) => ({ re: a.re - b.re, im: a.im - b.im }),
    mul: (a, b) => ({ re: a.re*b.re - a.im*b.im, im: a.re*b.im + a.im*b.re }),
    div: (a, b) => {
      const den = b.re*b.re + b.im*b.im;
      if (den < 1e-30) throw new Error("División por cero o denominador demasiado pequeño.");
      return { re: (a.re*b.re + a.im*b.im)/den, im: (a.im*b.re - a.re*b.im)/den };
    },
    neg: a => ({ re: -a.re, im: -a.im }),
    abs: a => Math.hypot(a.re, a.im),
    sqrt: a => {
      const r = Math.hypot(a.re, a.im);
      const re = Math.sqrt(Math.max(0, (r + a.re) / 2));
      const im = Math.sign(a.im || 1) * Math.sqrt(Math.max(0, (r - a.re) / 2));
      return { re, im };
    },
    exp: a => {
      const k = Math.exp(a.re);
      return { re: k*Math.cos(a.im), im: k*Math.sin(a.im) };
    },
    log: a => {
      if (C.abs(a) < 1e-30) throw new Error("El logaritmo de cero no está definido.");
      return { re: Math.log(C.abs(a)), im: Math.atan2(a.im, a.re) };
    },
    sin: a => ({ re: Math.sin(a.re)*Math.cosh(a.im), im: Math.cos(a.re)*Math.sinh(a.im) }),
    cos: a => ({ re: Math.cos(a.re)*Math.cosh(a.im), im: -Math.sin(a.re)*Math.sinh(a.im) }),
    tan: a => C.div(C.sin(a), C.cos(a)),
    pow: (a, b) => {
      if (C.abs(a) < 1e-30) {
        if (C.abs(b) < 1e-30) return C.make(1);
        if (b.im === 0 && b.re > 0) return C.make(0);
        throw new Error("Potencia no definida para base cero y ese exponente.");
      }
      return C.exp(C.mul(b, C.log(a)));
    }
  };

  function tokenize(source) {
    const s = String(source || "").replace(/\s+/g, "");
    if (!s) throw new Error("Escribe una función matemática.");
    const tokens = [];
    let i = 0;
    while (i < s.length) {
      const rest = s.slice(i);
      const number = rest.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/i);
      const name = rest.match(/^[a-zA-Z_][a-zA-Z_0-9]*/);
      if (number) {
        tokens.push({ type: "number", value: Number(number[0]) });
        i += number[0].length;
      } else if (name) {
        tokens.push({ type: "name", value: name[0].toLowerCase() });
        i += name[0].length;
      } else if ("+-*/^(),".includes(s[i])) {
        tokens.push({ type: s[i], value: s[i] });
        i++;
      } else {
        throw new Error("Carácter no permitido: " + s[i]);
      }
    }
    tokens.push({ type: "eof" });
    return tokens;
  }

  function parse(source) {
    const tokens = tokenize(source);
    let pos = 0;
    const peek = () => tokens[pos];
    const take = () => tokens[pos++];

    function expression() {
      let node = term();
      while (peek().type === "+" || peek().type === "-") {
        const op = take().type;
        node = { type: "binary", op, left: node, right: term() };
      }
      return node;
    }
    function startsPrimary(t) {
      return t.type === "number" || t.type === "name" || t.type === "(";
    }
    function term() {
      let node = unary();
      while (true) {
        if (peek().type === "*" || peek().type === "/") {
          const op = take().type;
          node = { type: "binary", op, left: node, right: unary() };
        } else if (startsPrimary(peek())) {
          // Multiplicación implícita: 2x, 3(x+1), 2sin(x).
          node = { type: "binary", op: "*", left: node, right: unary() };
        } else break;
      }
      return node;
    }
    function unary() {
      if (peek().type === "+" || peek().type === "-") {
        const op = take().type;
        return { type: "unary", op, value: unary() };
      }
      return power();
    }
    function power() {
      let node = primary();
      if (peek().type === "^") {
        take();
        node = { type: "binary", op: "^", left: node, right: unary() };
      }
      return node;
    }
    function primary() {
      const t = take();
      if (t.type === "number") return { type: "number", value: t.value };
      if (t.type === "(") {
        const node = expression();
        if (take().type !== ")") throw new Error("Falta cerrar un paréntesis.");
        return node;
      }
      if (t.type === "name") {
        if (peek().type === "(") {
          take();
          const args = [];
          if (peek().type !== ")") {
            args.push(expression());
            while (peek().type === ",") { take(); args.push(expression()); }
          }
          if (take().type !== ")") throw new Error("Falta cerrar la función " + t.value + ".");
          return { type: "call", name: t.value, args };
        }
        if (t.value === "pi") return { type: "constant", value: Math.PI };
        if (t.value === "e") return { type: "constant", value: Math.E };
        if (t.value === "x") return { type: "variable", name: "x" };
        throw new Error("Nombre no permitido: " + t.value);
      }
      throw new Error("Expresión matemática incompleta.");
    }

    const ast = expression();
    if (peek().type !== "eof") throw new Error("Hay elementos adicionales o una operación incompleta.");
    return ast;
  }

  function evaluateNode(node, x) {
    switch (node.type) {
      case "number": case "constant": return C.make(node.value);
      case "variable": return C.make(x.re, x.im);
      case "unary": {
        const v = evaluateNode(node.value, x);
        return node.op === "-" ? C.neg(v) : v;
      }
      case "binary": {
        const a = evaluateNode(node.left, x), b = evaluateNode(node.right, x);
        if (node.op === "+") return C.add(a,b);
        if (node.op === "-") return C.sub(a,b);
        if (node.op === "*") return C.mul(a,b);
        if (node.op === "/") return C.div(a,b);
        if (node.op === "^") return C.pow(a,b);
        throw new Error("Operador no reconocido.");
      }
      case "call": {
        if (node.args.length !== 1) throw new Error(node.name + "() requiere exactamente un argumento.");
        const v = evaluateNode(node.args[0], x);
        const funcs = { sin:C.sin, cos:C.cos, tan:C.tan, exp:C.exp, log:C.log, sqrt:C.sqrt };
        if (!funcs[node.name]) throw new Error("Función no permitida: " + node.name);
        return funcs[node.name](v);
      }
      default: throw new Error("Estructura matemática inválida.");
    }
  }

  function toComplex(value) {
    if (typeof value === "number") return C.make(value);
    if (value && Number.isFinite(value.re) && Number.isFinite(value.im)) return C.make(value.re, value.im);
    throw new Error("El valor de x debe ser un número o un complejo {re, im}.");
  }
  function evaluate(astOrSource, x) {
    const ast = typeof astOrSource === "string" ? parse(astOrSource) : astOrSource;
    const result = evaluateNode(ast, toComplex(x));
    if (!Number.isFinite(result.re) || !Number.isFinite(result.im)) throw new Error("El resultado no es finito.");
    return result;
  }
  function compile(source) {
    const ast = parse(source);
    return x => evaluate(ast, x);
  }

  global.MathParser = { parse, evaluate, compile, complex: C };
})(window);
