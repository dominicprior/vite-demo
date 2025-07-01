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
    // a.r = 1.0;
    // a.g = 0.0;
    // b.xy *= 0.5;

    vec2 uv = vUv * 2.5;
    vec4 textureColor = texture2D(uTexture, uv);
    textureColor.r = 1.0 - textureColor.r; // invert red channel
    gl_FragColor = textureColor;
    // gl_FragColor = vec4(uv, uBlue, 1.0);
}
