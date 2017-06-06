//------------- Absorption coefficients -------------
// https://www.acousticalsurfaces.com/acoustic_IOI/101_13.htm

var alfaBrick = [0.03, 0.03, 0.03, 0.04, 0.05, 0.07];
var alfaConcrete = [0.1, 0.05, 0.06, 0.07, 0.09, 0.08];
var alfaPlaster = [0.013, 0.015, 0.02, 0.03, 0.04, 0.05];
var alfaWood = [0.28, 0.22, 0.17, 0.09, 0.1, 0.11];
var alfaCarpet = [0.02,	0.06,	0.14,	0.37,	0.6, 0.65];


var width = 1;
var height = 1;
var length = 1;


//------------- Functions -------------------

$(function() {
   $("#calculate").click(function() {
      getDimensions();
      var volume = calcVolume(width, height, length);
      
      var $material1 = parseInt($("#material-1").val());
      var $material2 = parseInt($("#material-2").val());
      var $material3 = parseInt($("#material-3").val());
      var $material4 = parseInt($("#material-4").val());
      var $material5 = parseInt($("#material-5").val());
      var $material6 = parseInt($("#material-6").val());
      
      var alfas1 = getCoefficients($material1);
      var alfas2 = getCoefficients($material2);
      var alfas3 = getCoefficients($material3);
      var alfas4 = getCoefficients($material4);
      var alfas5 = getCoefficients($material5);
      var alfas6 = getCoefficients($material6);
      
      var surfaces = calcAreas(width, height, length);
      var sabins = calcSA(alfas1, alfas2, alfas3, alfas4, alfas5, alfas6, surfaces);
      var RT = calcRT(volume, sabins);
      drawGraph(RT);
      
   });
     
});


function getDimensions() {
   width = $("#room-width").val();
   height = $("#room-height").val();
   length = $("#room-length").val();   
}

function getCoefficients(material) {
   switch(material) {
      case 1:
         return alfaBrick;
         break;
      case 2:
         return alfaConcrete;
         break;
      case 3:
         return alfaPlaster;
         break;
      case 4:
         return alfaWood;
         break;
      case 5:
         return alfaCarpet;
         break;
      default:
         break;
   }
}


function calcVolume(w, h, l) {
   return w*h*l;
}

function calcAreas(w, h, l) {
   var areas = []; // Pared frontal, pared lateral, techo
   areas.push(w*h);
   areas.push(l*h);
   areas.push(w*l);
   return areas;
}

function calcSA(al1, al2, al3, al4, al5, al6, surf) { 
   var SA = [];
   for (var i = 0; i < 6; i++) {
      SA[i] = al1[i]*surf[0] + al2[i]*surf[1] + al3[i]*surf[0] + al4[i]*surf[1] + al5[i]*surf[2] * al6[i]*surf[2];
         
   }
   return SA;
}

function calcRT(volume, sabins) {
   var RT = [];
   for (var i = 0; i < 6; i++) {
      RT[i] = (0.161*volume) / sabins[i];
   }
   
   return RT;
}

function drawGraph(RT) {
   var dataArray = RT;
   var textRT = d3.selectAll(".text-rt");
   
   var x = d3.scaleLinear()
      .domain([0, d3.max(dataArray)])
      .range([0, 150]);
   
   d3.selectAll(".graph-rect")
      .data(dataArray)
      .attr("height", function(d) { 
         //console.log(d);
         return x(d); })
      .attr("y", function(d) { return 170 - x(d); });
   
   
   textRT.data(dataArray)
      .text(function(data) {
         return Math.round(data * 100) / 100})
      .style("opacity", 1)
      .attr("y", function(data) { return 163 - x(data); });
      
      

   
  
   
}