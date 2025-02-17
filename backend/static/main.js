import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';

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

function loadTextures() {
    const textureLoader = new THREE.TextureLoader();
    const names = ['sun', 'earth', 'saturn']

    let textures = [];
    for (let i = 0; i < 3; i++) {
        textures.push(textureLoader.load(`/static/textures/2k_${names[i]}.jpg`));  // Added .jpg extension
    }

    return textures;
}

function createSolarSystem() {
    let solarSystem = new SolarSystem();

    const textures = loadTextures();

    // Create the Sun
    const sunGeometry = new THREE.SphereGeometry(100, 32, 16);
    const sunMaterial = new THREE.MeshBasicMaterial({ map: textures[0] });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    solarSystem.addPlanet(new Planet("sun", sun));

    // Create the Earth
    const earthGeometry = new THREE.SphereGeometry(5, 32, 16);
    const earthMaterial = new THREE.MeshBasicMaterial({ map: textures[1] });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    solarSystem.addPlanet(new Planet("earth", earth));

    // Create Saturn
    const saturnGeometry = new THREE.SphereGeometry(50, 32, 16);
    const saturnMaterial = new THREE.MeshBasicMaterial({ map: textures[2] });
    const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
    solarSystem.addPlanet(new Planet("saturn", saturn));

    return solarSystem;
}

function init() {
    const solarSystem = createSolarSystem();
    let planets = solarSystem.getPlanets();

    // Create scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.z = 20;

    let sun = planets[0].object;
    let earth = planets[1].object;
    let saturn = planets[2].object;

    scene.add(sun);
    scene.add(earth);
    scene.add(saturn);

    // Set initial positions of the planet and Saturn (orbit around the sun)
    earth.position.x = 200;  // Planet distance from the Sun
    saturn.position.x = 300;  // Saturn distance from the Sun (increased from 700)

    // Scale down the Sun, planet, and Saturn for visibility
    sun.scale.set(0.1, 0.1, 0.1);
    earth.scale.set(0.05, 0.05, 0.05);
    saturn.scale.set(0.1, 0.1, 0.1);

    animate(scene, camera, earth);
}

// Animation loop
let angle = 0;  // Angle for orbiting the planet and Saturn

function animate(scene, camera, earth) {

    // Create renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Rotate the planets around their own axis (self-rotation)
    earth.rotation.x += 0.01;
    earth.rotation.y += 0.01;
    
    // Orbit the planet around the sun (orbiting effect)
    angle += 0.01;  // Increase the speed of the orbit
    earth.position.x = 400 * Math.cos(angle);  // x position on orbit
    earth.position.z = 400 * Math.sin(angle);  // z position on orbit
    // Render the scene
    renderer.render(scene, camera);
}

init();
