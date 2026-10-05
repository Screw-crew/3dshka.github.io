import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Сцена
const scene = new THREE.Scene();

// Камера
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 20);

// Рендерер
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Свет
scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
scene.add(light);

// Материал — серый
const material = new THREE.MeshStandardMaterial({ color: 0x888888 });

// Три фигуры
const cube = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), material);
cube.position.set(-4, 1, 0);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), material);
sphere.position.set(-1.5, 1, 0);

const torus = new THREE.Mesh(new THREE.TorusGeometry(1, 0.3, 16, 48), material);
torus.position.set(1.5, 1, 0);

scene.add(cube, sphere, torus);

// Загрузка своей модели
const loader = new GLTFLoader();
let model = null;

loader.load(
    'https://raw.githubusercontent.com/Screw-crew/3d/main/ebi_shrimp_rigged.glb',
    (gltf) => {
        model = gltf.scene;

        model.scale.set(0.3, 0.3, 0.3);
        model.position.set(4, 0, 0);

        scene.add(model);
        console.log('Модель загружена:', model);
    },
    (xhr) => {
        console.log(`Загрузка: ${(xhr.loaded / xhr.total * 100).toFixed(0)}%`);
    },
    (err) => {
        console.error('Ошибка загрузки модели:', err);
    }
);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);

// Анимация
function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    sphere.rotation.y += 0.02;

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;

    if (model) model.rotation.y += 0.01;

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Ресайз
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
