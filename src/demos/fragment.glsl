uniform float uBlue;
uniform vec3 uColor;
uniform sampler2D uTexture;
varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
void main() {
    // vec2 a = vec2(3.0);
    // vec3 b = vec3(a.yx, 0.5);
    // b.xy *= 0.5;

    // float k = 0.001 / pow(distance(vUv, vec2(0.5)), 4.0);  // nice star
    // gl_FragColor = vec4(vec3(k), 1.0);

    vec2 pos = vec2(vUv.x-0.5, vUv.y-0.5);
    float a = 120.0 * atan(pos.x, pos.y) / 6.28;
    float s = sin(a);
    float k = length(pos) - 0.2*s;
    gl_FragColor = vec4(k*vUv, k, 1.0);
}
