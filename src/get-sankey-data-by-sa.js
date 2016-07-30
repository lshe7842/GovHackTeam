var jsonfile = require('jsonfile'),
	_ = require('lodash');

module.exports = function(code, group){

var data;
if(group === "age"){
	data = require('../ad-hoc/by-sa-by-age.json');
}else if(group === "oc"){
	data = require('../ad-hoc/by-sa-by-oc.json');
}
data = _.find(data, function(o){return o.sa4 == code;});

var result;

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

if(group === "oc"){
	result = {
		nodes: [{"name": "Geared population"},
				{"name": "male"},
				{"name": "female"},
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
}else if(group === "age"){
	result = {
		nodes: [{"name": "Geared population"},
				{"name": "male"},
				{"name": "female"},
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

result.links.push({"source": 0, "target": 1, "value": data.male.total});
result.links.push({"source": 0, "target": 2, "value": data.female.total});

for(var prop in data['male']){
	// 'ages' or 'occp'
	for(var group in data['male'][prop]){
		// Age group or occp type
		result.links.push({"source": 1, 
			"target": _.findIndex(result.nodes, function(o){return o.name == group;}), 
			"value": data['male'][prop][group].total});
		// Gear
		for(var gear in gearMap){
			result.links.push({"source": _.findIndex(result.nodes, function(o){return o.name == group;}), 
				"target": _.findIndex(result.nodes, function(o){return o.name == gearMap[gear];}), 
				"value": data['male'][prop][group][gear]});
		}
	}
}

for(var prop in data['female']){
	// 'ages' or 'occp'
	for(var group in data['female'][prop]){
		// Age group or occp type
		result.links.push({"source": 2, 
			"target": _.findIndex(result.nodes, function(o){return o.name == group;}), 
			"value": data['female'][prop][group].total});
		// Gear
		for(var gear in gearMap){
			result.links.push({"source": _.findIndex(result.nodes, function(o){return o.name == group;}), 
				"target": _.findIndex(result.nodes, function(o){return o.name == gearMap[gear];}), 
				"value": data['female'][prop][group][gear]});
		}
	}
}

return result;

};