var jsonfile = require('jsonfile'),
	_ = require('lodash');

var result;

var data = require('../ad-hoc/all-by-' + process.argv[2] + '.json'); 

// We know this
// result.nodes.push({"name": "Population"});
// result.nodes.push({"name": "Male"});
// result.nodes.push({"name": "Female"});
// result.links.push({"source": 0, "target": 1, "value": data.Male.total});
// result.links.push({"source": 0, "target": 2, "value": data.Female.total});

var gearMap = {
	// "nug": "0",
    "ng1": "0 - -10k",
    "ng2": "-10k - -30k",
    "ng3": "-30k - -70k",
    "ng4": "Over -70k",
    "pg1": "0-10k",
    "pg2": "10-30k",
    "pg3": "30-70k",
    "pg4": "Over 70k"
};
if(process.argv.length > 2 && process.argv[2] === "sex"){
	result = {
		nodes: [{"name": "Geared population"},
				{"name": "Male"},
				{"name": "Female"},
				// {"name": "0"},
				{"name": "0-10k"},
				{"name": "10-30k"},
				{"name": "30-70k"},
				{"name": "Over 70k"},
				{"name": "0 - -10k"},
				{"name": "-10k - -30k"},
				{"name": "-30k - -70k"},
				{"name": "Over -70k"}],
		links: []
	};
}else if(process.argv.length > 2 && process.argv[2] === "occupation"){
	result = {
		nodes: [{"name": "Geared population"},
				{"name": "Clerical and Administrative Workers"},
				{"name": "Community and Personal Service Workers"},
				{"name": "Labourers"},
				{"name": "Machinery operators and drivers"},
				{"name": "Managers"},
				{"name": "Other"},
				{"name": "Professionals"},
				{"name": "Sales workers"},
				{"name": "Technicians and Trades Workers"},
				// {"name": "0"},
				{"name": "0-10k"},
				{"name": "10-30k"},
				{"name": "30-70k"},
				{"name": "Over 70k"},
				{"name": "0 - -10k"},
				{"name": "-10k - -30k"},
				{"name": "-30k - -70k"},
				{"name": "Over -70k"}],
		links: []
	};
}else{
	result = {
		nodes: [{"name": "Geared population"},
				{"name": "15-19 years"},
				{"name": "20-24 years"},
				{"name": "25-29 years"},
				{"name": "30-34 years"},
				{"name": "35-39 years"},
				{"name": "40-44 years"},
				{"name": "45-49 years"},
				{"name": "50-54 years"},
				{"name": "55-59 years"},
				{"name": "60-64 years"},
				{"name": "65-69 years"},
				{"name": "70-74 years"},
				// {"name": "0"},
				{"name": "0-10k"},
				{"name": "10-30k"},
				{"name": "30-70k"},
				{"name": "Over 70k"},
				{"name": "0 - -10k"},
				{"name": "-10k - -30k"},
				{"name": "-30k - -70k"},
				{"name": "Over -70k"}],
		links: []
	};
}

for(var prop in data){
	// Age group or occp type
	result.links.push({"source": 0, 
		"target": _.findIndex(result.nodes, function(o){return o.name == prop;}), 
		"value": data[prop].total});
	// Gear
	for(var gear in gearMap){
		result.links.push({"source": _.findIndex(result.nodes, function(o){return o.name == prop;}), 
			"target": _.findIndex(result.nodes, function(o){return o.name == gearMap[gear];}), 
			"value": data[prop][gear]});
	}
}


var file = "./ad-hoc/sankey-all-by-" + process.argv[2] + ".json";
jsonfile.writeFile(file, result, {spaces: 2}, function(err) {
	console.error('Error:' + err);
});
