import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';
import { OrbitControls } from "https://esm.sh/three@0.165.0/examples/jsm/controls/OrbitControls.js";


class SolarSystem {
    constructor() {
        this.planets = [];
    }

    addPlanet(planet) {
        this.planets.push(planet);
    }

    getPlanets() {
        return this.planets;
    }
}

class Planet {
    constructor(name, object) {
        this.name = name;
        this.object = object;
    }
}

const textureLoader = new THREE.TextureLoader();

let speed = 1;
document.addEventListener('keydown', (event) => {
    if (event.key === 'a') {
        speed *= 1.2;
    } else if (event.key === 'd') {
        speed /= 1.2
    }
})

function loadTextures() {
    const names = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

    let textures = [];
    for (let i = 0; i < names.length; i++) {
        textures.push(textureLoader.load(`/static/textures/2k_${names[i]}.jpg`));  // Added .jpg extension
    }

    return textures;
}

function createOrbitPath(radius, segments = 100) {
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle)));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x808080 });

    return new THREE.Line(geometry, material);
}

function createPlanet(radius, position, texture) {
    const geometry = new THREE.SphereGeometry(radius, 30, 30);
    const material = new THREE.MeshStandardMaterial({ map: texture});
    const mesh = new THREE.Mesh(geometry, material);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    mesh.position.x = position;
    return {mesh, obj};
}


function createSolarSystem() {
    let solarSystem = new SolarSystem();

    const textures = loadTextures();

    // Create the Sun
    const sunGeometry = new THREE.SphereGeometry(16, 30, 30);
    const sunMaterial = new THREE.MeshBasicMaterial({ map: textures[0] });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    solarSystem.addPlanet(new Planet("sun", sun));


    // Create Saturn
    const saturnGeometry = new THREE.SphereGeometry(10, 30, 30);
    const saturnMaterial = new THREE.MeshStandardMaterial({ map: textures[6] });
    const saturnMesh = new THREE.Mesh(saturnGeometry, saturnMaterial);
    const saturnObj = new THREE.Object3D();
    saturnObj.add(saturnMesh);
    saturnMesh.position.x = 230;

    // Create Saturn's Ring
    const ringGeometry = new THREE.RingGeometry(10, 20, 30);
    const ringMaterial = new THREE.MeshStandardMaterial({ map: textureLoader.load(`/static/textures/2k_saturn_ring.png`), side: THREE.DoubleSide});
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    saturnObj.add(ringMesh);
    ringMesh.position.x = 230;
    ringMesh.rotation.x = -0.5 * Math.PI;

    solarSystem.addPlanet(new Planet("mercury", createPlanet(3, 50, textures[1])));
    solarSystem.addPlanet(new Planet("venus", createPlanet(5.8, 80, textures[2])));
    solarSystem.addPlanet(new Planet("earth", createPlanet(6, 120, textures[3])));
    solarSystem.addPlanet(new Planet("mars", createPlanet(4, 150, textures[4])));
    solarSystem.addPlanet(new Planet("jupiter", createPlanet(12, 190, textures[5])));

    solarSystem.addPlanet(new Planet("saturn", {saturnMesh, saturnObj}));

    solarSystem.addPlanet(new Planet("uranus", createPlanet(8, 310, textures[7])));
    solarSystem.addPlanet(new Planet("neptune", createPlanet(8, 350, textures[8])));
    
    return solarSystem;
}

function init() {
    const solarSystem = createSolarSystem();
    let planets = solarSystem.getPlanets();

    // Create the renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);

    const orbit = new OrbitControls(camera, renderer.domElement);
    camera.position.set(-90, 140, 400);
    orbit.update();

    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
    scene.add(pointLight);

    let sun = planets[0].object;
    let mercury = planets[1].object;
    let venus = planets[2].object;
    let earth = planets[3].object;
    let mars = planets[4].object;
    let jupiter = planets[5].object;
    let saturn = planets[6].object;
    let uranus = planets[7].object;
    let neptune = planets[8].object;
    

    scene.add(sun);

    scene.add(mercury.obj);
    scene.add(venus.obj);
    scene.add(earth.obj);
    scene.add(mars.obj)
    scene.add(jupiter.obj);
    scene.add(saturn.saturnObj);
    scene.add(uranus.obj);
    scene.add(neptune.obj);

    scene.add(createOrbitPath(50));  // Mercury
    scene.add(createOrbitPath(80));  // Venus
    scene.add(createOrbitPath(120)); // Earth
    scene.add(createOrbitPath(150)); // Mars
    scene.add(createOrbitPath(190)); // Jupiter
    scene.add(createOrbitPath(230)); // Saturn
    scene.add(createOrbitPath(310)); // Uranus
    scene.add(createOrbitPath(350)); // Neptune
    
    animate(scene, camera, sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, renderer);
}

function animate(scene, camera, sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, renderer) {
    // When mesh rotates, it's for planet rotation
    // When obj rotates, it's for revolution around the Sun

    sun.rotation.y += 0.03 * speed;

    mercury.mesh.rotation.y += 0.004 * speed;
    mercury.obj.rotation.y += 0.04 * speed;

    venus.mesh.rotation.y += 0.002 * speed;
    venus.obj.rotation.y += 0.015 * speed;

    earth.mesh.rotation.y += 0.02 * speed;
    earth.obj.rotation.y += 0.01 * speed;

    mars.mesh.rotation.y += 0.018 * speed;
    mars.obj.rotation.y += 0.008 * speed;

    jupiter.mesh.rotation.y += 0.04 * speed;
    jupiter.obj.rotation.y += 0.002 * speed;

    saturn.saturnMesh.rotation.y += 0.038 * speed;
    saturn.saturnObj.rotation.y += 0.0009 * speed;

    uranus.mesh.rotation.y += 0.03 * speed;
    uranus.obj.rotation.y += 0.0004 * speed;

    neptune.mesh.rotation.y += 0.032 * speed;
    neptune.obj.rotation.y += 0.0001 * speed;

    // Render the scene
    renderer.render(scene, camera);

    // Request next frame for animation
    requestAnimationFrame(() => animate(scene, camera, sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, renderer));
}

init();
