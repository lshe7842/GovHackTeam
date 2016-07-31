var data = require('./all-by-oc.json'),
	jsonfile = require('jsonfile'),
	_ = require('lodash');

var result;

// We know this
// result.nodes.push({"name": "Population"});
// result.nodes.push({"name": "Male"});
// result.nodes.push({"name": "Female"});
// result.links.push({"source": 0, "target": 1, "value": data.Male.total});
// result.links.push({"source": 0, "target": 2, "value": data.Female.total});

var gearMap = {
	// "nug": "0",
    "ng1": "0 - -1k",
    "ng2": "-1k - -3k",
    "ng3": "-3k - -7k",
    "ng4": "Over -7k",
    "pg1": "0-1k",
    "pg2": "1-3k",
    "pg3": "3-7k",
    "pg4": "Over 7k"
};

if(process.argv.length > 2 && process.argv[2] === "oc"){
	result = {
		nodes: [{"name": "Geared population"},
				{"name": "Male"},
				{"name": "Female"},
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
				{"name": "0-1k"},
				{"name": "1-3k"},
				{"name": "3-7k"},
				{"name": "Over 7k"},
				{"name": "0 - -1k"},
				{"name": "-1k - -3k"},
				{"name": "-3k - -7k"},
				{"name": "Over -7k"}],
		links: []
	};
}else{
	result = {
		nodes: [{"name": "Geared population"},
				{"name": "Male"},
				{"name": "Female"},
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
				{"name": "0-1k"},
				{"name": "1-3k"},
				{"name": "3-7k"},
				{"name": "Over 7k"},
				{"name": "0 - -1k"},
				{"name": "-1k - -3k"},
				{"name": "-3k - -7k"},
				{"name": "Over -7k"}],
		links: []
	};
}

result.links.push({"source": 0, "target": 1, "value": data.Male.total});
result.links.push({"source": 0, "target": 2, "value": data.Female.total});

for(var prop in data['Male']){
	// 'ages' or 'occp'
	for(var group in data['Male'][prop]){
		// Age group or occp type
		result.links.push({"source": 1, 
			"target": _.findIndex(result.nodes, function(o){return o.name == group;}), 
			"value": data['Male'][prop][group].total});
		// Gear
		for(var gear in gearMap){
			result.links.push({"source": _.findIndex(result.nodes, function(o){return o.name == group;}), 
				"target": _.findIndex(result.nodes, function(o){return o.name == gearMap[gear];}), 
				"value": data['Male'][prop][group][gear]});
		}
	}
}

for(var prop in data['Female']){
	// 'ages' or 'occp'
	for(var group in data['Female'][prop]){
		// Age group or occp type
		result.links.push({"source": 2, 
			"target": _.findIndex(result.nodes, function(o){return o.name == group;}), 
			"value": data['Female'][prop][group].total});
		// Gear
		for(var gear in gearMap){
			result.links.push({"source": _.findIndex(result.nodes, function(o){return o.name == group;}), 
				"target": _.findIndex(result.nodes, function(o){return o.name == gearMap[gear];}), 
				"value": data['Female'][prop][group][gear]});
		}
	}
}



var file = "./ad-hoc/sankey-all-by-oc.json";
jsonfile.writeFile(file, result, {spaces: 2}, function(err) {
	console.error('Error:' + err);
});
