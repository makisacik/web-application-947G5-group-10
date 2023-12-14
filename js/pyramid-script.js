let worker;
let isWorkerActive = false;

let exampleSolution = [
  [
    [1, 1, 3, 6, 6],
    [1, 1, 3, 10, 6],
    [4, 4, 3, 6, 6],
    [4, 3, 3, 12, 12],
    [4, 12, 12, 12, 5],
  ],

  [
    [2, 2, 2, 10],
    [2, 8, 10, 9],
    [2, 11, 9, 9],
    [11, 9, 9, 5],
  ],

  [
    [8, 7, 10],
    [7, 7, 7],
    [11, 7, 5],
  ],

  [
    [8, 10],
    [11, 5],
  ],

  [[11]],
];

const threeDArray = [];

let solutionsArray = [];
let currentSolutionIndex = 0;

for (let i = 0; i < 5; i++) {
  threeDArray[i] = [];

  for (let j = 0; j < 5; j++) {
    threeDArray[i][j] = [];

    for (let k = 0; k < 5 - i; k++) {
      threeDArray[i][j][k] = 0;
    }
  }
}

for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    console.log(threeDArray[i][j].join(" "));
  }
  console.log("\n");
}

const colorsArray = [
  "#E71D10",
  "#EB68A4",
  "#FFBCDE",
  "#077FC8",
  "#FCE22C",
  "#B76AB0",
  "#6D3E8F",
  "#83C789",
  "#F36E23",
  "#00A235",
  "#F6B736",
  "#87C3E7",
];

import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js";

// Set up scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerHeight, 400);
document.querySelector("#three-container").appendChild(renderer.domElement);

// Create pyramid
const pyramid = new THREE.Group();
scene.add(pyramid);

const levels = 5;

function createPyramid(solutionArray) {
  for (let i = levels; i >= 1; i--) {
    const rowSize = i;
    for (let j = 0; j < rowSize; j++) {
      for (let k = 0; k < rowSize; k++) {
        const radius = 0.55;
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshBasicMaterial({
          color: 0xd520f7,
        });
        const sphere = new THREE.Mesh(geometry, material);

        sphere.position.y = (levels - i) * 2;
        sphere.position.x = j * 2 - (rowSize - 1);
        sphere.position.z = k * 2 - (rowSize - 1);

        // Set the color of the sphere
        let colorIndex = solutionArray[4 - (i - 1)][j][k];
        sphere.material.color.set(colorsArray[colorIndex]);

        // print i j k to console
        pyramid.add(sphere);
      }
    }
  }
}

// Set up camera position
camera.position.x = 5;
camera.position.y = 10;
camera.position.z = 10;

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.25; // friction/smoothness of the rotation
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Animation function
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

function resetCameraPosition() {
  stopCameraRotation();
  camera.position.set(5, 10, 10);
  camera.rotation.set(0, 0, 0);
  controls.reset();
  camera.lookAt(0, 0, 0);
}

let isCameraRotating = false;

function rotateCamera() {
  const rotateButton = document.querySelector("#rotateButton");
  if (isCameraRotating) {
    stopCameraRotation();
    rotateButton.innerHTML = "Rotate Camera";
    rotateButton.style.backgroundColor = "#007bff";
  } else {
    startCameraRotation();
    rotateButton.innerHTML = "Stop Rotating";
    rotateButton.style.backgroundColor = "#dc3545";
  }
}

function startCameraRotation() {
  camera.position.set(5, 10, 10);
  camera.rotation.set(0, 0, 0);
  controls.reset();
  camera.lookAt(0, 0, 0);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2;
  isCameraRotating = true;
}

function stopCameraRotation() {
  controls.autoRotate = false;
  isCameraRotating = false;
}

function solvePuzzleButtonClicked() {
  const buttonSolve = document.getElementById("solvePuzzleButton");
  const solutionLabel = document.getElementById("labelSolutionCount");
  const currentSolutionLabel = document.getElementById("labelCurrentSolution");

  if (isWorkerActive) {
    buttonSolve.textContent = "Solve Puzzle";
    buttonSolve.style.backgroundColor = "#007BFF";
    isWorkerActive = false;
    worker.terminate();
  } else {
    createPyramid(threeDArray);
    solutionsArray = [];
    solutionLabel.textContent = "";
    currentSolutionLabel.textContent = "";
    currentSolutionIndex = 0;
    worker = new Worker("../js/pyramid-solver.js");
    worker.postMessage("start");
    buttonSolve.style.backgroundColor = "#dc3545";
    buttonSolve.textContent = "Stop Solving";
    isWorkerActive = true;

    worker.onmessage = function (event) {
      const solution = event.data;
      solutionsArray.push(solution);

      if (solutionsArray.length == 1) {
        createPyramid(solution);
        currentSolutionLabel.textContent = "Current Solution: 1";
      }
      solutionLabel.textContent = "Solution Count: " + solutionsArray.length;

      console.log("solution: ", solution);
    };
  }
}

function nextSolutionButtonClicked() {
  console.log(currentSolutionIndex);
  if (solutionsArray.length == 0) {
    alert("No solutions to display");
  } else {
    if (currentSolutionIndex == solutionsArray.length - 1) {
      return;
    } else {
      currentSolutionIndex++;
    }

    createPyramid(solutionsArray[currentSolutionIndex]);
    const currentSolutionLabel = document.getElementById(
      "labelCurrentSolution"
    );
    currentSolutionLabel.textContent =
      "Current Solution: " + (currentSolutionIndex + 1);
  }
}

function previousSolutionButtonClicked() {
  console.log(currentSolutionIndex);

  if (solutionsArray.length == 0) {
    alert("No solutions to display");
  } else {
    if (currentSolutionIndex == 0) {
      return;
    } else {
      currentSolutionIndex--;
    }

    createPyramid(solutionsArray[currentSolutionIndex]);
    const currentSolutionLabel = document.getElementById(
      "labelCurrentSolution"
    );
    currentSolutionLabel.textContent =
      "Current Solution: " + (currentSolutionIndex + 1);
  }
}

document
  .querySelector("#resetButton")
  .addEventListener("click", resetCameraPosition);

document.querySelector("#rotateButton").addEventListener("click", rotateCamera);

document
  .querySelector("#solvePuzzleButton")
  .addEventListener("click", solvePuzzleButtonClicked);

document
  .querySelector("#buttonPreviousSolution")
  .addEventListener("click", previousSolutionButtonClicked);

document
  .querySelector("#buttonNextSolution")
  .addEventListener("click", nextSolutionButtonClicked);

createPyramid(threeDArray);
