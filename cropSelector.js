const apples = document.getElementById('apples');
const avocados = document.getElementById('avocados');
const bananas = document.getElementById('bananas');
const barley = document.getElementById('barley');
const cabbages = document.getElementById('cabbages');
const dates = document.getElementById('dates');
const grapes = document.getElementById('grapes');
const maize = document.getElementById('maize');
const mangoes = document.getElementById('mangoes');
const millet = document.getElementById('millet');
const onions = document.getElementById('onions');
const potatoes = document.getElementById('potatoes');
const quinoa = document.getElementById('quinoa');
const rice = document.getElementById('rice');
const rootvegetables = document.getElementById('rootvegetables');
const rye = document.getElementById('rye');
const sorghum = document.getElementById('sorghum');
const sugarcane = document.getElementById('sugarcane');
const wheat = document.getElementById('wheat');

let crops = [apples, avocados, bananas, barley, cabbages, dates, grapes, maize, mangoes, millet, onions, potatoes, quinoa, rice, rootvegetables, rye, sorghum, sugarcane, wheat]

crops.forEach(function(crop) {
	crop.onclick = function(){
		selectedCrop = crop.value;
		document.getElementById("titleCrop").textContent=(cropRename.get(selectedCrop) || selectedCrop);
		updateProductionData();
		updateCropColors();
		updateCropGraphic();
	};
});

// var dropdown = d3.select("#crop-dropdown")
// 	.insert("select", "svg")
// 	.on("change", dropdownSelect);
//
// dropdown.selectAll("option")
// 	.data(cropChoices)
// 	.enter().append("option")
// 	.attr("value", function (d) { return d; })
// 	.text(function(d) { return cropRename.get(d) || d;
// });
// //
// function dropdownSelect(){
// 		selectedCrop = this.value;
// 		document.getElementById("titleCrop").textContent=(cropRename.get(selectedCrop) || selectedCrop);
// 		updateProductionData();
// 		updateCropColors();
// 		updateCropGraphic();
// 	};

// d3.select("#image_wrap")
// 	.on("click", function(d) {
// 		console.log("hahahahaha");
// 		selectedCrop = this.value;
// 		updateCropColors();
// 	});

// cropWidth = mapWidth/2;
// cropHeight = mapHeight;
