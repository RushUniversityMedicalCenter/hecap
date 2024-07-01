<template>
  <v-row class="row_margin">
    <canvas ref="canvas" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing"
      @touchstart="startDrawing" @touchmove="draw" @touchend="stopDrawing"></canvas>
    <v-btn class="btn-margin" @click="clearSignature" >Clear</v-btn>
  </v-row>
</template>

<script>
import { useAppStore } from '@/store/app';
import { computed } from 'vue';
const appStore = useAppStore()
export default {
  data() {
    return {
      isAgeConfirmed: computed(()=>appStore.isAgeConfirmed),
      drawing: false,
      context: null,
    };
  },
  methods: {
    startDrawing(event) {
      //console.log("===startDrawing")
      event.preventDefault(); // Prevent default touch behavior (e.g., scrolling)
      this.drawing = true;
      const canvas = this.$refs.canvas;
      this.context = canvas.getContext('2d');
      this.context.beginPath();
      this.draw(event);
    },
    draw(event) {
      //console.log("===draw")
      if (!this.drawing) return;

      const canvas = this.$refs.canvas;
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX || event.touches[0].clientX) - rect.left;
      const y = (event.clientY || event.touches[0].clientY) - rect.top;

      this.context.lineWidth = 2;
      this.context.lineCap = 'round';
      this.context.strokeStyle = 'black';

      this.context.lineTo(x, y);
      this.context.stroke();
      this.context.beginPath();
      this.context.moveTo(x, y);
    },
    stopDrawing() {
      //console.log("===stopDrawing")
      this.drawing = false;
      this.context = null;
      const canvas = this.$refs.canvas;
      const signatureData = canvas.toDataURL('image/png');
      appStore.setSignature(signatureData)
      //console.log('stopDrawing()=>Signature Data in appstore:', appStore.signature);
    },
    clearSignature() {
      const canvas = this.$refs.canvas;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      appStore.setSignature('')
    },
    logSignature() {
      const canvas = this.$refs.canvas;
      const signatureData = canvas.toDataURL('image/png');
      //console.log('Signature Data:', signatureData);
      appStore.setSignature(signatureData)
    },
    resizeCanvas() {
      const canvas = this.$refs.canvas;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      //console.log("===resizeCanvas()",canvas.width, canvas.height, rect, useAppStore().signature )
      if (useAppStore().signature.includes('data:image')) {
        this.drawDefaultImage()
      }
    },
    drawDefaultImage() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');
      
      const image = new Image();
      image.src = useAppStore().signature;
      
      image.onload = () => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizeCanvas);
    this.resizeCanvas();
    // if (useAppStore().signature.includes('data:image')) {
    //   this.drawDefaultImage()
    // }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeCanvas);
    //this.logSignature() 
  },
};
</script>

<style scoped>
canvas {
  border: 1px solid #ccc;
  max-width: 80%; /* Make the canvas responsive */
  max-height: 80%;
  width: 90%;
  height: 100px;
}
.btn-margin {
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: 12px;
  margin-right: 12px;
}
.row_margin {
  margin-top: 2px;
  margin-bottom: 0px;
  margin-left: 2px;
  margin-right: 2px;
}
</style>
