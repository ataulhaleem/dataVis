export function  linReg(x,y){
    // console.log(xArray.length,yArray.length)
    var xArray = []
    var yArray = []
    var x_,y_;
    var xSum = 0;
    var ySum = 0;
    var xxSum = 0;
    var xySum = 0;
    var yySum = 0
    var r2;
    for (var i = 0; i < x.length-1; i ++) {
        x_ = parseFloat(x[i]);
        y_ = parseFloat(y[i]);
        xSum += x_
        ySum += y_
        xArray.push(x_);
        yArray.push(y_);
        // console.log(xsum,ysum)
        xxSum += x_ * x_;
        xySum += x_ * y_;
        yySum += y_ * y_;
      
    }

    var count = xArray.length;


    // Calculate slope and intercept
    var slope = (count * xySum - xSum * ySum) / (count * xxSum - xSum * xSum);
    var intercept = (ySum / count) - (slope * xSum) / count;

    // Generate values
    var xMax = Math.max(...xArray);
    var xMin = Math.min(...xArray);

    var xValues = [];
    var yValues = [];
    for (var x = xMin; x <= xMax; x += 1) {
    xValues.push(x);
    yValues.push(x * slope + intercept);
    }
    // var yMin = Math.min(...yValues);
    // var yMax = Math.max(...yValues);
    r2 = Math.pow((count*xySum - xSum*ySum)/Math.sqrt((count*xxSum-xSum*xSum)*(count*yySum-ySum*ySum)),2);
    console.log("rsquared is : ",r2);

    return {x:xValues, y:yValues, mode:"line" , text: `R^2:  ${r2}`, textposition: 'top'} //{x: [x2Min,x2Max],y: [yMin, yMax],  mode:'line'}

}


export function heatMap(array){

}