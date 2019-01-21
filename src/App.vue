<template>
  <div id="app">
    <div>
      <button v-on:click="clearCanvas">Clear</button>
      <canvas width="300" height="300" id="canvasDiv" v-on:mousedown="clickedCanvas" v-on:mousemove="mouseMove" v-on:mouseup="stopPainting"></canvas>
    </div>
    <NeuralNetwork></NeuralNetwork>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import NeuralNetwork from './components/NeuralNetwork.vue'

export default {
  name: 'app',
  components: {
    NeuralNetwork
  },
  data: function() {
    return{
      canvas: {},
      ctx: {},
      clickX: [],
      clickY: [],
      clickDrag: [],
      isPainting: false
      // sideSize: 4,
      // totalSize: 16 //4*4
    }
  },
  methods:{
    clickedCanvas: function (event) {
      this.isPainting = true
      
      var mouseX = event.clientX - this.canvas.offsetLeft
      var mouseY = event.clientY - this.canvas.offsetTop
      this.addClick(mouseX, mouseY, false)
      this.redraw()
    },
    mouseMove: function (event){
      if(!this.isPainting) return

      var mouseX = event.clientX - this.canvas.offsetLeft
      var mouseY = event.clientY - this.canvas.offsetTop
      
      this.addClick(mouseX, mouseY, true)
      this.redraw()
    },
    stopPainting(){
      this.isPainting = false
    },
    addClick(x, y, dragging){
      this.clickX.push(x)
      this.clickY.push(y),
      this.clickDrag.push(dragging)
    },
    redraw(){
      this.ctx.clearRect( 0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

      this.ctx.strokeStyle = "rgb(3,3,3)"
      this.ctx.lineJoin = "round"
      this.ctx.lineWidth = 5
      
      for(var i = 0; i < this.clickX.length; i++){
        this.ctx.beginPath()
        if(this.clickDrag[i]){
          this.ctx.moveTo(this.clickX[i-1], this.clickY[i-1])
        } else{
          this.ctx.moveTo(this.clickX[i]-1, this.clickY[i]-1)
        }

        this.ctx.lineTo(this.clickX[i], this.clickY[i])
        this.ctx.closePath()
        this.ctx.stroke()
      }
    },
    clearCanvas: function(){
      this.clickX = []
      this.clickY = []
      this.clickDrag = []
      this.ctx.clearRect( 0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    },
    arrayfyImage: function(sideSize){
      var imageArr = [sideSize * sideSize]
      var sideSizePixels = 300 / sideSize
      var position = 0
      for(var x = 0; x < sideSize; x++){
        for(var y = 0; y < sideSize; y++){
          var imageSegment = this.ctx.getImageData(
              sideSizePixels * x, 
              sideSizePixels * y, 
              sideSizePixels * (x + 1), 
              sideSizePixels * (y + 1)
          );
          imageArr[position] = this.processImageSegment(imageSegment)
          position++
        }
      }
      return imageArr
    },
    processImageSegment: function (imageSegment){
      var size = imageSegment.data.length / 4
      var totalColor = 0
      for( var i = 0; i< imageSegment.data.length; i+=4){
        totalColor += imageSegment.data[i]
      }

      return totalColor / size
    },
    getArrayfiedImage: function(){
      arrayfyImage()
    }
  },
  mounted: function() {
    this.canvas = document.getElementById("canvasDiv")
    this.ctx = this.canvas.getContext("2d")
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

canvas{
  border: 1px solid black;
}
</style>
