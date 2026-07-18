import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Ashima 3D simplex noise (webgl-noise, MIT). Used for vertex displacement.
const noiseGLSL = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

const vertexShader = `
uniform float uTime;
uniform float uAmp;
uniform vec2 uPointer;
varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;
${noiseGLSL}
void main() {
  float n1 = snoise(position * 1.25 + vec3(0.0, 0.0, uTime * 0.22));
  float n2 = snoise(position * 2.6 + vec3(uTime * 0.16));
  float disp = n1 * 0.7 + n2 * 0.3;
  float pointerBulge = dot(normalize(position), normalize(vec3(uPointer * 1.4, 0.7)));
  disp += smoothstep(0.2, 1.0, pointerBulge) * 0.35;
  vDisp = disp;
  vec3 displaced = position + normal * disp * uAmp;
  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vView = -mv.xyz;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mv;
}
`

const fragmentShader = `
uniform vec3 uColorA;
uniform vec3 uColorB;
varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;
void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 2.0);
  vec3 col = mix(uColorA, uColorB, fres);
  col += uColorB * fres * 0.5;                          // brighter rim light
  col += uColorB * smoothstep(0.15, 0.95, vDisp) * 0.4; // glow on the peaks
  gl_FragColor = vec4(col, 1.0);
}
`

function Blob() {
  const mesh = useRef<THREE.Mesh>(null)
  const pointer = useRef(new THREE.Vector2())
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 0.4 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color('#14102a') },
      uColorB: { value: new THREE.Color('#b7a2ff') },
    }),
    [],
  )

  useFrame((state, delta) => {
    uniforms.uTime.value += delta
    pointer.current.lerp(state.pointer, 0.05)
    uniforms.uPointer.value.copy(pointer.current)
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.12
      mesh.current.rotation.x = pointer.current.y * 0.35
      mesh.current.rotation.z = -pointer.current.x * 0.12
    }
  })

  return (
    <mesh ref={mesh} scale={1.9} position={[1.25, 0, 0]}>
      <icosahedronGeometry args={[1, 10]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export default function HeroScene() {
  const wrapper = useRef<HTMLDivElement>(null)
  // Render only while the hero is on screen; past it, the canvas would
  // otherwise keep redrawing every frame and fight the scroll compositor.
  const [frameloop, setFrameloop] = useState<'always' | 'never'>('always')

  useEffect(() => {
    const el = wrapper.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      setFrameloop(entry.isIntersecting ? 'always' : 'never')
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrapper} style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        frameloop={frameloop}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Blob />
      </Canvas>
    </div>
  )
}
