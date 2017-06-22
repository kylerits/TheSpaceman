// ThreeJS Custom Script

// the spaceman

var Colors = {
	red:0xc0392b,
	white:0xecf0f1,
	grey:0x95a5a6,
	silver:0xbdc3c7,
	navyBlue:0x2c3e50,
    black:0x333333,
	blue:0x2980b9,
    yellow:0xf1c40f,
    orange:0xe67e22,
};

window.addEventListener('load', init, false);

function init() {
    
    // set up the scene, the camera and the renderer
    createScene();
    
    // add the lights
    createLights();
    
    // add the objects
    createRocket();
    
    // add the event listener for mouse
    document.addEventListener('mousemove', handleMouseMove, false);
    
    // render the scene
    loop();
    
}

var scene,
    camera, fieldOfView, aspectRatio, nearRocket, farRocket, HEIGHT, WIDTH, renderer, container;



// SCENE FUNCTION

function createScene() {
    
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    
    // Create the scene
    scene = new THREE.Scene();
    
    // Add a fog effect to the scene; same color as the background
    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
    
    // Create the camera
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearRocket = 1;
    farRocket = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearRocket,
        farRocket
    );
    
    // Set the position of the camera
    camera.position.x = 0;
    camera.position.z = 200;
    camera.position.y = 100;
    
    // Create the renderer
    renderer = new THREE.WebGLRenderer({
        // Allow transparency to show the gradient background
        // we defined in the CSS
        alpha: true,
        
        // Activate the anti-aliasing; this is less performant,
        // but, as our project is low-poly based, it should be fine :)
        antialias: true
    });
    
    // Define the size of the renderer; in this case,
    // it will fill the entire screen
    renderer.setSize(WIDTH, HEIGHT);
    
    // Enable shadow rendering
    renderer.shadowMap.enabled = true;
    
    // Add the DOM element of the renderer to the 
    // container we created in the HTML
    container = document.getElementById('space');
    container.appendChild(renderer.domElement);
    
    // Listen to the screen: if the user resizes it
    // we have to update the camera and the renderer size
    window.addEventListener('resize', handleWindowResize, false);
    
}

function handleWindowResize() {
    // update height and width of the renderer and the camera
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}




// LIGHTS FUNCTION

var hemisphereLight, shadowLight;

function createLights() {
    
    // A hemisphere light is a gradient colored light;
    // the first parameter is the sky color, the second parameter is the ground color,
    // the third parameter is the intensity of light
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);
    
    // A directional light shines from a specific direction.
    // It acts like the sun, that means that all the rays produced are parallel.
    shadowLight = new THREE.DirectionalLight(0xffffff, .9);
    
    // Set the direction of the light
    shadowLight.position.set(150, 250, 350);
    
    // Allow shadow casting
    shadowLight.castShadow = true;
    
    // define the visible area of the projected shadow
    shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	// define the resolution of the shadow; the higher the better, 
	// but also the more expensive and less performant
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;
    
    // an ambient light modifies the global color of a scene and makes the shadows softer
    
    var ambientLight = new THREE.AmbientLight(0xdc8874, .5);
    //scene.add(ambientLight);
	
	// to activate the lights, just add them to the scene
	scene.add(hemisphereLight);  
	scene.add(shadowLight);
    
}



// ROCKET FUNCTION

var Rocket = function() {
    
    this.mesh = new THREE.Object3D();
    
    // Create the cabin
    var geomCabin = new THREE.BoxGeometry(120,120,60,1,1,1);
    var matCabin = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
    
    geomCabin.vertices[0].x = 0;
    geomCabin.vertices[0].z = 0;
    geomCabin.vertices[1].x = 0;
    geomCabin.vertices[1].z = 0;
    geomCabin.vertices[4].x = 0;
    geomCabin.vertices[4].z = 0;
    geomCabin.vertices[5].x = 0;
    geomCabin.vertices[5].z = 0;
    
    var cabin = new THREE.Mesh(geomCabin, matCabin);
    cabin.position.set(0, 60, 0);
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    this.mesh.add(cabin);
    
    
    // Create the Lower Cabin
    var geomCabin2 = new THREE.BoxGeometry(120,120,60,1,1,1);
    var matCabin2 = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
    
    geomCabin2.vertices[2].x -= 15;
    geomCabin2.vertices[2].z -= 15;
    geomCabin2.vertices[3].x -= 15;
    geomCabin2.vertices[3].z -= 15;
    geomCabin2.vertices[6].x += 15;
    geomCabin2.vertices[6].z -= 15;
    geomCabin2.vertices[7].x += 15;
    geomCabin2.vertices[7].z -= 15;
    
    var cabin2 = new THREE.Mesh(geomCabin2, matCabin2);
    cabin2.position.set(0, -60, 0);
    cabin2.castShadow = true;
    cabin2.receiveShadow = true;
    this.mesh.add(cabin2);
    
    
    // Create the wings
    var geomWings = new THREE.BoxGeometry(200,120,5,1,1,1);
    var matWings = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
    
    geomWings.vertices[0].x = 0;
    geomWings.vertices[1].x = 0;
    geomWings.vertices[4].x = 0;
    geomWings.vertices[5].x = 0;
    
    var wings = new THREE.Mesh(geomWings, matWings);
    wings.position.set(0,-30,0);
    wings.castShadow = true;
    wings.receiveShadow = true;
    this.mesh.add(wings);
    
    
    // Create the window
    var geomWindow = new THREE.BoxGeometry(50,50,10,1,1,1);
    var matWindow = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
    
    var window = new THREE.Mesh(geomWindow, matWindow);
    window.position.set(0,-10,27);
    window.castShadow = true;
    window.receiveShadow = true;
    this.mesh.add(window);
    
    
    // Create the glass for the window
    
    var geomGlassInner = new THREE.BoxGeometry(36, 36, 10, 1,1,1);
    var matGlassInner = new THREE.MeshPhongMaterial({color:Colors.navyBlue, shading: THREE.FlatShading});
    
    var glassInner = new THREE.Mesh(geomGlassInner, matGlassInner);
    glassInner.castShadow = true;
    glassInner.receiveShadow = true;
    glassInner.position.set(0, -10, 28);
    this.mesh.add(glassInner);
    
    
    var geomGlassOuter = new THREE.BoxGeometry(40, 40, 10, 1,1,1);
    var matGlassOuter = new THREE.MeshPhongMaterial({color:Colors.white, transparent:true, opacity:.3, shading: THREE.FlatShading});
    
    var glassOuter = new THREE.Mesh(geomGlassOuter, matGlassOuter);
    glassOuter.castShadow = true;
    glassOuter.receiveShadow = true;
    glassOuter.position.set(0, -10, 32);
    this.mesh.add(glassOuter);
    
    
    // Create antena
    
    var geomAntBase = new THREE.BoxGeometry(30,30,20,1,1,1);
    var matAntBase = new THREE.MeshPhongMaterial({color:Colors.grey, shading:THREE.FlatShading});
    
    geomAntBase.vertices[0].x = 0;
    geomAntBase.vertices[0].z = 0;
    geomAntBase.vertices[1].x = 0;
    geomAntBase.vertices[1].z = 0;
    geomAntBase.vertices[4].x = 0;
    geomAntBase.vertices[4].z = 0;
    geomAntBase.vertices[5].x = 0;
    geomAntBase.vertices[5].z = 0;
    
    var antBase = new THREE.Mesh(geomAntBase, matAntBase);
    antBase.castShadow = true;
    antBase.receiveShadow = true;
    antBase.position.set(0,110,0);
    
    this.mesh.add(antBase);
    
    
    var geomAntPole = new THREE.BoxGeometry(5, 40, 5, 1, 1, 1);
    var matAntPole = new THREE.MeshPhongMaterial({color:Colors.grey, shading:THREE.FlatShading});
    
    var antPole = new THREE.Mesh(geomAntPole, matAntPole);
    antPole.castShadow = true;
    antPole.receiveShadow = true;
    antPole.position.set(0, 130, 0);
    
    this.mesh.add(antPole);
    
    
    // Create Engine
    
    var geomEngine = new THREE.BoxGeometry(110,40,80,1,1,1);
    var matEngine = new THREE.MeshPhongMaterial({color:Colors.grey, shading:THREE.FlatShading});
    
    var engine = new THREE.Mesh(geomEngine, matEngine);
    engine.castShadow = true;
    engine.receiveShadow = true;
    engine.position.set(0, -110, -10);
    
    this.mesh.add(engine);
    
    
    // Create Thrust
    
    var geomThrust = new THREE.BoxGeometry(90,60,60,1,1,1);
    var matThrust = new THREE.MeshPhongMaterial({color:Colors.grey, shading:THREE.FlatShading});
    
    geomThrust.vertices[0].x = 0;
    geomThrust.vertices[0].z = 0;
    geomThrust.vertices[1].x = 0;
    geomThrust.vertices[1].z = 0;
    geomThrust.vertices[4].x = 0;
    geomThrust.vertices[4].z = 0;
    geomThrust.vertices[5].x = 0;
    geomThrust.vertices[5].z = 0;
    
    var thrust = new THREE.Mesh(geomThrust, matThrust);
    thrust.castShadow = true;
    thrust.receiveShadow = true;
    thrust.position.set(0, -130, -10);
    
    this.mesh.add(thrust);
    
    
    // Create Fire
    
    var geomFire = new THREE.BoxGeometry(50,50,50,1,1,1);
    var matFire = new THREE.MeshPhongMaterial({color:Colors.yellow, shading: THREE.FlatShading, transparent:true, opacity:.4});
    
    var fire = new THREE.Mesh(geomFire, matFire);
    fire.castShadow = true;
    fire.receiveShadow = true;
    fire.position.set(0,-180,-10);
    
    this.mesh.add(fire);
    
};

var rocket;

function createRocket(){
    rocket = new Rocket();
    rocket.mesh.scale.set(.25,.25,.25);
    rocket.mesh.position.y = 100;
    scene.add(rocket.mesh);
}



// LOOP FUNCTION

function loop() {
    
    // update the rocket on each frame
    updateRocket();
    
    renderer.render(scene, camera);
    
    // call the loop function again
	requestAnimationFrame(loop);
    
}



function updateRocket(){
    
    // Let's move the airplane between -100 and 100 on the horizontal axis,
    // and between 25 and 175 on the vertical axis,
    // depending on the mouse position which ranges between -1 and 1 on both axes;
    // to acheive that we use a normalize function (see below)
    
    var targetX = normalize(mousePos.x, -.75, .75, -80, 80);
    var targetY = normalize(mousePos.y, -.75, .75, 50, 125);
    
    // update the rocket's position
    rocket.mesh.position.y = targetY;
    rocket.mesh.position.x = targetX;
    
}



function normalize(v, vmin, vmax, tmin, tmax){
    
    var nv = Math.max(Math.min(v, vmax), vmin);
    var dv = vmax-vmin;
	var pc = (nv-vmin)/dv;
	var dt = tmax-tmin;
	var tv = tmin + (pc*dt);
	return tv;
}


var mousePos = {x:0, y:0};


function handleMouseMove(event) {
    
    // here we are converting the mouse position value received
    // to a normalized value varying between -1 and 1;
    // this is the formula for the horizontal axis:
    
    var tx = -1 + (event.clientX / WIDTH)*2;
    
    // for the vertical axis, we need to inverse the formula
    // because the 2D y-axis goes the opposite direction of the 3D y-axis
    
    var ty = 1 - (event.clientY / HEIGHT)*2;
    mousePos = {x:tx, y:ty};
}