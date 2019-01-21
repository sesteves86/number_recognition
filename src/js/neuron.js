// export default class neuron{
export class neuron{
    constructor(weightArray){
        this.weightArray = weightArray
        this.testArray = JSON.parse(JSON.stringify(weightArray))
    }
    processInput(inputArray, isTest){
        this.checkIfInputHasRightSize(inputArray)

        var sum = 0
        if(isTest){
            for(var i =0; i< inputArray.length; i++){
                sum += inputArray[i] * this.testArray[i]
            }
        } else {
            for(var i =0; i< inputArray.length; i++){
                sum += inputArray[i] * this.weightArray[i]
            }
        }
        

        return 1/(1+Math.exp(-sum)) // sigmoidal function
    }
    setTestArray(testArray){
        this.testArray = testArray
    }
    generateTestArray(stepSize){
        var arraySize = this.weightArray.length
        for( var i = 0; i < arraySize; i++){
            this.testArray[i] = (Math.random()-0.5)*stepSize
        }
    }
    acceptTestArray(fraction){
        for(var i = 0; i < this.weightArray.length; i++){
            var dif = this.weightArray[i] - this.testArray[i]
            this.weightArray[i] += dif * fraction
        }
    }
    checkIfInputHasRightSize(inputArray){
        if(inputArray.length !== this.weightArray.length)
        throw "Array sizes don't match"
    }
}

// module.exports.neuron = neuron

// export default neuron