import { Mesh, MeshBasicMaterial, TextureLoader,
    PlaneGeometry
} from '../../three/threebuild/three_module.js';

function createGround() {
     const textureLoader = new TextureLoader();

    const texture = textureLoader.load('uv-test-col.png');

    const groundGeometry = new PlaneGeometry(500, 500);
    const groundMaterial = new MeshBasicMaterial({
        // color: 'pink',
        map: texture,
    });
    const ground = new Mesh(groundGeometry, groundMaterial); 
    ground.receiveShadow = true;
    ground.position.set(0, -180, 0);
    ground.rotation.set(-Math.PI/2, 0, 0);
    ground.name = 'ground';
    return ground;
}
export { createGround };
