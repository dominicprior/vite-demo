import { WebGLRenderer,
  // BasicShadowMap
} from '../../three/threebuild/three_module.js';

function createRenderer() {
  const renderer = new WebGLRenderer({ antialias: true });
  // renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = BasicShadowMap;
  // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  return renderer;
}

export { createRenderer };
