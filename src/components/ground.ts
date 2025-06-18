import { Mesh, MeshStandardMaterial,
    PlaneGeometry
} from '../../three/threebuild/three_module.js';

function createGround() {
    const groundGeometry = new PlaneGeometry(500, 500);
    const groundMaterial = new MeshStandardMaterial({color: 'pink'});
    const ground = new Mesh(groundGeometry, groundMaterial); 
    ground.receiveShadow = true;
    ground.position.set(0, -180, 0);
    ground.rotation.set(-Math.PI/2, 0, 0);
    return ground;
}
export { createGround };
