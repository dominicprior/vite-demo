import { Mesh, MeshStandardMaterial,
    TorusGeometry
} from '../three/threebuild/three_module.js';

function createDonut() {
    const donutGeometry = new TorusGeometry(100, 50, 8, 20);
    const donutMaterial = new MeshStandardMaterial();
    const donut = new Mesh(donutGeometry, donutMaterial); 
    donut.castShadow = true;
    return donut;
}
export { createDonut };
