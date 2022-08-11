// This is user Generated Module
// this will return the basic info about our module
// console.log(module);
// module.exports="Hello World";
module.exports.getDate=getDate;
function getDate() {
    
    let today=new Date();
    var day="";
    // created option object
    let options=
    {
        weekday:'long' , 
        day:'numeric' , 
        month:"long",
        year:"numeric"
    };
    // console.log(today.toLocaleDateString("en-US",options));
    day=today.toLocaleDateString("en-US",options);
    return day;
}
module.exports.getDay=getDay;
function getDay() {
    
    let today=new Date();
    var day="";
    // created option object
    let options=
    {
        weekday:'long' 
    };
    console.log(today.toLocaleDateString("en-US",options));
    day=today.toLocaleDateString("en-US",options);
    return day;
}
// console.log(module.exports);