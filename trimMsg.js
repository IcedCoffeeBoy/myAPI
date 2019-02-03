function trimMessage(msg){
    var lines = msg.split(" @")
    return lines.slice(1)
}

var msg = "Hello students! @studentagnes@example.com @studentmiche@example.com" 
var trimmedMsg = trimMessage(msg)
console.log(trimmedMsg)