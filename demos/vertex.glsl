varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // gl_Position.y *= 0.39;
    gl_Position.z *= -1.0;
    // gl_Position.w *= 2.0;
}
