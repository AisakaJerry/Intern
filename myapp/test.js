list = ['0.92', '0.22', '0.79']
newList = []
for (var i = 0; i < 3; i++){
    newList.push([list[i], i+1])
}
newList.sort(function(x,y){
    return y[0]-x[0]
})
console.log(newList)
