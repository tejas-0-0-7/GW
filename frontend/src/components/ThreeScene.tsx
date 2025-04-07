
import { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 20;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);
    
    // Create lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x6E59A5, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0x567FEA, 1);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);
    
    // Create geometric shapes
    const shapes: THREE.Mesh[] = [];
    const geometry1 = new THREE.TorusKnotGeometry(3, 0.8, 100, 16);
    const material1 = new THREE.MeshPhongMaterial({
      color: 0x567FEA,
      wireframe: false,
      transparent: true,
      opacity: 0.6,
    });
    const torusKnot = new THREE.Mesh(geometry1, material1);
    torusKnot.position.set(-5, 0, 0);
    scene.add(torusKnot);
    shapes.push(torusKnot);
    
    const geometry2 = new THREE.IcosahedronGeometry(2, 0);
    const material2 = new THREE.MeshPhongMaterial({
      color: 0x6E59A5,
      wireframe: true,
    });
    const icosahedron = new THREE.Mesh(geometry2, material2);
    icosahedron.position.set(5, 0, 0);
    scene.add(icosahedron);
    shapes.push(icosahedron);
    
    const geometry3 = new THREE.OctahedronGeometry(1.5, 0);
    const material3 = new THREE.MeshPhongMaterial({
      color: 0xE5DEFF,
      wireframe: false,
      transparent: true,
      opacity: 0.7,
    });
    const octahedron = new THREE.Mesh(geometry3, material3);
    octahedron.position.set(0, 4, 0);
    scene.add(octahedron);
    shapes.push(octahedron);

    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX - windowHalfX) / 100;
      mouseY = (event.clientY - windowHalfY) / 100;
    });

    // Scroll position effect
    let scrollY = window.scrollY / 500;
    
    window.addEventListener('scroll', () => {
      scrollY = window.scrollY / 500;
    });

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      shapes.forEach((shape, i) => {
        shape.rotation.x += 0.001 + (i * 0.0005);
        shape.rotation.y += 0.002 + (i * 0.0005);
        
        // Apply subtle mouse movement effect
        shape.position.x += (mouseX - shape.position.x) * 0.01;
        shape.position.y += (-mouseY - shape.position.y) * 0.01;
        
        // Apply scroll position effect
        shape.position.z = Math.sin(scrollY + i) * 2;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', (event) => {});
      window.removeEventListener('scroll', () => {});
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="canvas-container" />;
};

export default ThreeScene;
