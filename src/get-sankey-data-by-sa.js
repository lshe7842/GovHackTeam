var jsonfile = require('jsonfile'),
	_ = require('lodash');

module.exports = function(code, group){

	var result, data;

	if(group === "age"){
		data = require('../ad-hoc/by-sa-by-age.json');
	}else if(group === "sex"){
		data = require('../ad-hoc/by-sa-by-sex.json');
	}else {
		data = require('../ad-hoc/by-sa-by-occupation.json');
	}

	data = _.find(data, function(o){return o.sa4 == code;});
	workData = _.cloneDeep(data);
	delete workData.sa4;

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
	if(group === "sex"){
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
	}else if(group === "occupation"){
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

	for(var prop in workData){
		// Age group or occp type
		result.links.push({"source": 0, 
			"target": _.findIndex(result.nodes, function(o){return o.name == prop;}), 
			"value": workData[prop].total});
		// Gear
		for(var gear in gearMap){
			result.links.push({"source": _.findIndex(result.nodes, function(o){return o.name == prop;}), 
				"target": _.findIndex(result.nodes, function(o){return o.name == gearMap[gear];}), 
				"value": workData[prop][gear]});
		}
	}

	return result;
};