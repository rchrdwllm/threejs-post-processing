varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform vec2 uScrollOffset;
uniform float uVelo;

void main() {
    vec2 uv = vUv;

    float r = texture2D(tDiffuse, uv.xy += (uVelo * .009) / 30.0).r;
    float g = texture2D(tDiffuse, uv.xy += (uVelo * .0095) / 30.0).g;
    float b = texture2D(tDiffuse, uv.xy += (uVelo * .00925) / 30.0).b;

    vec3 texture = texture2D(tDiffuse, uv).rgb;

    gl_FragColor = vec4(r, g, b, 1.0);
}