import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './VolSurface.css';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function ivSurf(k, t) {
  const vol =
    0.268 -
    0.128 * (k - 1) +
    0.115 * (k - 1) * (k - 1) -
    0.032 * Math.sqrt(Math.max(0.01, t)) +
    0.018 * Math.exp(-6 * t);

  return clamp(vol, 0.07, 0.82);
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

function VolSurface({ active }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const groupRef = useRef(null);
  const animationIdRef = useRef(null);
  const resizeHandlerRef = useRef(null);

  const overlayStats = {
    atm: (ivSurf(1, 0.45) * 100).toFixed(1),
    skew: ((ivSurf(0.9, 0.45) - ivSurf(1.1, 0.45)) * -100).toFixed(1),
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return undefined;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#06060e');

    const camera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 2.8, 5.2);
    camera.lookAt(0, 0.6, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor('#06060e', 1);
    mount.appendChild(renderer.domElement);

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    scene.add(new THREE.AmbientLight('#0c0c22', 0.9));

    const directionalLight = new THREE.DirectionalLight('#fff0d0', 2);
    directionalLight.position.set(3, 5, 3);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight('#0066cc', 0.7, 16);
    pointLight.position.set(-3, -1, -2);
    scene.add(pointLight);

    const surfaceGeometry = new THREE.PlaneGeometry(5.2, 4, 44, 44);
    surfaceGeometry.rotateX(-Math.PI / 2);

    const positions = surfaceGeometry.attributes.position;
    const colors = [];
    const green = new THREE.Color('#00d96e');
    const amber = new THREE.Color('#d4920a');
    const red = new THREE.Color('#d63030');

    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const z = positions.getZ(index);
      const k = ((x + 2.6) / 5.2) * 0.82 + 0.59;
      const t = ((z + 2) / 4) * 1.95 + 0.05;
      const vol = ivSurf(k, t);

      positions.setY(index, vol * 4.8 - 0.35);

      const color =
        vol < 0.5
          ? green.clone().lerp(amber, clamp((vol - 0.09) / 0.21, 0, 1))
          : amber.clone().lerp(red, clamp((vol - 0.3) / 0.28, 0, 1));
      colors.push(color.r, color.g, color.b);
    }

    surfaceGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    surfaceGeometry.computeVertexNormals();

    const group = new THREE.Group();
    const surfaceMesh = new THREE.Mesh(
      surfaceGeometry,
      new THREE.MeshPhongMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        shininess: 70,
      }),
    );
    const wireframeMesh = new THREE.Mesh(
      surfaceGeometry.clone(),
      new THREE.MeshBasicMaterial({
        color: '#0e1c30',
        wireframe: true,
        opacity: 0.12,
        transparent: true,
      }),
    );
    group.add(surfaceMesh);
    group.add(wireframeMesh);
    scene.add(group);
    groupRef.current = group;

    const grid = new THREE.GridHelper(8, 18, '#0d1022', '#0a0e1e');
    grid.position.y = -0.22;
    scene.add(grid);

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
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      groupRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !groupRef.current) {
      return;
    }

    if (!active) {
      if (animationIdRef.current) {
        window.cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      return;
    }

    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !groupRef.current) {
        return;
      }

      groupRef.current.rotation.y += 0.0032;
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationIdRef.current = window.requestAnimationFrame(animate);
    };

    animationIdRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animationIdRef.current) {
        window.cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    };
  }, [active]);

  return (
    <div className="vol-surface">
      <div ref={mountRef} className="vol-surface-canvas" />
      <div className="vol-surface-label">Implied Vol Surface</div>
      <div className="vol-surface-stats">
        ATM: {overlayStats.atm}% · SKEW: -{overlayStats.skew}%
      </div>
      <div className="vol-surface-legend">
        <span className="legend-item">
          <span className="legend-swatch low" />
          <span>Low vol</span>
        </span>
        <span className="legend-item">
          <span className="legend-swatch mid" />
          <span>Mid vol</span>
        </span>
        <span className="legend-item">
          <span className="legend-swatch high" />
          <span>High vol</span>
        </span>
      </div>
    </div>
  );
}

export default VolSurface;
