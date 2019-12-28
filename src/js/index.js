import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import "@babylonjs/loaders/glTF";

import "../sass/main.scss";

window.addEventListener("DOMContentLoaded", function() {
	// Remove Loading Screen
	const removeLoadingScreen = () => {
		document.querySelector(".loading-page").setAttribute("style", "display: none");
	}

	// get the canvas DOM element
	const canvas = document.getElementById("renderCanvas");

	// load the 3D engine
	const engine = new BABYLON.Engine(canvas, true);

	// createScene function that creates and return the scene
	const createScene = function() {
		// create a basic BJS Scene object
		const scene = new BABYLON.Scene(engine);
		/*
		scene.environmentTexture = new BABYLON.CubeTexture.CreateFromPrefilteredData(
			"./textures/environment.env",
			scene
		);    */

		const skybox = BABYLON.MeshBuilder.CreateBox(
			"skyBox",
			{ size: 1000.0 },
			scene
		);

		const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
		skyboxMaterial.backFaceCulling = false;
		skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
			"./textures/coast/coast",
			scene
		);
		skyboxMaterial.reflectionTexture.coordinatesMode =
			BABYLON.Texture.SKYBOX_MODE;
		skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
		skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
		skybox.material = skyboxMaterial;

		// create a FreeCamera, and set its position to (x:0, y:5, z:-10)
		// Parameters : name, position, scene
		const camera = new BABYLON.UniversalCamera(
			"UniversalCamera",
			new BABYLON.Vector3(0, 3, 9),
			scene
		);

		// Attach the camera to the canvas
		camera.attachControl(canvas, true);

		// target the camera to scene origin
		camera.setTarget(BABYLON.Vector3.Zero());

		// attach the camera to the canvas
		camera.attachControl(canvas, false);

		//Set the ellipsoid around the camera (e.g. your player's size)
		camera.ellipsoid = new BABYLON.Vector3(1, 2.3, 1);

		camera.speed = 1.1;
		camera.inertia = 0.7;

		const room = BABYLON.SceneLoader.ImportMesh(
			null,
			"./models/",
			//"coastal-house.glb",
			"model.glb",
			scene,
			function(scene) {
				// do something with the scene
				scene.forEach(mesh => {
					mesh.checkCollisions = true;
				});
				removeLoadingScreen();
			}
		); 

		
			// X Z Y
		const ambientLamp = new BABYLON.HemisphericLight(
			"HemiLight",
			new BABYLON.Vector3(0, 1, 0),
			scene
		);
			
		const ambientLamp2 = new BABYLON.HemisphericLight(
			"HemiLight",
			new BABYLON.Vector3(0, -10, 0),
			scene
		); 
	
		ambientLamp.intensity = 2;
		ambientLamp2.intensity = .1;

		//Set gravity for the scene (G force like, on Y-axis)
		scene.gravity = new BABYLON.Vector3(0, -0.9, 0);

		// Enable Collisions
		scene.collisionsEnabled = true;

		//Then apply collisions and gravity to the active camera
		camera.checkCollisions = true;
		camera.applyGravity = true;

		//finally, say which mesh will be collisionable
		//ground.checkCollisions = true;

		// return the created scene
		return scene;
	};

	// call the createScene function
	const scene = createScene();

	// run the render loop
	engine.runRenderLoop(function() {
		scene.render();
	});

	// the canvas/window resize event handler
	window.addEventListener("resize", function() {
		engine.resize();
	});
});

const date = new Date();
const year = date.getFullYear();
document.querySelector(".date-year").innerText = year;

