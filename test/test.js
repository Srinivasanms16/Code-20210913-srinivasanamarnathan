var assert = require('assert');
const {calculateBMI} = require("../index.js");

describe('calculateBMI', function() {
  
    let detail = { Gender: "Female", HeightCm: 166,
      WeightKg: 62};

    it('should add 3 new columns Bmi Index, BMI Category and health risk', function() {
      assert.deepStrictEqual(calculateBMI(detail),[ 37.34939759036145, 'Severely obese', 'High risk' ])

    });
  
});