<template>
  <div
    class="floatingBall"
    :class="animateClass"
    ref="floatingBall"
    @mouseenter="show"
    @mouseleave="hide"
    @mousedown="goStart"
  >
    <slot>
      <span class="ball"></span>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'FloatingBall',
  data () {
    return {
      animateClass: {
        'animate-tr': true
      },
      time: 0,
      mousedown: false,
      timer: null
    };
  },
  mounted () {
    this.hideHalf();
  },
  methods: {
    showMonitor (e) {
      if (new Date().getTime() - this.time < 300) {
        this.$emit('click', e);
      }
    },
    show (e) {
      if (!this.mousedown && e.target.className.indexOf('floatingBall') >= 0) {
        this.animateClass = {
          'animate-tr': true
        };
        this.showHalf();
      }
    },
    hide (e) {
      if (!this.mousedown && e.target.className.indexOf('floatingBall') >= 0) {
        this.animateClass = {
          'animate-tr': true
        };
        this.hideHalf();
      }
    },
    // 获取计算后的translateY
    getComputedTranslateY: function (dom) {
      let startY = 0;
      let startX = 0;
      let style = window.getComputedStyle ? window.getComputedStyle(dom, null) : null || dom.currentStyle;
      let matrix = style['transform'];
      if (matrix && matrix !== 'none' && matrix.indexOf('matrix3d') < 0) {
        startX = Number(matrix.replace(/matrix\(|\)/g, '').split(',')[4]);
        startY = Number(matrix.replace(/matrix\(|\)/g, '').split(',')[5]);
      }
      // 设配ie浏览器
      if (matrix && matrix !== 'none' && matrix.indexOf('matrix3d') >= 0) {
        startX = Number(matrix.replace(/matrix3d\(|\)/g, '').split(',')[12]);
        startY = Number(matrix.replace(/matrix3d\(|\)/g, '').split(',')[13]);
      }
      return [startX, startY];
    },
    goStart (e) {
      // 鼠标按下，计算当前元素距离可视区的距离
      const vm = this;
      const documentW = document.body.clientWidth;
      const documentH = document.body.clientHeight;
      const btnH = vm.$refs.floatingBall.offsetHeight;
      const btnW = vm.$refs.floatingBall.offsetWidth;
      vm.animateClass = {
        'animate-tr': false
      };
      vm.mousedown = true;
      this.time = new Date().getTime();
      document.onmousemove = function (e) {
        let disY = e.clientY;
        let disX = e.clientX;
        if (
          disY > btnH / 2 &&
          disY + btnH / 2 <= documentH &&
          disX > btnW / 2 &&
          disX + btnW / 2 <= documentW
        ) {
          vm.$refs.floatingBall.style.cssText = `;transform: translate3d(${disX - btnW / 2}px, ${disY - btnH / 2}px, 0px)`;
        }
      };
      document.onmouseup = function (e) {
        let [x, y] = vm.getComputedTranslateY(vm.$refs.floatingBall);
        if (x >= documentW / 2) {
          vm.$refs.floatingBall.style.cssText = `;transform: translate3d(${documentW - btnW}px, ${y}px, 0px)`;
        } else {
          vm.$refs.floatingBall.style.cssText = `;transform: translate3d(0px, ${y}px, 0px)`;
        }
        document.onmousemove = null;
        document.onmouseup = null;
        vm.animateClass = {
          'btn-animate': true,
          'animate-tr': true
        };
        vm.mousedown = false;
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          vm.hideHalf();
        }, 1000);
      };
    },
    hideHalf () {
      const btnW = this.$refs.floatingBall.offsetWidth;
      const documentW = document.body.clientWidth;
      let [x, y] = this.getComputedTranslateY(this.$refs.floatingBall);
      if (x <= 0) {
        this.$refs.floatingBall.style.cssText = `;transform: translate3d( -${btnW / 2}px, ${y}px, 0px)`;
      } else if (x >= documentW - btnW) {
        this.$refs.floatingBall.style.cssText = `;transform: translate3d( ${documentW - btnW / 2}px, ${y}px, 0px)`;
      }
    },
    showHalf () {
      const documentW = document.body.clientWidth;
      const btnW = this.$refs.floatingBall.offsetWidth;
      let [x, y] = this.getComputedTranslateY(this.$refs.floatingBall);
      if (x < 0) {
        this.$refs.floatingBall.style.cssText = `;transform: translate3d( 0px, ${y}px, 0px)`;
      } else if (x >= documentW - btnW / 2) {
        this.$refs.floatingBall.style.cssText = `;transform: translate3d( ${x - btnW / 2}px, ${y}px, 0px)`;
      }
    }
  }
};
</script>

<style lang='less' scoped>
.floatingBall {
  position: fixed;
  z-index: 2000;
  transform: translate3d(0, 0, 0);
  .ball{
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: aqua;
  }
}

.animate-tr {
  transition: all 0.5s;
}
</style>
