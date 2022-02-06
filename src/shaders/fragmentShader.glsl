uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uVelo;
uniform float uAmount;

varying vec2 vUv;

float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
    uv -= disc_center;
    uv*= uResolution;

    float dist = sqrt(dot(uv, uv));

    return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
}

float random(vec2 p) {
    vec2 K1 = vec2(
        23.14069263277926,
        2.665144142690225
    );

    return fract( cos( dot(p,K1) ) * 12345.6789 );
}

void main() {
    vec2 newUV = vUv;

    float c = circle(newUV, uMouse, 0.0, 0.2);

    float r = texture2D(tDiffuse, newUV.xy += c * ((uVelo * .9) / 2.0)).x;
	float g = texture2D(tDiffuse, newUV.xy += c * ((uVelo * .925) / 2.0)).y;
	float b = texture2D(tDiffuse, newUV.xy += c * ((uVelo * .95) / 2.0)).z;

    vec4 newColor = vec4(r, g, b, 1.);

    newUV.y *= random(vec2(newUV.y, uAmount));
    newColor.rgb += random(newUV)* 0.10;

    gl_FragColor = newColor;
}