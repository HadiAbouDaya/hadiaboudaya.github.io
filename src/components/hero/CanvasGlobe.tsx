"use client";

import { useRef, useEffect } from "react";

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
  { lat: 59.3293, lon: 18.0686 },    // Stockholm
  { lat: 38.7223, lon: -9.1393 },    // Lisbon
];

interface Point3D { x: number; y: number; z: number }

function latLonTo3D(lat: number, lon: number, r: number): Point3D {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return {
    x: -(r * Math.sin(phi) * Math.cos(theta)),
    y: r * Math.cos(phi),
    z: r * Math.sin(phi) * Math.sin(theta),
  };
}

function rotateY(p: Point3D, a: number): Point3D {
  const c = Math.cos(a), s = Math.sin(a);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}

function rotateX(p: Point3D, a: number): Point3D {
  const c = Math.cos(a), s = Math.sin(a);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}

function project(p: Point3D, cx: number, cy: number, fov: number) {
  const scale = fov / (fov - p.z);
  return { x: cx + p.x * scale, y: cy - p.y * scale, scale };
}

// Generate unit-sphere icosahedron edges (radius=1), scaled at draw time.
// Subdivision level 3 matches Three.js icosahedronGeometry(r, 3).
function generateUnitIcosahedronEdges(): [Point3D, Point3D][] {
  const t = (1 + Math.sqrt(5)) / 2;
  const raw: Point3D[] = [
    { x: -1, y: t, z: 0 }, { x: 1, y: t, z: 0 }, { x: -1, y: -t, z: 0 }, { x: 1, y: -t, z: 0 },
    { x: 0, y: -1, z: t }, { x: 0, y: 1, z: t }, { x: 0, y: -1, z: -t }, { x: 0, y: 1, z: -t },
    { x: t, y: 0, z: -1 }, { x: t, y: 0, z: 1 }, { x: -t, y: 0, z: -1 }, { x: -t, y: 0, z: 1 },
  ];
  const verts = raw.map(v => {
    const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    return { x: v.x / len, y: v.y / len, z: v.z / len };
  });

  const faces = [
    [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
    [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
    [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
    [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
  ];

  function midpoint(a: Point3D, b: Point3D): Point3D {
    const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2 };
    const len = Math.sqrt(m.x * m.x + m.y * m.y + m.z * m.z);
    return { x: m.x / len, y: m.y / len, z: m.z / len };
  }

  let currentFaces = faces.map(f => [verts[f[0]], verts[f[1]], verts[f[2]]] as [Point3D, Point3D, Point3D]);

  for (let sub = 0; sub < 3; sub++) {
    const newFaces: [Point3D, Point3D, Point3D][] = [];
    for (const [a, b, c] of currentFaces) {
      const ab = midpoint(a, b);
      const bc = midpoint(b, c);
      const ca = midpoint(c, a);
      newFaces.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    currentFaces = newFaces;
  }

  const edgeSet = new Set<string>();
  const edges: [Point3D, Point3D][] = [];

  for (const [a, b, c] of currentFaces) {
    const pairs: [Point3D, Point3D][] = [[a, b], [b, c], [c, a]];
    for (const [p1, p2] of pairs) {
      const k1 = `${p1.x.toFixed(4)},${p1.y.toFixed(4)},${p1.z.toFixed(4)}`;
      const k2 = `${p2.x.toFixed(4)},${p2.y.toFixed(4)},${p2.z.toFixed(4)}`;
      const key = k1 < k2 ? `${k1}|${k2}` : `${k2}|${k1}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push([p1, p2]);
      }
    }
  }

  return edges;
}

function generateArc(start: Point3D, end: Point3D, radius: number, segments: number): Point3D[] {
  const points: Point3D[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = { x: start.x * (1 - t) + end.x * t, y: start.y * (1 - t) + end.y * t, z: start.z * (1 - t) + end.z * t };
    const len = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
    const lift = 1 + 0.15 * Math.sin(Math.PI * t);
    const r = (radius * lift) / len;
    points.push({ x: p.x * r, y: p.y * r, z: p.z * r });
  }
  return points;
}

// Cached unit-sphere edges (generated once, never changes)
let _unitEdges: [Point3D, Point3D][] | null = null;
function getUnitEdges() {
  if (!_unitEdges) _unitEdges = generateUnitIcosahedronEdges();
  return _unitEdges;
}

export function CanvasGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const tiltRef = useRef({ x: 0.3 });
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx = context;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = media.matches;
    let width = 0;
    let height = 0;
    let idleReady = false;
    let inView = false;
    let running = false;
    let disposed = false;
    let lastTime: number | null = null;
    // Locations/arcs are invariant; resizing only changes their scale.
    const locations = LOCATIONS.map(loc => latLonTo3D(loc.lat, loc.lon, 1.01));
    const arcs = locations.slice(0, -1).map((point, index) => generateArc(point, locations[index + 1], 1.01, 30));

    function draw() {
    if (width <= 0 || height <= 0) return;
    const w = width;
    const h = height;
    ctx.clearRect(0, 0, w, h);

    // Match Three.js: camera at z=5, FOV 50deg, globe radius 2
    // Projected half-height at z=0 = 5 * tan(25deg) = 2.332 units
    // Globe radius 2 = 85.7% of viewport half-height
    const cx = w / 2;
    const cy = h / 2;
    const radius = h * 0.43;
    const fov = radius * 2.66;

    const rot = rotationRef.current;
    const tiltX = tiltRef.current.x;

    function transform(p: Point3D) {
      return rotateX(rotateY(p, rot), tiltX);
    }

    // Scale unit edges to current radius
    const unitEdges = getUnitEdges();

    // Draw icosahedron wireframe
    // Three.js uses flat opacity 0.15; Canvas 2D needs slight depth variation
    // to avoid looking completely flat, centered around 0.14
    ctx.lineWidth = 0.7;
    for (const [a, b] of unitEdges) {
      const sa = { x: a.x * radius, y: a.y * radius, z: a.z * radius };
      const sb = { x: b.x * radius, y: b.y * radius, z: b.z * radius };
      const ta = transform(sa);
      const tb = transform(sb);
      const avgZ = (ta.z + tb.z) / 2;
      const depthAlpha = 0.08 + 0.07 * ((avgZ + radius) / (2 * radius));
      ctx.strokeStyle = `rgba(6, 182, 212, ${depthAlpha.toFixed(3)})`;
      const pa = project(ta, cx, cy, fov);
      const pb = project(tb, cx, cy, fov);
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.stroke();
    }

    // Outer glow ring (Three.js: opacity 0.2, ring at 2.1-2.15)
    ctx.strokeStyle = "rgba(6, 182, 212, 0.20)";
    ctx.lineWidth = 2;
    const ringR = radius * 1.05;
    ctx.beginPath();
    for (let i = 0; i <= 64; i++) {
      const a = (2 * Math.PI * i) / 64;
      const p: Point3D = { x: ringR * Math.cos(a), y: 0, z: ringR * Math.sin(a) };
      const tp = transform(p);
      const pp = project(tp, cx, cy, fov);
      if (i === 0) ctx.moveTo(pp.x, pp.y);
      else ctx.lineTo(pp.x, pp.y);
    }
    ctx.stroke();

    // Connection arcs (Three.js: opacity 0.3)
    ctx.lineWidth = 1;
    for (const arc of arcs) {
      const arcPts = arc;
      ctx.beginPath();
      for (let j = 0; j < arcPts.length; j++) {
        const unit = arcPts[j];
        const tp = transform({ x: unit.x * radius, y: unit.y * radius, z: unit.z * radius });
        const avgDepth = (tp.z + radius) / (2 * radius);
        ctx.strokeStyle = `rgba(6, 182, 212, ${(0.15 + 0.15 * avgDepth).toFixed(3)})`;
        const pp = project(tp, cx, cy, fov);
        if (j === 0) ctx.moveTo(pp.x, pp.y);
        else ctx.lineTo(pp.x, pp.y);
      }
      ctx.stroke();
    }

    // Location dots (Three.js: sphereGeometry radius 0.04 at globe radius 2 = 2% of radius)
    const dotRadius = radius * 0.014;
    for (const loc of locations) {
      const p = { x: loc.x * radius, y: loc.y * radius, z: loc.z * radius };
      const tp = transform(p);
      const pp = project(tp, cx, cy, fov);
      const depthRatio = (tp.z + radius) / (2 * radius);
      const alpha = 0.3 + 0.7 * depthRatio;
      const dotSize = dotRadius * pp.scale;

      // Glow
      ctx.beginPath();
      ctx.arc(pp.x, pp.y, dotSize * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34, 211, 238, ${(alpha * 0.12).toFixed(3)})`;
      ctx.fill();

      // Dot
      ctx.beginPath();
      ctx.arc(pp.x, pp.y, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34, 211, 238, ${alpha.toFixed(3)})`;
      ctx.fill();
    }

    }

    function loop(time: number) {
      if (!running || disposed) return;
      // Reset on resume and cap gaps so a suspended tab cannot jump the globe.
      const dt = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      rotationRef.current += 0.12 * dt;
      const smoothing = 1 - Math.pow(0.98, dt * 60);
      tiltRef.current.x += (mouseRef.current.y * 0.3 - tiltRef.current.x) * smoothing;
      draw();
      frameRef.current = requestAnimationFrame(loop);
    }
    function sync() {
      const shouldRun = !disposed && idleReady && inView && !document.hidden && !reduced && width > 0 && height > 0;
      if (shouldRun && !running) {
        running = true;
        lastTime = null;
        frameRef.current = requestAnimationFrame(loop);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(frameRef.current);
        lastTime = null;
      }
    }
    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width > 0 && height > 0) {
        const dpr = window.devicePixelRatio || 1;
        const pixelWidth = Math.max(1, Math.round(width * dpr));
        const pixelHeight = Math.max(1, Math.round(height * dpr));
        if (canvas!.width !== pixelWidth || canvas!.height !== pixelHeight) {
          canvas!.width = pixelWidth;
          canvas!.height = pixelHeight;
        }
        ctx.setTransform(pixelWidth / width, 0, 0, pixelHeight / height, 0, 0);
        draw(); // Static redraw does not advance simulation state.
      }
      sync();
    }
    const onPreference = () => { reduced = media.matches; sync(); draw(); };
    const onVisibility = () => { sync(); };
    media.addEventListener("change", onPreference);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    resizeObserver?.observe(canvas);
    const observer = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    }) : null;
    observer?.observe(canvas);
    if (!observer) inView = true;
    resize();

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const kickoff = () => { if (!disposed) { idleReady = true; sync(); } };
    if (typeof window.requestIdleCallback === "function") idleId = window.requestIdleCallback(kickoff);
    else timeoutId = setTimeout(kickoff, 1);
    return () => {
      disposed = true;
      sync();
      cancelAnimationFrame(frameRef.current);
      observer?.disconnect();
      resizeObserver?.disconnect();
      media.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseRef.current = {
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
        };
      }}
      onMouseLeave={() => { mouseRef.current = { x: 0, y: 0 }; }}
    />
  );
}
