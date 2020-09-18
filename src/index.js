// 引入组件
import FloatingBall from './FloatingBall.vue';

FloatingBall.install = Vue => Vue.component(FloatingBall.name, FloatingBall.default);

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(FloatingBall);
}

export default FloatingBall;
