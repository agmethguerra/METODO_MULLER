/*
 * MÜLLER CHALLENGE - Gráfica Chart.js
 * Depende de math-parser.js y Chart.js.
 * Expone: window.MullerGraph.draw(), destroy().
 */
(function (global) {
  "use strict";
  let chart=null;
  function draw(canvasOrId, expression, result, options) {
    if (!global.Chart) throw new Error("Chart.js no está cargado.");
    const canvas=typeof canvasOrId==="string"?document.getElementById(canvasOrId):canvasOrId;
    if (!canvas) throw new Error("No se encontró el canvas de la gráfica.");
    if (chart) chart.destroy();
    const fn=global.MathParser.compile(expression);
    const opts=Object.assign({min:-5,max:5,samples:300},options||{});
    const points=[];
    for(let i=0;i<=opts.samples;i++){
      const x=opts.min+(opts.max-opts.min)*i/opts.samples;
      try {
        const y=fn(x);
        points.push({x,y:Math.abs(y.im)<1e-10&&Number.isFinite(y.re)?y.re:null});
      } catch(e) { points.push({x,y:null}); }
    }
    const datasets=[{
      label:"f(x)",data:points,borderColor:"#22d3ee",backgroundColor:"rgba(34,211,238,.12)",
      borderWidth:2,pointRadius:0,showLine:true,tension:0
    }];
    const markers=[];
    if(result && result.rows){
      result.rows.forEach((row,index)=>{
        if(Math.abs(row.x3.im)<1e-10) markers.push({x:row.x3.re,y:Math.abs(row.fx3.im)<1e-10?row.fx3.re:null});
      });
    }
    if(markers.length) datasets.push({
      label:"Aproximaciones",data:markers,showLine:false,pointRadius:5,
      pointBackgroundColor:"#a78bfa",pointBorderColor:"#fff"
    });
    chart=new global.Chart(canvas.getContext("2d"),{
      type:"scatter",data:{datasets},
      options:{responsive:true,maintainAspectRatio:false,interaction:{mode:"nearest",intersect:false},
        plugins:{legend:{labels:{color:"#e5e7eb"}},tooltip:{callbacks:{label:c=>"x: "+c.parsed.x.toFixed(6)+" | y: "+(c.parsed.y===null?"no real":c.parsed.y.toFixed(6))}}},
        scales:{x:{type:"linear",title:{display:true,text:"x",color:"#cbd5e1"},ticks:{color:"#cbd5e1"},grid:{color:"rgba(148,163,184,.15)"}},
          y:{title:{display:true,text:"f(x)",color:"#cbd5e1"},ticks:{color:"#cbd5e1"},grid:{color:"rgba(148,163,184,.15)"}}}}
    });
    return chart;
  }
  function destroy(){if(chart){chart.destroy();chart=null;}}
  global.MullerGraph={draw,destroy};
})(window);
