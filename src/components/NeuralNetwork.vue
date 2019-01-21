<template>
  <div class="NeuralNetwork">
    <div id="storingArea">
      <p>Store image as number:</p>
      <button v-for="digit in digits" :key="digit" v-on:click="storeImage(digit)">
        {{digit}}
      </button>
      <button v-on:click="learn" v-if="!isLearning">Learn</button>
      <button v-if="isLearning">Shhhh! ....It's learning</button>
    </div>
    <div id="guessArea">
      <button v-on:click="guess">Guess Image</button>
      <p id="guess"></p>
      <p v-for="i in guess" :key="i.id">{{i}}: {{i}}</p>
    </div>
  </div>
</template>

<script>
// import { neuron } from '../js/neuron.js'
import neuron from '../js/neuron.js'
// var neuron = require('../js/neuron.js')

export default {
  name: 'NeuralNetwork',
  data: function(){
      return{
        digits: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        sideSize: 10,
        // totalSize: 25,
        imageObjectList: [],
        nnLayer1: [],
        nnLayer2: [],
        nnLayer3: [],
        nLessons: 500,
        nLevel2Nodes: 100,
        nLevel3Nodes: 10,
        learningSpeed: 0.2,
        stepSize: 0.5,
        guessResults: [0,0,0,0,0,0,0,0,0,0],
        isLearning: false
      }
  },
  props: {
    msg: String
  },
  methods: {
    storeImage: function(id){
      var image = this.$parent.arrayfyImage(this.sideSize)
      this.imageObjectList.push({
        'number': id,
        'image': image
      })
      this.$parent.clearCanvas()
    },
    learn: function () {
      this.isLearning = true
      var tempStepSize = this.stepSize
      // var nCorrectMax = this.calculateNumberOfCorrectGuesses(false)
      var totalDistanceMin = this.calculateTotalProximityOfGuesses(false)

      for (var lesson = 0; lesson < this.nLessons; lesson++){
        this.setNewTestValues(tempStepSize)
        var newDistance = this.calculateTotalProximityOfGuesses(true)
        
        if(newDistance < totalDistanceMin){
          totalDistanceMin = newDistance
          this.acceptTestValues(1)
        // } else {
        //   tempStepSize *= 0.97
        }
      }
      this.isLearning = false
    },
    fillNNLayer: function(nInput){
      var arr = []
      for ( var input=0; input < nInput; input++){
        arr.push(Math.random()*2-1)
      }
      return arr
    },
    calculateTotalProximityOfGuesses: function(isTest){
      var totalDistance = 0;
      var penalty = 0.2

      this.imageObjectList.forEach(imageObject => {
        var resultArray = this.getOutput( imageObject.image , isTest)
        var highestProb = Math.max(...resultArray)
        var selectedNumber = resultArray.indexOf(highestProb)

        totalDistance += 1-highestProb
        if(selectedNumber !== imageObject.number){
          totalDistance += penalty
        } 
      })

      return totalDistance
    },
    // calculateNumberOfCorrectGuesses: function(isTest){
      
    //   var nCorrect = 0
    //   this.imageObjectList.forEach(imageObject => {
    //     var resultArray = this.getOutput( imageObject.image , isTest)
    //     var highestProb = Math.max(...resultArray)
    //     var selectedNumber = resultArray.indexOf(highestProb)
    //     if(selectedNumber == imageObject.number){
    //       nCorrect++
    //     }
    //   })
    //   return nCorrect
    // },
    getOutput: function(imageArr, isTest){
      var output1 = []
      var output2 = []
      var output3 = []
      for(var neuron = 0; neuron < this.sideSize * this.sideSize; neuron ++){
        output1.push( this.nnLayer1[neuron].processInput([imageArr[neuron]], isTest) ) 
      }
      for(var neuron = 0; neuron < this.nLevel2Nodes; neuron ++){
        output2.push( this.nnLayer2[neuron].processInput(output1, isTest) ) 
      }
      for(var neuron = 0; neuron < this.nLevel3Nodes; neuron ++){
        output3.push( this.nnLayer3[neuron].processInput(output2, isTest) ) 
      }
      return output3
    },
    setNewTestValues: function(tempStepSize){
      this.nnLayer1.forEach(neuron => {
        neuron.generateTestArray(tempStepSize)
      })
      this.nnLayer2.forEach(neuron => {
        neuron.generateTestArray(tempStepSize)
      })
      this.nnLayer3.forEach(neuron => {
        neuron.generateTestArray(tempStepSize)
      })
    },
    acceptTestValues: function(fraction){
      this.nnLayer1.forEach(neuron => {
        neuron.acceptTestArray(fraction)
      })
      this.nnLayer2.forEach(neuron => {
        neuron.acceptTestArray(fraction)
      })
      this.nnLayer3.forEach(neuron => {
        neuron.acceptTestArray(fraction)
      })
    },
    guess: function(){
      var imgArr = this.$parent.arrayfyImage(this.sideSize)
      this.guessResults = this.getOutput(imgArr, false)
      //present the results
      var highestProb = Math.max(...this.guessResults)
      var index = this.guessResults.indexOf(highestProb)
      document.getElementById('guess').innerHTML = index
    }
  },
  mounted: function(){
    var neuronFile = require('../js/neuron.js')

    for (var n = 0; n < this.sideSize * this.sideSize; n++) {  
      var arr = this.fillNNLayer( 1 )
      var neur = new neuronFile.neuron( arr )
      this.nnLayer1.push( neur )
    }
    for (var neuron = 0; neuron < this.nLevel2Nodes; neuron++) {   
      this.nnLayer2.push( new neuronFile.neuron( this.fillNNLayer( this.sideSize * this.sideSize)))
    }
    for (var neuron = 0; neuron < this.nLevel3Nodes; neuron++) { 
      this.nnLayer3.push( new neuronFile.neuron( this.fillNNLayer(this.nLevel2Nodes)))
    }
  }
}
</script>

<style scoped>

</style>
