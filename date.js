
let today = new Date();
let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
}
exports.getDate = function(){
    let currentDay = today.toLocaleDateString("en-US",options);
    return currentDay;
}

exports.getDay = function (){
    let options = {
        weekday: "long"
    }
    let currentDay = today.toLocaleDateString("en-US",options);
    return currentDay;
}