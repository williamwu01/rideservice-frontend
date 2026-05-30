"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Globe3D({ scrollY }: { scrollY: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const groupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 4.5;

    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

    // ── Outer wireframe globe ──────────────────────────────────────────────
    const sphereGeo = new THREE.SphereGeometry(1.5, 28, 28);
    const wireGeo = new THREE.WireframeGeometry(sphereGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x00a0dc, transparent: true, opacity: 0.18 });
    const wireframe = new THREE.LineSegments(wireGeo, wireMat);
    group.add(wireframe);

    // ── Inner glowing sphere ───────────────────────────────────────────────
    const innerGeo = new THREE.SphereGeometry(1.42, 64, 64);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x001a33,
      transparent: true,
      opacity: 0.85,
    });
    group.add(new THREE.Mesh(innerGeo, innerMat));

    // ── Latitude / longitude rings ─────────────────────────────────────────
    const ringMat = new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.35 });
    [0, 30, -30, 60, -60].forEach((lat) => {
      const rad = (lat * Math.PI) / 180;
      const r = Math.cos(rad) * 1.52;
      const y = Math.sin(rad) * 1.52;
      const ring = new THREE.RingGeometry(r - 0.004, r + 0.004, 64);
      const mesh = new THREE.Mesh(ring, new THREE.MeshBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.3, side: THREE.DoubleSide }));
      mesh.rotation.x = Math.PI / 2;
      mesh.position.y = y;
      group.add(mesh);
    });
    [0, 45, 90, 135].forEach((lon) => {
      const rad = (lon * Math.PI) / 180;
      const ring = new THREE.RingGeometry(1.515, 1.525, 64);
      const mesh = new THREE.Mesh(ring, new THREE.MeshBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.2, side: THREE.DoubleSide }));
      mesh.rotation.y = rad;
      group.add(mesh);
    });

    // ── Floating particles ─────────────────────────────────────────────────
    const count = 500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = 1.8 + Math.random() * 1.2;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0x00a0dc, size: 0.022, transparent: true, opacity: 0.7 });
    group.add(new THREE.Points(particleGeo, particleMat));

    // ── Gold accent dots on surface ────────────────────────────────────────
    const dotCount = 80;
    const dotPositions = new Float32Array(dotCount * 3);
    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      dotPositions[i * 3] = 1.55 * Math.sin(phi) * Math.cos(theta);
      dotPositions[i * 3 + 1] = 1.55 * Math.sin(phi) * Math.sin(theta);
      dotPositions[i * 3 + 2] = 1.55 * Math.cos(phi);
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
    const dotMat = new THREE.PointsMaterial({ color: 0xd4af37, size: 0.04, transparent: true, opacity: 0.9 });
    group.add(new THREE.Points(dotGeo, dotMat));

    // ── Animate ────────────────────────────────────────────────────────────
    let elapsed = 0;
    let last = performance.now();
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const now = performance.now();
      elapsed += (now - last) / 1000;
      last = now;
      group.rotation.y = elapsed * 0.18;
      group.rotation.x = Math.sin(elapsed * 0.1) * 0.08;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!canvas) return;
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  // Scroll-driven scale — globe shrinks as user scrolls down
  const scale = Math.max(0.4, 1 - scrollY * 0.0008);
  const opacity = Math.max(0, 1 - scrollY * 0.0015);

  return (
    <canvas
      ref={canvasRef}
      style={{ transform: `scale(${scale})`, opacity, transition: "transform 0.05s linear, opacity 0.05s linear" }}
      className="w-full h-full"
    />
  );
}
