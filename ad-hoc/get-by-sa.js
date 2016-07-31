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
 	var result = _.reduce(gearingArray, function(aggregate, row) {
			 if(!row.sa4) return aggregate;
			 if(!aggregate[row.sa4]) {
			 	if(process.argv.length > 2 && process.argv[2] === "oc"){
			 		aggregate[row.sa4] = {sa4: row.sa4, male: { total: 0, occp: {}}, female: { total: 0, occp: {}}};
			 	}else{
				 	aggregate[row.sa4] = {sa4: row.sa4, male: { total: 0, ages: {}}, female: { total: 0, ages: {}}};
			 	}
			 }

			 if(row.sex == "Male"){
			 	aggregate[row.sa4].male.total++;

			 	if(process.argv.length > 2 && process.argv[2] === "oc"){
			 		aggregateOccp(aggregate[row.sa4].male);
			 	}else{
			 		aggregateAge(aggregate[row.sa4].male);
			 	}
			 }else{
			 	aggregate[row.sa4].female.total++;

			 	if(process.argv.length > 2 && process.argv[2] === "oc"){
			 		aggregateOccp(aggregate[row.sa4].female);
			 	}else{
			 		aggregateAge(aggregate[row.sa4].female);
			 	}
			 }

			 function aggregateOccp(entity) {
			 	if(!entity.occp[row.occupation]){
				 	entity.occp[row.occupation] = {
				 		total: 0,
				 		ng: 0,
				 		pg: 0,
				 		nug: 0,
				 		ng1: 0, ng2: 0, ng3: 0, ng4: 0,
				 		pg1: 0, pg2: 0, pg3: 0, pg4: 0
				 	};
				 }else{
				 	entity.occp[row.occupation].total++;
				 	aggregateGear(entity.occp[row.occupation]);
				 }
			 }

			 function aggregateAge(entity) {
			 	if(!entity.ages[row.age]){
				 	entity.ages[row.age] = {
				 		total: 0,
				 		ng: 0,
				 		pg: 0,
				 		nug: 0,
				 		ng1: 0, ng2: 0, ng3: 0, ng4: 0,
				 		pg1: 0, pg2: 0, pg3: 0, pg4: 0
				 	};
				 }else{
				 	entity.ages[row.age].total++;
				 	aggregateGear(entity.ages[row.age]);
				 }
			 }

			 function aggregateGear(entity) {
			 	if(row.gearing > 0) {
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
			 	}else entity.nug++;
			 }

		  return aggregate;
		}, {});

 		// console.log(result);
		result = _.toArray(result);

		var file;
		if(process.argv.length > 2 && process.argv[2] === "oc"){
			file = './ad-hoc/by-sa-by-oc.json';
		}else{
		 	file = './ad-hoc/by-sa-by-age.json';
		}
		jsonfile.writeFile(file, result, {spaces: 2}, function(err) {
		  console.error('Error:' + err);
		});
 });