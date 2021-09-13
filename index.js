const StreamArray = require('stream-json/streamers/StreamArray');
const path = require('path');
const fs = require('fs');
const { Writable } = require('stream');


const jsonStream = StreamArray.withParser({});
let Underweight = 0;
let NormalWeight = 0;
let Overweight = 0;
let Obese =0;
let SeverObese =0;
let VerySeverObese =0;


jsonStream.on('data', ({value}) => {
    const [bmi,categoty,helthrisk] = calculateBMI(value);
    value.BMI = bmi
    value.BMICategory = categoty;
    value.HealthRisk = helthrisk;
});

jsonStream.on('end', () => {
    console.log(`Underweight ${Underweight}`);
    console.log(`NormalWeight ${NormalWeight}`);
    console.log(`Obese ${Obese}`);
    console.log(`SeverObese ${SeverObese}`);
    console.log(`VerySeverObese ${VerySeverObese}`);
});

const calculateBMI = (input)=>{
    let {WeightKg,HeightCm} = input;
    let BMICategory,HealthRisk;
    
    let bmi = WeightKg/(HeightCm/100);
    if(bmi <= 18.4)
    {
        Underweight += 0;
        BMICategory = "Underweight";
        HealthRisk = "Malnutrition risk"
    }
    else if(bmi >= 18.4 && bmi <= 24.9)
    {
        NormalWeight += 1;
        BMICategory = "Normal weight";
        HealthRisk = "Low risk";
    }
    else if(bmi >= 25 && bmi <= 29.9)
    {
        Overweight += 1;
        BMICategory = "Overweight";
        HealthRisk = "Enhanced risk";
    }
    else if(bmi >= 30 && bmi <= 34.9)
    {
        Obese += 1;
        BMICategory = "Moderately obese";
        HealthRisk = "Medium risk";
    }
    else if(bmi >= 35 && bmi <= 39.9)
    {
        SeverObese += 1;
        BMICategory = "Severely obese";
        HealthRisk = "High risk";
    }
    else 
    {
        VerySeverObese += 1;
        BMICategory = "Very severely obese";
        HealthRisk = "Very high risk";
    }

    return [bmi,BMICategory,HealthRisk];
}

const processingStream = new Writable({
    write({key, value}, encoding, next) {
        fs.appendFile(path.join(__dirname,"data", "Result.txt"), JSON.stringify(value)+"\n", function (err) {
            if (err) throw err;
          });
        next();
    },
    objectMode: true
});

const filename = path.join(__dirname,"data", "data.json");
fs.createReadStream(filename).pipe(jsonStream.input);
jsonStream.pipe(processingStream);

exports.calculateBMI = calculateBMI;
