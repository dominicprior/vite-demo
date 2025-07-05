import { Mesh, MeshStandardMaterial,
    TorusGeometry
} from '../../three/threebuild/three_module.js';

function createDonut() {
    const donutGeometry = new TorusGeometry(100, 50, 8, 8);
    const donutMaterial = new MeshStandardMaterial();
    donutMaterial.color.set('purple');
    donutMaterial.metalness = 1;
    donutMaterial.roughness = 0.5;
    donutMaterial.side = 2; // DoubleSide
    donutMaterial.flatShading = true; // Flat shading for a more geometric look
    donutMaterial.shadowSide = 2; // DoubleSide for shadows
    // donutMaterial.wireframe = true;
    const donut = new Mesh(donutGeometry, donutMaterial); 
    donut.castShadow = true;
    donut.name = 'donut';
    return donut;
}
export { createDonut };
