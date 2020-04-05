///Play button

var floatYear = year;
var buttonDiv = d3.select("#button-container");
var playButton = buttonDiv.append("button")
    .text("Go Through History")
    .attr("font-size", "24px")
    .classed("button", true)
    .on('click', function(){
        //here this is the button
        playPause();
	});

document.body.onkeyup = function(e){
    if(e.keyCode == 32 || e.key === ' '){
        playPause();
    }
}

function playPause(){
    if (playButton.text() == "Pause") {
      clearInterval(timer);
      // timer = 0;
      playButton.text("Go Through History");
    } else {
      timer = setInterval(step, 25);
      playButton.text("Pause");
    }
}

function step() {
	updateYear(floatYear);
	floatYear = floatYear+0.18;
	if (year>2013){
		floatYear = 2014;
		updateYear(year);
		clearInterval(timer);
		playButton.text("Go Through History");
		year = 1961
		floatYear = 1961

	}
}


//slider
sliderContainerHeight = document.getElementById("slider-container").clientHeight;
sliderContainerWidth = document.getElementById("slider-container").clientWidth;

var CIRCLE_RADIUS = 9;
var timer;

var margin = {right: 50, left: 50},
    sliderWidth = sliderContainerWidth - margin.left - margin.right,
    sliderHeight = sliderContainerHeight;

//creating an SVG in the slider
var sliderSVG = d3.select("#slider-container").append("svg")
				.attr("width", sliderContainerWidth)
				.attr("height", sliderHeight);

//ticks scale variable
var x = d3.scaleLinear()
		    .domain([1961, 2014])
		    .range([0, sliderWidth])
		    .clamp(true);

//create a ground of things to go inside the sliderSVG
//slider includes the line, the overlay, and button
var slider = sliderSVG.append("g")
			    .attr("class", "slider")
			    .attr("transform", "translate(" + margin.left + "," + sliderHeight / 2 + ")");

slider.append("line")
	    .attr("class", "track")
	    .attr("x1", x.range()[0])
	    .attr("x2", x.range()[1])
	  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
	    .attr("class", "track-inset")
	  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
	    .attr("class", "track-overlay")
	    .call(d3.drag()
	        .on("start.interrupt", function() { slider.interrupt(); })
	        .on("start drag", function() { 
	        	if (!(timer == null)){
	        		clearInterval(timer);
	        		playButton.text("Go Through History");
	        	}
	        	floatYear = x.invert(d3.event.x);
	        	updateYear(x.invert(d3.event.x)); }));

slider.insert("g", ".track-overlay")
	    .attr("class", "ticks")
	    .attr("transform", "translate(0," + 18 + ")")
	  .selectAll("text")
	  .data(x.ticks(10))
	  .enter().append("text")
	    .attr("x", x)
	    .attr("text-anchor", "middle")
	    .text(function(d) { return d; });

// //year title text
// sliderSVG.select("text")
// 			.attr("x", margin.left + sliderWidth/2)
// 			.attr("y", -sliderHeight*0.5)
// 			.text(year);

//add circle handle
var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", CIRCLE_RADIUS);

function updateYear(h) {
	handle.attr("cx", x(h));
	year = Math.round(h);
	sliderSVG.select("text").text(year);
	document.getElementById("titleYear").textContent=year;
	updateYearColors();
	// updateYearColorsMultiple();
}



