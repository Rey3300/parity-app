import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STOCKS } from '../../constants/mockData.js';

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const STOCK_KEYS = Object.keys(STOCKS);
const HERO_NODE_COUNT = 120;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function fibonacciPoint(index, total, radius) {
  const y = 1 - (index / (total - 1)) * 2;
  const radial = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = GOLDEN_ANGLE * index;

  return new THREE.Vector3(
    Math.cos(theta) * radial * radius,
    y * radius,
    Math.sin(theta) * radial * radius,
  );
}

function nodeColor(score) {
  if (score <= 35) {
    return new THREE.Color('#a9861a');
  }

  if (score >= 65) {
    return new THREE.Color('#37547a');
  }

  return new THREE.Color('#d4920a');
}

function disposeScene(scene) {
  scene.traverse((child) => {
    if (child.geometry) {
      child.geometry.dispose();
    }

    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
}

function HeroScene({ active, ticker }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const animationIdRef = useRef(null);
  const animateRef = useRef(null);
  const resizeHandlerRef = useRef(null);
  const particlesRef = useRef(null);
  const globeRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return undefined;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#04040b');

    const camera = new THREE.PerspectiveCamera(
      34,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0.22, 15.3);
    camera.lookAt(0, -0.05, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor('#04040b', 1);
    mount.appendChild(renderer.domElement);

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    scene.add(new THREE.AmbientLight('#090a18', 1.02));

    const directionalLight = new THREE.DirectionalLight('#dce8ff', 0.78);
    directionalLight.position.set(1.5, 5.5, 7);
    scene.add(directionalLight);

    const amberLight = new THREE.PointLight('#d4920a', 0.62, 26);
    amberLight.position.set(3.5, 1.8, 5.5);
    scene.add(amberLight);

    const blueLight = new THREE.PointLight('#223b68', 0.74, 28);
    blueLight.position.set(-5.2, 0.4, 4.4);
    scene.add(blueLight);

    const globeGroup = new THREE.Group();
    globeGroup.position.set(0, -0.28, -0.5);
    scene.add(globeGroup);
    globeRef.current = globeGroup;

    const nodeGeometrySmall = new THREE.SphereGeometry(0.045, 10, 10);
    const nodeGeometryLarge = new THREE.SphereGeometry(0.1, 12, 12);
    const nodeEntries = [];

    for (let index = 0; index < HERO_NODE_COUNT; index += 1) {
      const anchorTicker = STOCK_KEYS[index] || STOCK_KEYS[index % STOCK_KEYS.length];
      const baseScore =
        index < STOCK_KEYS.length
          ? STOCKS[anchorTicker].score
          : 18 + ((index * 11) % 62);
      const position = fibonacciPoint(index, HERO_NODE_COUNT, 5.55);
      const mesh = new THREE.Mesh(
        index % 6 === 0 ? nodeGeometryLarge : nodeGeometrySmall,
        new THREE.MeshPhongMaterial({
          color: nodeColor(baseScore),
          emissive: nodeColor(baseScore).clone().multiplyScalar(0.18),
          shininess: 110,
        }),
      );

      mesh.position.copy(position);
      globeGroup.add(mesh);
      nodeEntries.push({
        ticker: index < STOCK_KEYS.length ? STOCK_KEYS[index] : `NODE${index}`,
        position: position.clone(),
        });
    }

    const highPositions = [];
    const lowPositions = [];
    for (let left = 0; left < nodeEntries.length; left += 1) {
      for (let right = left + 1; right < nodeEntries.length; right += 1) {
        const distance = nodeEntries[left].position.distanceTo(nodeEntries[right].position);
        if (distance > 2.08) {
          continue;
        }

        const target = distance < 1.42 ? highPositions : lowPositions;
        target.push(
          nodeEntries[left].position.x,
          nodeEntries[left].position.y,
          nodeEntries[left].position.z,
          nodeEntries[right].position.x,
          nodeEntries[right].position.y,
          nodeEntries[right].position.z,
        );
      }
    }

    const highEdgeGeometry = new THREE.BufferGeometry();
    highEdgeGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(highPositions, 3),
    );
    const highEdges = new THREE.LineSegments(
      highEdgeGeometry,
      new THREE.LineBasicMaterial({
        color: '#445d8a',
        transparent: true,
        opacity: 0.18,
      }),
    );
    globeGroup.add(highEdges);

    const lowEdgeGeometry = new THREE.BufferGeometry();
    lowEdgeGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(lowPositions, 3),
    );
    const lowEdges = new THREE.LineSegments(
      lowEdgeGeometry,
      new THREE.LineBasicMaterial({
        color: '#2d4160',
        transparent: true,
        opacity: 0.08,
      }),
    );
    globeGroup.add(lowEdges);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.15, 0.24, 48),
      new THREE.MeshBasicMaterial({
        color: '#d4920a',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.72,
      }),
    );
    globeGroup.add(ring);
    ringRef.current = ring;

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 260;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    for (let index = 0; index < particleCount; index += 1) {
      particlePositions[index * 3] = (Math.random() - 0.5) * 25;
      particlePositions[index * 3 + 1] = -9 + Math.random() * 18;
      particlePositions[index * 3 + 2] = -9 + Math.random() * 10;
      particleSpeeds[index] = 0.0008 + Math.random() * 0.0024;
    }
    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3),
    );

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: '#304664',
        size: 0.03,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      }),
    );
    particlesRef.current = { points: particles, speeds: particleSpeeds };
    scene.add(particles);

    const updateRing = (selectedTicker) => {
      const selected =
        nodeEntries.find((entry) => entry.ticker === selectedTicker) || nodeEntries[0];
      const normal = selected.position.clone().normalize();

      ring.position.copy(selected.position.clone().multiplyScalar(1.02));
      ring.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        normal,
      );
    };

    updateRing(ticker);

    const onResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) {
        return;
      }

      cameraRef.current.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight,
      );
    };

    resizeHandlerRef.current = onResize;
    window.addEventListener('resize', onResize);

    animateRef.current = () => {
      const rendererInstance = rendererRef.current;
      const sceneInstance = sceneRef.current;
      const cameraInstance = cameraRef.current;
      if (!rendererInstance || !sceneInstance || !cameraInstance) {
        return;
      }

      const t = performance.now() * 0.001;

      cameraInstance.position.x = Math.sin(t * 0.08) * 0.75;
      cameraInstance.position.y = 0.15 + Math.cos(t * 0.06) * 0.18;
      cameraInstance.position.z = 15.1 + Math.cos(t * 0.05) * 0.42;
      cameraInstance.lookAt(0, -0.05, 0);

      globeGroup.rotation.y += 0.0018;
      globeGroup.rotation.x = Math.sin(t * 0.05) * 0.03;
      globeGroup.rotation.z = Math.cos(t * 0.04) * 0.018;
      ring.material.opacity = 0.54 + Math.sin(t * 1.8) * 0.1;

      if (particlesRef.current) {
        const positions = particlesRef.current.points.geometry.attributes.position.array;
        const { speeds } = particlesRef.current;
        for (let index = 0; index < speeds.length; index += 1) {
          const yIndex = index * 3 + 1;
          const xIndex = index * 3;
          positions[yIndex] += speeds[index];
          positions[xIndex] += Math.sin(t + index * 0.15) * 0.0004;
          if (positions[yIndex] > 9) {
            positions[yIndex] = -9;
          }
        }
        particlesRef.current.points.geometry.attributes.position.needsUpdate = true;
      }

      rendererInstance.render(sceneInstance, cameraInstance);
      animationIdRef.current = window.requestAnimationFrame(animateRef.current);
    };

    if (active) {
      animationIdRef.current = window.requestAnimationFrame(animateRef.current);
    }

    ring.userData.updateRing = updateRing;

    return () => {
      if (animationIdRef.current) {
        window.cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }

      if (resizeHandlerRef.current) {
        window.removeEventListener('resize', resizeHandlerRef.current);
      }

      disposeScene(scene);
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      particlesRef.current = null;
      globeRef.current = null;
      ringRef.current = null;
      animateRef.current = null;
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!ringRef.current || !ringRef.current.userData.updateRing) {
      return;
    }

    ringRef.current.userData.updateRing(ticker);
  }, [ticker]);

  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
      return;
    }

    if (!active) {
      if (animationIdRef.current) {
        window.cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      return;
    }

    if (animationIdRef.current) {
      return;
    }
    animationIdRef.current = window.requestAnimationFrame(animateRef.current);
    return () => {
      if (animationIdRef.current) {
        window.cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    };
  }, [active]);

  return <div ref={mountRef} className="hero-scene" />;
}

export default HeroScene;
