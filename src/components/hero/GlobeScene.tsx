"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const LOCATIONS = [
  { lat: 48.8566, lon: 2.3522 },    // Paris
  { lat: 33.8938, lon: 35.5018 },    // Beirut
  { lat: 45.5017, lon: -73.5673 },   // Montreal
  { lat: 41.3874, lon: 2.1686 },     // Barcelona
  { lat: 37.7749, lon: -122.4194 },  // San Francisco
  { lat: 48.5734, lon: 1.5585 },     // La Boissière-École
  { lat: 52.52, lon: 13.405 },       // Berlin
  { lat: 41.9028, lon: 12.4964 },    // Rome
  { lat: 40.1792, lon: 44.4991 },    // Yerevan
  { lat: 30.0444, lon: 31.2357 },    // Cairo
];

function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function Globe() {
  const globeRef = useRef<THREE.Group>(null!);
  const mouseRef = useRef({ x: 0, y: 0 });

  const dotPositions = useMemo(
    () => LOCATIONS.map((loc) => latLonToVec3(loc.lat, loc.lon, 2.02)),
    []
  );

  const arcLines = useMemo(() => {
    const lines: THREE.Line[] = [];
    const material = new THREE.LineBasicMaterial({
      color: "#06B6D4",
      transparent: true,
      opacity: 0.3,
    });
    for (let i = 0; i < LOCATIONS.length - 1; i++) {
      const start = latLonToVec3(LOCATIONS[i].lat, LOCATIONS[i].lon, 2);
      const end = latLonToVec3(
        LOCATIONS[i + 1].lat,
        LOCATIONS[i + 1].lon,
        2
      );
      const mid = start.clone().add(end).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(2.6);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(30);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      lines.push(new THREE.Line(geometry, material));
    }
    return lines;
  }, []);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002;
      const targetX = mouseRef.current.y * 0.3;
      const targetZ = mouseRef.current.x * 0.3;
      globeRef.current.rotation.x +=
        (targetX - globeRef.current.rotation.x) * 0.02;
      globeRef.current.rotation.z +=
        (targetZ - globeRef.current.rotation.z) * 0.02;
    }
  });

  return (
    <group
      ref={globeRef}
      onPointerMove={(e) => {
        mouseRef.current = {
          x: (e.point.x / 3) * 0.5,
          y: (e.point.y / 3) * 0.5,
        };
      }}
    >
      {/* Wireframe globe */}
      <mesh>
        <icosahedronGeometry args={[2, 3]} />
        <meshBasicMaterial
          color="#06B6D4"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Outer glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.1, 2.15, 64]} />
        <meshBasicMaterial
          color="#06B6D4"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Location dots */}
      {dotPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#22D3EE" />
        </mesh>
      ))}

      {/* Connection arcs */}
      {arcLines.map((lineObj, i) => (
        <primitive key={i} object={lineObj} />
      ))}
    </group>
  );
}

export function GlobeScene() {
  return (
    <div className="w-full h-full" style={{ background: "linear-gradient(to bottom, #0F172A, #1E293B)" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <Globe />
      </Canvas>
    </div>
  );
}
