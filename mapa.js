
var w = 1400;
var h = 680;
var svg = d3.select("div#container").append("svg").attr("preserveAspectRatio", "xMinYMin meet").style("background-color","#c9e8fd")
    .attr("viewBox", "0 0 " + w + " " + h)
    .classed("svg-content", true);
var projection = d3.geoMercator().translate([w/2, h/2]).scale(700).center([-75,-40]);
var path = d3.geoPath().projection(projection);

var x = d3.scaleLinear()
    .domain([0, 1000, 5000, 10000, 25000, 50000, 100000, 200000])  
    .range([0,40,80,120,160,200,240,280]);;

var color = d3.scaleThreshold()
  .domain([1000, 5000, 10000, 25000, 50000, 100000, 200000])
  .range(d3.schemeYlOrBr[8]);

var g = svg.append("g")
  .attr("class", "key")
  .attr("transform", "translate(20,170)");

g.selectAll("rect")
.data(color.range().map(function(d) {
    d = color.invertExtent(d);
    if (d[0] == null) d[0] = x.domain()[0];
    if (d[1] == null) d[1] = x.domain()[1];
    return d;
  }))
.enter().append("rect")
  .attr("height", 8)
  .attr("x", function(d,i) { return (i)*40; })
  .attr("width", 40)
  .attr("fill", function(d) { return color(d[0]); });

g.append("text")
  .attr("class", "caption")
  .attr("x", x.range()[0])
  .attr("y", -8)
  .attr("fill", "#000")
  .attr("text-anchor", "start")
  .attr("font-weight", "bold")
  .text("Cantidad de personas");

g.call(d3.axisBottom(x)
  .tickSize(8)
  .tickValues(color.domain()))
.select(".domain")
  .remove();

//Marco
svg.append("rect")
.attr("x", 0)
.attr("y", 0)
.attr("height", h)
.attr("width", w)
.style("stroke", "black")
.style("fill", "none")
.style("stroke-width", "5px");


// cargar data 
var comunas = d3.json("comunas.geojson");
var censo = d3.csv("censo.csv", function(d) {densidad.set(d.ID, +d.TOTAL_PERS)});
var censo = d3.csv("censo.csv", function(d) {nombres.set(d.ID, d.NOM_COMUNA)});
var censo = d3.csv("censo.csv", function(d) {hombres.set(d.ID, d.HOMBRES)});
var censo = d3.csv("censo.csv", function(d) {mujeres.set(d.ID, d.MUJERES)});
Promise.all([comunas, censo]).then(function(values){    
// dibujar mapa
svg.selectAll("path")
    .data(values[0].features)
    .enter()
    .append("path")
    .style('fill', function(d) { return color(d.TOTAL_PERS = densidad.get(d.id)); })
    .attr('hombres',function(d) {return d.HOMBRES = hombres.get(d.id);})
    .attr('mujeres',function(d) {return d.HOMBRES = mujeres.get(d.id);})
    .text(function(d) { return d.COMUNA = nombres.get(d.id);} )
    .style('stroke', 'black')
    .style('stroke-width', 0.5)
    .attr("d", path)
    .on("mouseover", function(d) {		
      div.transition()		
          .duration(50)		
          .style("opacity", 5);		
      div	.html(d.COMUNA)	
          .style("left", (d3.event.pageX) + "px")		
          .style("top", (d3.event.pageY - 28) + "px");	
      })					
  .on("mouseout", function(d) {		
      div.transition()		
          .duration(50)		
          .style("opacity", 0);	
  })
  .on("click", function(d){
    if (!d3.select(this).classed("selected") ){
       d3.select(this).classed("selected", true)
       d3.select(this).transition().attr('opacity', 0.4);
       svg1
       .append("rect")
       .attr("width", 50)
       .attr("height",d3.select(this).attr("hombres")/292959*200)
       .attr("fill", "#2C528C")
       .attr('class','hom'+String(d3.select(this).attr("hombres")))
       .attr("x",140 * seleccion)
       svg1
       .append("text")
       .attr("x", 140 * seleccion)
       .attr("y", 50)
       .style('fill','black')
       .attr('transform' , 'rotate(90,'+ String( 5 + 140 * seleccion)+',50)')
       .attr('class','thom'+String(d3.select(this).attr("hombres")))
       .text(d3.select(this).attr("hombres"));
       svg1
       .append("rect")
       .attr("width", 50)
       .attr("height",(d3.select(this).attr("mujeres")/292959)*200)
       .attr("fill", "#FE5BAC")
       .attr('class','muj'+String(d3.select(this).attr("mujeres")))
       .attr("x",50+(seleccion*140));
       svg1
       .append("text")
       .attr("x", 56+(seleccion*140))
       .attr("y", 50)
       .style('fill','black')
       .attr('transform' , 'rotate(90,' + String( 56 + 140 * seleccion) + ',50)')
       .attr('class','tmuj'+String(d3.select(this).attr("mujeres")))
       .text(d3.select(this).attr("mujeres"));
       svg1
       .append("text")
       .attr("x", (seleccion*140))
       .attr("y", 198)
       .style('fill','black')
       .style('font-size',"1em")
       .attr('class','label'+String(d3.select(this).attr("mujeres")))
       .text(d.COMUNA)
       seleccion += 1;
    }else{
       d3.select(this).classed("selected", false);
       d3.select(this).transition().attr('opacity', 1)
       svg1.select('rect.hom'+String(d3.select(this).attr("hombres"))).remove()
       svg1.select('rect.muj'+String(d3.select(this).attr("mujeres"))).remove()
       svg1.select('text.thom'+String(d3.select(this).attr("hombres"))).remove()
       svg1.select('text.tmuj'+String(d3.select(this).attr("mujeres"))).remove()
       svg1.select('text.label'+String(d3.select(this).attr("mujeres"))).remove()
       seleccion -= 1;
    }

  });
  });


var zoom = d3.zoom()
        .translateExtent([[0, 0], [1400, 700]])
        .scaleExtent([1, 30])
        .on('zoom', function() {
          svg.selectAll('path')
           .attr('transform', d3.event.transform)
           .style('stroke-width',0.5/((d3.event.transform.k)));
            svg.selectAll('circle')
           .attr('transform', d3.event.transform);
           
});

svg.call(zoom);

document.getElementById("reset").addEventListener("click", () => {
    zoom.transform(svg, d3.zoomIdentity);
});



 