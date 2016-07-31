var fs = require('fs'),
	csv = require('fast-csv'),
	jsonfile = require('jsonfile'),
	_ = require('lodash');

var stream = fs.createReadStream("./data/ato/GEARING-SA.csv");
var gearingArray = [];
var saSummary = null;
csv
 .fromStream(stream, {headers: true})
 .on("data", function(data){
	  if(!data["input.SA4"]) return;
		gearingArray.push({sex: data["input.Sex"],
							age: data["input.AGE"],
							occupation: data["input.Occupation"],
							sa4: data["input.SA4"],
							gearing: data["GEARING"],
							gearingFlag: data["GEARINGFLAG"],
						});
 })
 .on("end", function(){
 	var group = [process.argv[2]];
 	var result = _.reduce(gearingArray, function(aggregate, row) {
			 if(!row[group]) return aggregate;

			 if(!aggregate[row[group]]) {
		 		aggregate[row[group]] = { total: 0, 
		 			ng: 0,
			 		pg: 0,
			 		nug: 0,
			 		ng1: 0, ng2: 0, ng3: 0, ng4: 0,
			 		pg1: 0, pg2: 0, pg3: 0, pg4: 0};
			 }else{
			 	aggregateGear(aggregate[row[group]]);
			 }

			 function aggregateGear(entity) {
			 	if(row.gearing > 0) {
			 		aggregate.total++;
			 		entity.total++;

			 		entity.pg++;
			 		if(row.gearing > 0 && row.gearing <= 10000){
			 			entity.pg1++;
			 		}else if(row.gearing > 10000 && row.gearing <= 30000){
			 			entity.pg2++;
			 		}else if(row.gearing > 30000 && row.gearing <= 70000){
			 			entity.pg3++;
			 		}else{
			 			entity.pg4++;
			 		}
			 	}else if(row.gearing < 0){
			 		aggregate.total++;
			 		entity.total++;

			 		entity.ng++;
			 		if(row.gearing < 0 && row.gearing >= -10000){
			 			entity.ng1++;
			 		}else if(row.gearing < -10000 && row.gearing >= 30000){
			 			entity.ng2++;
			 		}else if(row.gearing < 30000 && row.gearing >= 70000){
			 			entity.ng3++;
			 		}else{
			 			entity.ng4++;
			 		}
			 	}
			 }

		  return aggregate;
		}, {total: 0});

 		// console.log(result);
		// result = _.toArray(result);

		var file;
		file = './ad-hoc/all-by-' + group + '.json';
		jsonfile.writeFile(file, result, {spaces: 2}, function(err) {
		  console.error('Error:' + err);
		});
 });