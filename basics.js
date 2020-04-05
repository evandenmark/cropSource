//starting conditions
var cropChoices = [	
					'Apples',
					'Avocados', 
					'Bananas', 
					'Barley',
					'Cabbages and other brassicas', 
					'Dates',
					'Grapes', 
					'Mangoes, mangosteens, guavas',
					'Maize',
					'Millet',
					'Onions, dry',
					'Potatoes',
					'Quinoa',
					'Rice, paddy',
					'Roots and Tubers,Total',
					'Rye',
					'Sorghum',
					'Sugar cane',
					'Wheat'];

cropDictMap = new Map(	[['Apples', 'Fruit'],
						['Avocados', 'Fruit'],
						['Bananas', 'Fruit'],
						['Barley', 'Grains'],
						['Dates', 'Fruit'],
						['Cabbages and other brassicas', 'Vegetables'],
						['Cassava', 'Vegetables'],
						['Cereals,Total', 'Grains'],
						['Cereals (Rice Milled Eqv)', 'Grains'],
						['Coarse Grain, Total', 'Grains'],
						['Grapes', 'Fruit'],
						['Mangoes, mangosteens, guavas','Fruit'],
						['Maize', 'Grains'],
						['Millet', 'Grains'],
						['Onions, dry','Vegetables'],
						['Oil, palm fruit', 'Plants'],
						['Potatoes','Vegetables'],
						['Quinoa','Grains'],
						['Rice, paddy', 'Grains'],
						['Rye', 'Grains'],
						['Roots and Tubers,Total','Vegetables'],
						['Sorghum', 'Grains'],
						['Sweet potatoes', 'Vegetables'],
						['Sugar cane','Plants'],
						['Sugar beet', 'Vegetables'],
						['Vegetables&Melons, Total', 'Vegetables'],
						['Vegetables Primary', 'Vegetables'],
						['Wheat','Grains']
	]);

cropColorMap = new Map([['Grains', "#A65100"],
						['Fruit', "#FF4D44"],
						['Vegetables', "#089B08"],
						['Plants', "#08739B"]]);

var selectedCrop = 'Apples';
var selectedCropList = ['Avocados', 'Apples']
var year = 1961;
var hoverColor = '#FFF6BD';
var defaultColor = "#F0F0F0";


cropRename = new Map([
	["Cabbages and other brassicas", "Cabbages"],
	["Rice, paddy", "Rice"],
	["Mangoes, mangosteens, guavas", "Mangoes"],
	["Onions, dry", "Onions"],
	["Roots and Tubers,Total", "Root Vegetables"],
	["Vegetables&Melons, Total", "Cruciferous Vegetables"]
	]);
//countries rename map
rename = new Map([
  ["Antigua and Barbuda", "Antigua and Barb."],
  ["Bolivia (Plurinational State of)", "Bolivia"],
  ["Bosnia and Herzegovina", "Bosnia and Herz."],
  ["Brunei Darussalam", "Brunei"],
  ["China, mainland", "China"],
  ["China, Taiwan Province of", "Taiwan"],
  ["Central African Republic", "Central African Rep."],
  ["Cook Islands", "Cook Is."],
  ["Cote dIvoire", "Cote d'Ivoire"],
  ["Democratic People's Republic of Korea", "North Korea"],
  ["Democratic Republic of the Congo", "Dem. Rep. Congo"],
  ["Dominican Republic", "Dominican Rep."],
  ["Equatorial Guinea", "Eq. Guinea"],
  ["Iran (Islamic Republic of)", "Iran"],
  ["Lao People's Democratic Republic", "Laos"],
  ["Marshall Islands", "Marshall Is."],
  ["Micronesia (Federated States of)", "Micronesia"],
  ["Occupied Palestinian Territory", "Palestine"],
  ["Republic of Korea", "South Korea"],
  ["Republic of Moldova", "Moldova"],
  ["Russian Federation", "Russia"],
  ["Saint Kitts and Nevis", "St. Kitts and Nevis"],
  ["Saint Vincent and the Grenadines", "St. Vin. and Gren."],
  ["Sao Tome and Principe", "São Tomé and Principe"],
  ["Solomon Islands", "Solomon Is."],
  ["South Sudan", "S. Sudan"],
  ["Swaziland", "eSwatini"],
  ["Syrian Arab Republic", "Syria"],
  ["The former Yugoslav Republic of Macedonia", "Macedonia"],
  ["United Republic of Tanzania", "Tanzania"],
  ["Venezuela (Bolivarian Republic of)", "Venezuela"],
  ["Western Sahara","W. Sahara"],
  ["Viet Nam", "Vietnam"]
]);