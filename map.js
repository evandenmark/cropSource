//zoom scope
const zoomScope = {
	WORLD : 'world',
	CONTINENT : 'continent',
	COUNTRY : 'country'
} 

var currentZoomCountry = "the World";
let currentScope = zoomScope.WORLD;
let clickDefined = false;

//color
colorLinear = d3.scaleLinear()
    .domain([0, 0.5])
    .range(["#F0F0F0", "darkred"]);

colorLinearBlue = d3.scaleLinear()
    .domain([0, 0.5])
    .range(["#F0F0F0", "darkblue"]);

var currentColor = defaultColor;

// MAP
var mapWidth = 1080,
    mapHeight = 600;

WORLD_SCALE = 175;
WORLD_TRANSLATE = [mapWidth*0.5,mapHeight*0.6];
var countryTopCropAllTime;
var countryTopCropAllTimeValue;
var top5crops;
var topCropMap;

//define the map
var projection = d3.geoMercator()
				    .translate(WORLD_TRANSLATE)
					.scale(WORLD_SCALE)

var path = d3.geoPath().projection(projection);

var mapSvg = d3.select("#map-container").append("svg")
		    .attr("width", mapWidth)
		    .attr("height", mapHeight)
		    .on("click", resetZoom);


//MAKE THE DYNAMIC MAP
var countryToPercentList;
var countryToPercent;
var filteredData;
var globalCSVdata;

d3.json("./countryShapeData/countries.json").then(function(topology){

		//load the CSV data only once  
		var geojson = topojson.feature(topology, topology.objects.countries);

		d3.csv("./agricultureData/cleaned/CountryProductPercent.csv").then(function(csvData){

		globalCSVdata = csvData;

		//filter out for specific crop
		filteredData = filterByCrop(csvData);

		//map the country to its value
		countryToPercent = createMapping(filteredData);

		//multiple selected crops
		countryToPercentList = filterCropAndCreateMap(csvData); // creates a list of Maps

		//to switch between single crop vs multiple crops comment the below out
		//multiple colors and crops
		// mapSvg.selectAll("path")
		//       .data(geojson.features)
		//       .enter().append("path")
		// 	      .attr("d", path)
		// 	      .attr("fill", d => createColorFromMap(d.properties.name, countryToPercentList))
		// 	      .on("click", clickState)
				  // .on("mouseover", mouseOverCountry)
			   //    .on("mouseout", mouseOutCountry)
		// 	  .append("title")
		// 	  	  .text(d => createTitleMultipleMaps(d.properties.name, countryToPercentList));

		//single color
		mapSvg.selectAll("path")
		      .data(geojson.features)
		      .enter().append("path")
			      .attr("d", path)
			      .attr("fill", function(d){
			      		newColorLinear = d3.scaleLinear()
						    .domain([0, 0.5])
						    .range(["#F0F0F0", getColorFromColorMap(cropDictMap.get(selectedCrop))]);

						return newColorLinear(countryToPercent.get(d.properties.name));
			      })
			      .on("click", clickState)
			      .on("mouseover", mouseOverCountry)
			      .on("mouseout", mouseOutCountry)
			  .append("title")
			  	  .text(d => d.properties.name +'\n' + Math.round((10000*countryToPercent.get(d.properties.name) + 0.0001))/100+'%');

	});
});

//crop diagrams
var globalProductionData;
var cropWidth = mapWidth/2;
var cropHeight = mapHeight;
var cropMargin = 100;

var countryMaximumVals;
var countryMaximumProducts;


var cropSvg = d3.select("#crop-info-container").append("svg")
				.attr("width", cropWidth)
				.attr("height", cropHeight);

d3.csv("./agricultureData/cleaned/TemporalFoodProductionByCountry.csv").then(function(data){

	globalProductionData = data;

	});

d3.csv("./agricultureData/cleaned/countryMax.csv").then(function(data){
	countryMaximumVals = new Map(data.map(d => [rename.get(d.country) || d.country, eval("d.value")]));
	countryMaximumProducts = new Map(data.map(d => [rename.get(d.country) || d.country, d.product]));
})

function resetZoom(d){

	if (!clickDefined){
		scale = 1;
		translate = [0,0];
		currentZoomCountry = "the World";
		currentScope = zoomScope.WORLD; 

		topCropMap = [];
		cropSvg.selectAll("rect")
				.data(topCropMap)
				.join(
			    	enter => enter.append("rect"),
			    	update => update,
			    	exit => exit.remove()
			    	);

		cropSvg.selectAll("text")
			.data(topCropMap)
			.join(
		    	enter => enter.append("text"),
		    	update => update,
		    	exit => exit.remove()
	    	)
	   	document.getElementById("topProducts").textContent=" ";
	   	document.getElementById("titlePlace").textContent=currentZoomCountry;


	   	mapSvg.selectAll("path")
					.transition()
					.duration(750)
					.attr("transform", "translate(" + translate + ")scale(" + scale + ")");

	}
	clickDefined = false;

	
}

function mouseOverCountry(){

	var currentCountry = d3.select(this);
	currentColor = currentCountry.style('fill');
    currentCountry.attr('fill', hoverColor);
    currentCountry.attr('stroke', '#444444');
}

function mouseOutCountry(){
    d3.select(this).attr('fill', currentColor);
    d3.select(this).attr('stroke', "none");
}

function createTitleMultipleMaps(countryName, mappingList){

	map1 = mappingList[0];
	map2 = mappingList[1];

	titleString = 	countryName + '\n' +
					selectedCropList[0] +': '+ Math.round((10000*map1.get(countryName) + 0.0001))/100+'% \n' +
					selectedCropList[1] +': '+Math.round((10000*map2.get(countryName) + 0.0001))/100+'%';
	return titleString;

}

function createColorFromMap(countryName, mappingList){
	/*Given a mapping list for multiple crops, finds the output color
	which will be a mix between the colors of each individual*/
	map1 = mappingList[0];
	map2 = mappingList[1];

	color1 = colorLinear(map1.get(countryName));
	color2 = colorLinearBlue(map2.get(countryName));

	colorMix = d3.scaleLinear()
		    .domain([0, 1])
		    .range([color1, color2]);

	return colorMix(0.5);
}


function updateYearColors(){
	//changes the colors of the countries when the year is changed
	countryToPercent = createMapping(filteredData);
	mapSvg.selectAll("path")
		  .transition()
		  .attr("fill", function(d){
			      		newColorLinear = d3.scaleLinear()
						    .domain([0, 0.5])
						    .range(["#F0F0F0", getColorFromColorMap(cropDictMap.get(selectedCrop))]);

						return newColorLinear(countryToPercent.get(d.properties.name));
			}).duration(100)
		  .selectAll("title")
		  .text(d => d.properties.name +'\n' + Math.round((10000*countryToPercent.get(d.properties.name) + 0.0001))/100+'%');

	updateProductionData();

	if (currentScope == zoomScope.COUNTRY){
		updateCropGraphic();
	}
}

function updateProductionData(){
	//filters the data for only the selected country
	specificCountryData = filterByCountry(globalProductionData);

	//for top 5 crops, creates
	top5crops = getTop5Crops(specificCountryData);

	topCropMap = Array.from(top5crops.keys()).sort(function(a,b){return top5crops.get(b)-top5crops.get(a)});

	countryTopCropAllTime = countryMaximumProducts.get(currentZoomCountry);
	countryTopCropAllTimeValue = countryMaximumVals.get(currentZoomCountry);
}

function readableTonnage(x){
	return Math.round(x/1000).toString() +"K tons";

}

function updateCropGraphic(){

	if (currentScope == zoomScope.COUNTRY){

		var bar = cropSvg.selectAll("rect")
		    .data(topCropMap)
		    .join(
		    	enter => enter.append("rect"),
		    	update => update,
		    	exit => exit.remove()
		    	)
		    .attr("value", function(d,i){return topCropMap[i]})
		    .on("click", selectRect)
		    .transition().duration(100)
		    .attr("width", function(d){
		    	return (top5crops.get(d)/countryTopCropAllTimeValue)*cropWidth*0.9;
		    	})
		    .attr("height", 40)
		    .attr("class", "bar")
		    .attr("x", function(d) { return 40})
		    .attr("y", function(d,i) { return i*cropHeight/8 + cropMargin})
		    .attr("fill", function(d){return getColorFromColorMap(cropDictMap.get(d))})
		    .attr("opacity", 0.5);

		cropSvg.selectAll("text")
				.data(topCropMap)
				.join(
			    	enter => enter.append("text"),
			    	update => update,
			    	exit => exit.remove()
		    	).text(d => (cropRename.get(d) || d).toString() +" " +readableTonnage(top5crops.get(d))).transition().duration(750)
				.attr("x", function(d) { return 40})
		    	.attr("y", function(d,i) { return i*cropHeight/8 + cropMargin-2})
		    	.attr("font-family", "Arial")
		    	.attr("font-size", 12);


		document.getElementById("topProducts").textContent="Top 5 Products in Tons";
	} 
}

function getColorFromColorMap(x){

	if (cropColorMap.has(x)){
		return cropColorMap.get(x);
	}
	return "#6100A4";
}

function selectRect(){

	selectedCrop = d3.select(this).attr("value");
	console.log(selectedCrop);
	document.getElementById("titleCrop").textContent=(cropRename.get(selectedCrop) || selectedCrop);
	updateProductionData();
	updateCropColors();
	updateCropGraphic();
}

function updateYearColorsMultiple(){

	countryToPercentList = filterCropAndCreateMap(globalCSVdata); // creates a list of Maps

	//new - multiple colors
	mapSvg.selectAll("path")
		  .transition()
	      .attr("fill", d => createColorFromMap(d.properties.name, countryToPercentList)).duration(100)
	  	  .selectAll("title")
	  	  .text(d => createTitleMultipleMaps(d.properties.name, countryToPercentList));
}

function updateCropColors(){
	//changes the colors of the countries when the crop is updaed
	filteredData = filterByCrop(globalCSVdata);
	countryToPercent = createMapping(filteredData);
	mapSvg.selectAll("path")
		  .attr("fill", function(d){
			      		newColorLinear = d3.scaleLinear()
						    .domain([0, 0.5])
						    .range(["#F0F0F0", getColorFromColorMap(cropDictMap.get(selectedCrop))]);

						return newColorLinear(countryToPercent.get(d.properties.name));
			      })
		  .selectAll("title")
		  .text(d => d.properties.name +'\n' + Math.round((10000*countryToPercent.get(d.properties.name) + 0.0001))/100+'%');
}

function filterByCrop(data){
	return data.filter(d => d.product == selectedCrop);
}

function filterByCountry(data){
	return data.filter(d => d.country == currentZoomCountry || rename.get(d.country) == currentZoomCountry);
}

function createMapping(data){
	//creates a mapping from a country to a value
	return new Map(data.map(d => [rename.get(d.country) || d.country, eval("d._"+year)]));
}

function getTop5Crops(data){
	var top5 = new Map(data.map(d => [d.product, eval("d._"+year)]));
	selectedCropVal = top5.get(selectedCrop);
	while (top5.size > 5){
		var minimumKey = getMinimumKey(top5);
		top5.delete(minimumKey);
	};

	if (!top5.has(selectedCrop)){
		top5.set(selectedCrop, selectedCropVal);
	}
	return top5;
	
}

function getMinimumKey(map){
	var minVal = Number.POSITIVE_INFINITY;
	var minKey = null;
	for (const [k,v] of map.entries()){
		if (Math.round(v)<minVal){
			minVal = Math.round(v);
			minKey = k;
		}
	}
	return minKey;

}

function filterCropAndCreateMap(data){
	var mappingList = [];
	for (let i = 0; i < selectedCropList.length; i++){
		mappingList.push(
			new Map(data.filter(d => d.product == selectedCropList[i]).map(d => [rename.get(d.country) || d.country, eval("d._"+year)]))
			)
	}
	return mappingList;
	
}

function clickState(d) {

	//MOVE TO THE CLICKED STATE
	//bounds of area clicked
	var bounds = path.bounds(d),
    dx = bounds[1][0] - bounds[0][0],
    dy = bounds[1][1] - bounds[0][1],
    x = (bounds[0][0] + bounds[1][0]) / 2,
    y = (bounds[0][1] + bounds[1][1]) / 2;


    var scale = Math.min(mapWidth/dx, mapHeight/dy),
    translate = [-1*(x*scale - mapWidth / 2), -1*(y*scale - mapHeight / 2)];


	switch(currentScope){
		case zoomScope.WORLD:

            //move the map
			mapSvg.selectAll("path")
					.transition()
					.duration(750)
					.attr("transform", "translate(" + translate + ")scale(" + scale + ")");

			//adjust new scope		
			currentScope = zoomScope.COUNTRY;
			currentZoomCountry = d.properties.name;
			
			break;

		case zoomScope.CONTINENT:
			break;

		case zoomScope.COUNTRY:

			if (d.properties.name == currentZoomCountry){

				//currently clicking the same country that we are zoomed into --> go back to world
				scale = 1;
            	translate = [0,0];
            	currentZoomCountry = "the World";
            	currentScope = zoomScope.WORLD; 

            	topCropMap = [];
            	cropSvg.selectAll("rect")
	    				.data(topCropMap)
	    				.join(
					    	enter => enter.append("rect"),
					    	update => update,
					    	exit => exit.remove()
					    	);

	    		cropSvg.selectAll("text")
					.data(topCropMap)
					.join(
				    	enter => enter.append("text"),
				    	update => update,
				    	exit => exit.remove()
			    	)
			   	document.getElementById("topProducts").textContent=" ";
				
			} else{
				//clicking another country --> go to that country
				currentZoomCountry = d.properties.name;	

			}


			mapSvg.selectAll("path")
					.transition()
					.duration(750)
					.attr("transform", "translate(" + translate + ")scale(" + scale + ")");

			break;
	}

	document.getElementById("titlePlace").textContent=currentZoomCountry;

	//UPDATE THE DATA
	if (currentScope == zoomScope.COUNTRY){

		updateProductionData()
		updateCropGraphic();
	
	}
	clickDefined = true;
}

