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
    // console.log("rsquared is : ",r2);

    return {x:xValues, y:yValues, mode:"line" , text: `R^2:  ${r2}`, textposition: 'left'} //{x: [x2Min,x2Max],y: [yMin, yMax],  mode:'line'}

}


// export function ManhattanHeatMap(xArray,yArray, inputData){
//     var z = []
//     // var dist = []

//     // for(let i=0; i< xArray.length;i++){
//     //     var pointDists = [];
//     //     for(let j=0; i< yArray.length;j++){
//     //         var itemX = xArray[i]
//     //         var itemY = yArray[i]
//     //         inputData.map(obj => {
//     //             var X1 = parseFloat(obj[itemX]).toFixed(2);
//     //             var X2 = parseFloat(obj[itemY]).toFixed(2);
//     //             pointDists.push(Math.abs(X2 - X1))
//     //         })  
        
//     //     }
//     //     z.push(pointDists)
//     //     console.log(z)

//     // }

//     xArray.map(itemX => {
//         var pointDists = [];
//         yArray.map(itemY => {
//             inputData.map(obj => {
//                 var X1 = parseFloat(obj[itemX]).toFixed(2);
//                 var X2 = parseFloat(obj[itemY]).toFixed(2);
//                 // console.log(Math.abs(X1-X2).toFixed(2) + pointDists)
//                 // pointDists += (Math.abs(X2 - X1));
//                 pointDists.push(Math.abs(X2 - X1))
//             })  
//             var sum = pointDists.reduce((a, b) => a + b, 0);
//             dist.push(sum)
//             console.log(pointDists)
//         })
//         z.push(dist)
//         dist = []
//         console.log(z)
//     })
//     return z
// }



  
// export function correlationHeatMap(xArray,yArray, inputData){
//     var z = []
//     xArray.map(itemX => {
//         var dist = []
//         yArray.map(itemY => {
//             var xvals = []
//             var yvals = []
//             inputData.map(obj => {
//                 xvals.push(obj[itemX])
//                 yvals.push(obj[itemY])
//             })  
//             dist.push()
//         })
//         z.push(dist)
//     })
//     return z
// }