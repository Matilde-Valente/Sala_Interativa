var renderer = null,
    scene = null,
    camera = null;
var objLoader;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
var selectedObject;
var cadeira, mesa, rato, torre, teclado, monitor;
var objetosMesaProf = new THREE.Object3D();
var objetosMesa = new THREE.Object3D();
var rotateY = 0;
var positionZ;
var rotationChanged = false;
var clickCadeiras = false;
var clickMesas = false
var luz = true;
var sound;
var listener;

var cadeira2, cadeira3, cadeira4, cadeira5, cadeira6, cadeira7;
var pointLight1, pointLight2;
var quadro;
var coluna;

var crosshair;

// PointerlockControls Variables
var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');
var objects = [];
var controlsEnabled = false;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var vertex = new THREE.Vector3();
var color = new THREE.Color();
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;


window.onload = function init() {
    // Create the Three.js renderer
    renderer = new THREE.WebGLRenderer();
    // Set the viewport 
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#AAAAAA");
    document.body.appendChild(renderer.domElement);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 15;

    //Ambient Light
    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

    //Point Light
    pointLight1 = new THREE.PointLight(0xffffff, 0.6);
    pointLight1.position.set(0, 300, 200);
    pointLight1.castShadow = true;

    //Point Light 2
    pointLight2 = new THREE.PointLight(0xffffff, 0.6);
    pointLight2.position.set(0, 300, -200);
    pointLight2.castShadow = true;

    // create an AudioListener and add it to the camera
    listener = new THREE.AudioListener();
    camera.add(listener);

    criaCrosshair();

    // PointerLock Controls
    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    // PointerLock Controls
    if (havePointerLock) {
        var element = document.body;

        var pointerlockchange = function (event) {
            if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                controlsEnabled = true;
                controls.enabled = true;
                blocker.style.display = 'none';
            } else {
                controls.enabled = false;
                blocker.style.display = 'block';
                instructions.style.display = '';
            }
        };

        var pointerlockerror = function (event) {
            instructions.style.display = '';
        };

        // Hook pointer lock state change events
        document.addEventListener('pointerlockchange', pointerlockchange, false);
        document.addEventListener('mozpointerlockchange', pointerlockchange, false);
        document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

        document.addEventListener('pointerlockerror', pointerlockerror, false);
        document.addEventListener('mozpointerlockerror', pointerlockerror, false);
        document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

        instructions.addEventListener('click', function (event) {
            instructions.style.display = 'none';

            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
            element.requestPointerLock();
        }, false);
    } else {
        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
    }

    plane = new THREE.Mesh(new THREE.PlaneGeometry(250, 250, 10, 10),
        new THREE.MeshBasicMaterial({
            opacity: 0.0,
            transparent: false,
            visible: false
        }));
    plane.rotation.x = -Math.PI / 2
    scene.add(plane);

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener("keydown", doKey, false);
    document.addEventListener("keyup", keyUpHandler, false);
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('click', onClick, false);

    criaSala();
    criaObjetos();
    animate();
    render();

    renderer.render(scene, camera);
}

function criaSala() {
    //CHÃO
    var materialChao = new THREE.MeshPhongMaterial()
    var geometriaChao = new THREE.BoxGeometry(250, 0, 250);
    var chao = new THREE.Mesh(geometriaChao, materialChao);
    chao.position.z = -40
    scene.add(chao);

    //PAREDES
    var geometria = new THREE.BoxGeometry(250, 90, 1);
    var material = new THREE.MeshPhongMaterial({ color: 0xFFFFF0, side: THREE.BackSide });
    var parede1 = new THREE.Mesh(geometria, material);
    parede1.position.z = 85.5
    parede1.position.y = 44.5
    scene.add(parede1);

    var parede2 = new THREE.Mesh(geometria, material);
    parede2.position.z = -165.5
    parede2.position.y = 44.5
    scene.add(parede2);

    var parede3 = new THREE.Mesh(geometria, material);
    parede3.position.z = -40
    parede3.position.y = 44.5
    parede3.position.x = -125.4
    parede3.rotation.y = Math.PI / 2
    scene.add(parede3);

    var parede4 = new THREE.Mesh(geometria, material);
    parede4.position.z = -40
    parede4.position.y = 44.5
    parede4.position.x = 125.4
    parede4.rotation.y = Math.PI / 2
    scene.add(parede4);

    //Rodapé
    var texturaRodape = new THREE.TextureLoader().load('materiais/madeira_cadeira.jpg')
    var materialRodape = new THREE.MeshPhongMaterial({ map: texturaRodape, side: THREE.DoubleSide })
    var geometriaRodape = new THREE.BoxGeometry(0.1, 5, 252);
    var rodape1 = new THREE.Mesh(geometriaRodape, materialRodape);
    rodape1.position.z = 85.7
    rodape1.position.y = 2
    rodape1.rotation.y = Math.PI / 2
    scene.add(rodape1);

    var rodape2 = new THREE.Mesh(geometriaRodape, materialRodape);
    rodape2.position.z = -165
    rodape2.position.y = 2
    rodape2.rotation.y = Math.PI / 2
    scene.add(rodape2);

    var rodape3 = new THREE.Mesh(geometriaRodape, materialRodape);
    rodape3.position.z = -40
    rodape3.position.y = 2
    rodape3.position.x = -124.8
    scene.add(rodape3);

    var rodape4 = new THREE.Mesh(geometriaRodape, materialRodape);
    rodape4.position.z = -40
    rodape4.position.y = 2
    rodape4.position.x = 124.8
    scene.add(rodape4);

    // Define geometryQuadro
    var geometriaQuadro = new THREE.BoxGeometry(130, 40, 1);
    var materialQuadro = new THREE.MeshPhongMaterial({ // Required For Shadows
        color: 0x003300,
        specular: 0x000000,
        shininess: 40
    });

    //Quadro
    quadro = new THREE.Mesh(geometriaQuadro, materialQuadro);
    quadro.position.z = 84;
    quadro.position.y = 35;
    scene.add(quadro);

    //MolduraQuadro
    var texturaMolduraQuadro = new THREE.TextureLoader().load('materiais/molduraQuadro.jpg')
    var materialMolduraQuadro = new THREE.MeshPhongMaterial({ map: texturaMolduraQuadro })
    var geometriaMolduraQuadro = new THREE.BoxGeometry(133, 43, 2);
    var molduraQuadro = new THREE.Mesh(geometriaMolduraQuadro, materialMolduraQuadro);
    molduraQuadro.position.z = 85
    molduraQuadro.position.y = 35
    scene.add(molduraQuadro);

    var botao = new THREE.BoxGeometry(7, 7, 1);
    var texturaBotao = new THREE.TextureLoader().load('materiais/coluna.jpg')
    var materialBotao = new THREE.MeshPhongMaterial({ map: texturaBotao })
    coluna = new THREE.Mesh(botao, materialBotao);
    coluna.position.set(75, 25, 84)
    scene.add(coluna);
}

function criaObjetos() {
console.log("Chama criar objetos")
    //Materiais e texturas para os objetos
    var texturaMadeira = new THREE.TextureLoader().load('materiais/madeira_cadeira.jpg')
    var materialCadeira = new THREE.MeshPhongMaterial({ map: texturaMadeira })
    var materialPreto = new THREE.MeshPhongMaterial({ color: 0x00000 })
    var materialCinzento = new THREE.MeshPhongMaterial({ color: 0xe5e5e5 })
    var materialCinzentoEscuro = new THREE.MeshPhongMaterial({ color: 0xb2b2b2 })
    var texturaTeclado = new THREE.TextureLoader().load('materiais/teclado.jpg')
    var materialTeclado = new THREE.MeshPhongMaterial({ map: texturaTeclado })

    //Load Cadeira
    objLoader = new THREE.OBJLoader();
    objLoader.load('models/cadeira.obj', function (object) {
        cadeira = object;

        // Go through all children of the loaded object and search for a Mesh
        cadeira.traverse(function (child) {
            // This allow us to check if the children is an instance of the Mesh constructor
            if (child instanceof THREE.Mesh) {
                cadeira.children[0].material = materialCadeira
                cadeira.children[1].material = materialCinzento
                cadeira.children[2].material = materialCinzento
            }
        });
        cadeira.scale.set(0.2, 0.2, 0.2)
        cadeira.position.z = 43
        cadeira.position.x += 45.5
        cadeira.rotation.y = Math.PI
        scene.add(cadeira);
        

        cadeira2 = cadeira.clone();
        cadeira2.position.z = -50
        cadeira2.position.x = 46
        cadeira2.rotation.y = Math.PI
        scene.add(cadeira2)

        cadeira3 = cadeira.clone();
        cadeira3.position.z = -50
        cadeira3.position.x = -4
        cadeira3.rotation.y = Math.PI
        scene.add(cadeira3)

        cadeira4 = cadeira.clone();
        cadeira4.position.z = -50
        cadeira4.position.x = -54
        cadeira4.rotation.y = Math.PI
        scene.add(cadeira4)

        cadeira5 = cadeira.clone();
        cadeira5.position.z = -110
        cadeira5.position.x = -54
        cadeira5.rotation.y = Math.PI
        scene.add(cadeira5)

        cadeira6 = cadeira.clone();
        cadeira6.position.z = -110
        cadeira6.position.x = -4
        cadeira6.rotation.y = Math.PI
        scene.add(cadeira6)

        cadeira7 = cadeira.clone();
        cadeira7.position.z = -110
        cadeira7.position.x = 46
        cadeira7.rotation.y = Math.PI
        scene.add(cadeira7)

        renderer.render(scene, camera);
    });
    //Load Mesa
    objLoader = new THREE.OBJLoader();
    objLoader.load('models/Mesa.obj', function (object) {
        mesa = object;

        // Go through all children of the loaded object and search for a Mesh
        mesa.traverse(function (child) {
            // This allow us to check if the children is an instance of the Mesh constructor
            if (child instanceof THREE.Mesh) {
                mesa.children[0].material = materialCinzentoEscuro
                mesa.children[1].material = materialCinzentoEscuro
                mesa.children[2].material = materialCinzentoEscuro
                mesa.children[3].material = materialCinzentoEscuro
                mesa.children[4].material = materialCinzento
            }
        });
        mesa.scale.set(0.2, 0.2, 0.2)
        mesa.position.z = 22
        mesa.position.x += 60.5
        mesa.rotation.y = Math.PI
        objetosMesaProf.add(mesa)

        var mesa2 = mesa.clone();
        mesa2.position.z = -30
        mesa2.position.x = 30
        mesa2.rotation.y = Math.PI
        scene.add(mesa2)

        var mesa3 = mesa.clone();
        mesa3.position.z = -30
        mesa3.position.x = -20
        mesa3.rotation.y = Math.PI
        scene.add(mesa3)

        var mesa4 = mesa.clone();
        mesa4.position.z = -30
        mesa4.position.x = -70
        mesa4.rotation.y = Math.PI
        scene.add(mesa4)

        var mesa5 = mesa.clone();
        mesa5.position.z = -90
        mesa5.position.x = 30
        mesa5.rotation.y = Math.PI
        scene.add(mesa5)

        var mesa6 = mesa.clone();
        mesa6.position.z = -90
        mesa6.position.x = -20
        mesa6.rotation.y = Math.PI
        scene.add(mesa6)

        var mesa7 = mesa.clone();
        mesa7.position.z = -90
        mesa7.position.x = -70
        mesa7.rotation.y = Math.PI
        scene.add(mesa7)

        objetosMesa.add(mesa2)
        objetosMesa.add(mesa3)
        objetosMesa.add(mesa4)
        objetosMesa.add(mesa5)
        objetosMesa.add(mesa6)
        objetosMesa.add(mesa7)

        renderer.render(scene, camera);
    });
    //Load Rato
    objLoader = new THREE.OBJLoader();
    objLoader.load('models/rato.obj', function (object) {
        rato = object;

        // Go through all children of the loaded object and search for a Mesh
        rato.traverse(function (child) {
            // This allow us to check if the children is an instance of the Mesh constructor
            if (child instanceof THREE.Mesh) {
                rato.children[0].material = materialPreto
            }
        });
        rato.scale.set(0.2, 0.2, 0.2)
        rato.position.z = 22
        rato.position.x += 60.5
        rato.rotation.y = Math.PI
        objetosMesaProf.add(rato)

        var rato2 = rato.clone();
        rato2.position.z = -30
        rato2.position.x = 30
        rato2.rotation.y = Math.PI
        scene.add(rato2)

        var rato3 = rato.clone();
        rato3.position.z = -30
        rato3.position.x = -20
        rato3.rotation.y = Math.PI
        scene.add(rato3)

        var rato4 = rato.clone();
        rato4.position.z = -30
        rato4.position.x = -70
        rato4.rotation.y = Math.PI
        scene.add(rato4)

        var rato5 = rato.clone();
        rato5.position.z = -90
        rato5.position.x = 30
        rato5.rotation.y = Math.PI
        scene.add(rato5)

        var rato6 = rato.clone();
        rato6.position.z = -90
        rato6.position.x = -20
        rato6.rotation.y = Math.PI
        scene.add(rato6)

        var rato7 = rato.clone();
        rato7.position.z = -90
        rato7.position.x = -70
        rato7.rotation.y = Math.PI
        scene.add(rato7)

        objetosMesa.add(rato2)
        objetosMesa.add(rato3)
        objetosMesa.add(rato4)
        objetosMesa.add(rato5)
        objetosMesa.add(rato6)
        objetosMesa.add(rato7)

        renderer.render(scene, camera);
    });
    //Load Monitor
    objLoader = new THREE.OBJLoader();
    objLoader.load('models/monitor.obj', function (object) {
        monitor = object;

        // Go through all children of the loaded object and search for a Mesh
        monitor.traverse(function (child) {
            // This allow us to check if the children is an instance of the Mesh constructor
            if (child instanceof THREE.Mesh) {
                monitor.children[0].material = materialPreto
                monitor.children[1].material = materialPreto
            }
        });
        monitor.scale.set(0.2, 0.2, 0.2)
        monitor.position.z = 22
        monitor.position.x += 60.5
        monitor.rotation.y = Math.PI
        objetosMesaProf.add(monitor)

        var monitor2 = monitor.clone();
        monitor2.position.z = -30
        monitor2.position.x = 30
        monitor2.rotation.y = Math.PI
        scene.add(monitor2)

        var monitor3 = monitor.clone();
        monitor3.position.z = -30
        monitor3.position.x = -20
        monitor3.rotation.y = Math.PI
        scene.add(monitor3)

        var monitor4 = monitor.clone();
        monitor4.position.z = -30
        monitor4.position.x = -70
        monitor4.rotation.y = Math.PI
        scene.add(monitor4)

        var monitor5 = monitor.clone();
        monitor5.position.z = -90
        monitor5.position.x = 30
        monitor5.rotation.y = Math.PI
        scene.add(monitor5)

        var monitor6 = monitor.clone();
        monitor6.position.z = -90
        monitor6.position.x = -20
        monitor6.rotation.y = Math.PI
        scene.add(monitor6)

        var monitor7 = monitor.clone();
        monitor7.position.z = -90
        monitor7.position.x = -70
        monitor7.rotation.y = Math.PI
        scene.add(monitor7)

        objetosMesa.add(monitor2)
        objetosMesa.add(monitor3)
        objetosMesa.add(monitor4)
        objetosMesa.add(monitor5)
        objetosMesa.add(monitor6)
        objetosMesa.add(monitor7)

        renderer.render(scene, camera);
    });

    //Load Monitor
    objLoader = new THREE.OBJLoader();
    objLoader.load('models/teclado.obj', function (object) {
        teclado = object;

        // Go through all children of the loaded object and search for a Mesh
        teclado.traverse(function (child) {
            // This allow us to check if the children is an instance of the Mesh constructor
            if (child instanceof THREE.Mesh) {
                teclado.children[0].material = materialTeclado
            }
        });
        teclado.scale.set(0.2, 0.2, 0.2)
        teclado.position.z = 22
        teclado.position.x += 60.5
        teclado.rotation.y = Math.PI
        objetosMesaProf.add(teclado)

        var teclado2 = teclado.clone();
        teclado2.position.z = -30
        teclado2.position.x = 30
        teclado2.rotation.y = Math.PI
        scene.add(teclado2)

        var teclado3 = teclado.clone();
        teclado3.position.z = -30
        teclado3.position.x = -20
        teclado3.rotation.y = Math.PI
        scene.add(teclado3)

        var teclado4 = teclado.clone();
        teclado4.position.z = -30
        teclado4.position.x = -70
        teclado4.rotation.y = Math.PI
        scene.add(teclado4)

        var teclado5 = teclado.clone();
        teclado5.position.z = -90
        teclado5.position.x = 30
        teclado5.rotation.y = Math.PI
        scene.add(teclado5)

        var teclado6 = teclado.clone();
        teclado6.position.z = -90
        teclado6.position.x = -20
        teclado6.rotation.y = Math.PI
        scene.add(teclado6)

        var teclado7 = teclado.clone();
        teclado7.position.z = -90
        teclado7.position.x = -70
        teclado7.rotation.y = Math.PI
        scene.add(teclado7)

        objetosMesa.add(teclado2)
        objetosMesa.add(teclado3)
        objetosMesa.add(teclado4)
        objetosMesa.add(teclado5)
        objetosMesa.add(teclado6)
        objetosMesa.add(teclado7)

        renderer.render(scene, camera);
    });

    scene.add(objetosMesaProf)
    scene.add(objetosMesa)
}

function onMouseDown(event) {

    var mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1, //x
        - (event.clientY / window.innerHeight) * 2 + 1); //y

    var raycaster = new THREE.Raycaster();
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // search for intersections
    var intersects = raycaster.intersectObjects(cadeira.children);
    if (intersects.length > 0) {
        // gets intersect object
        selectedObject = cadeira;

        // gets intersection with the helper plane
        var intersectsPlane = raycaster.intersectObject(plane);
        // calculates the offset
        offset.copy(intersectsPlane[0].point).sub(selectedObject.position);
        console.log("down")
    }
    var intersects2 = raycaster.intersectObjects(mesa.children);
    if (intersects2.length > 0) {
        // gets intersect object
        selectedObject = objetosMesaProf;
        // gets intersection with the helper plane
        var intersectsPlane = raycaster.intersectObject(plane);
        // calculates the offset
        offset.copy(intersectsPlane[0].point).sub(selectedObject.position);
        console.log("down")
    }
    var intersects3 = raycaster.intersectObjects(rato.children);
    if (intersects3.length > 0) {
        // gets intersect object
        selectedObject = objetosMesaProf;
        // gets intersection with the helper plane
        var intersectsPlane = raycaster.intersectObject(plane);
        // calculates the offset
        offset.copy(intersectsPlane[0].point).sub(selectedObject.position);
        console.log("down")
    }
    var intersects4 = raycaster.intersectObjects(monitor.children);
    if (intersects4.length > 0) {
        // gets intersect object
        selectedObject = objetosMesaProf;

        // gets intersection with the helper plane
        var intersectsPlane = raycaster.intersectObject(plane);
        // calculates the offset
        offset.copy(intersectsPlane[0].point).sub(selectedObject.position);
        console.log("down")
    }
    renderer.render(scene, camera);
}

function onMouseMove(event) {

    var mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1, //x
        - (event.clientY / window.innerHeight) * 2 + 1); //y

    var raycaster = new THREE.Raycaster();
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    if (selectedObject) {
        //drag an object around if we've already clicked on one
        var intersects = raycaster.intersectObject(plane);

        selectedObject.position.copy(intersects[0].point.sub(offset));
        console.log("move")
    }
    renderer.render(scene, camera);
}

function onMouseUp(event) {
    selectedObject = null;

    renderer.render(scene, camera);
}

var soma = 0.1
var escala = 0.01

function doKey(evt) {
    rotationChanged = true;

    switch (evt.keyCode) {
        case 87: // w
            moveForward = true;
            break;
        case 65: // A
            moveLeft = true;
            break;
        case 83: // S
            moveBackward = true;
            break;
        case 68: // D
            moveRight = true;
            break;
        case 37: // ESQUERDA
            rotateY -= 0.05;
            break;
        case 39: // DIREITA
            rotateY += 0.05;
            break;
        case 38:  // CIMA
            clickCadeiras = true
            if (cadeira2.position.z >= -60 || cadeira2.position.z <= -50) {
                soma = -soma
            }
            break;
        case 40: // BAIXO
            clickMesas = true
            if ((objetosMesa.scale.x >= 1.5 || objetosMesa.scale.x <= 0.8) && (objetosMesa.scale.y >= 1.5 || objetosMesa.scale.y <= 0.8) && (objetosMesa.scale.z >= 1.5 || objetosMesa.scale.z <= 0.8)) {
                escala = -escala
            }
            break;
        case 82: // R
            rotateY = 0;

            clickCadeiras = false;
            clickMesas = false;

            objetosMesa.scale.set(1, 1, 1)

            cadeira2.position.set(46, 0, -50);
            cadeira3.position.set(-4, 0, -50);
            cadeira4.position.set(-54, 0, -50);
            cadeira5.position.set(46, 0, -110);
            cadeira6.position.set(-4, 0, -110);
            cadeira7.position.set(-54, 0, -110);

            cadeira2.rotation.set(0, 0, 0);
            cadeira3.rotation.set(0, 0, 0);
            cadeira4.rotation.set(0, 0, 0);
            cadeira5.rotation.set(0, 0, 0);
            cadeira6.rotation.set(0, 0, 0);
            cadeira7.rotation.set(0, 0, 0);
            break;
        case 69: // E
            if (luz) {
                luz = false;
                scene.add(pointLight1);
                scene.add(pointLight2);
            }
            else {
                luz = true;
                scene.remove(pointLight1);
                scene.remove(pointLight2);
            }
            break;
        case 32: // espaço
        default:
            rotationChanged = false;
    }

    console.log(evt.keyCode, rotationChanged, rotateY, escala)
}

function keyUpHandler(e) {
    switch (e.keyCode) {
        case 87: // w
            moveForward = false;
            break;
        case 65: // a
            moveLeft = false;
            break;
        case 83: // s
            moveBackward = false;
            break;
        case 68: // d
            moveRight = false;
            break;
    }
}

function animate() {
    console.log("animate")
    if (cadeira2 && cadeira3 && cadeira4 && cadeira5 && cadeira6 && cadeira7) { //check if mesh is already loaded
        if (rotationChanged) {  //check for rotation motion
            cadeira2.rotation.y += rotateY;
            cadeira3.rotation.y += rotateY;
            cadeira4.rotation.y += rotateY;
            cadeira5.rotation.y += rotateY;
            cadeira6.rotation.y += rotateY;
            cadeira7.rotation.y += rotateY;
        }
    }
    if (cadeira2 && cadeira3 && cadeira4 && cadeira5 && cadeira6 && cadeira7) {
        if (clickCadeiras == true) {
            if (cadeira2.position.z >= -50 || cadeira2.position.z <= -60) {
                soma = -soma
            }
            cadeira2.position.z += soma;
            cadeira3.position.z += soma;
            cadeira4.position.z += soma;
            cadeira5.position.z += soma;
            cadeira6.position.z += soma;
            cadeira7.position.z += soma;
        }
    }
    if (objetosMesa) {
        if (clickMesas == true) {
            if ((objetosMesa.scale.x >= 1.5 || objetosMesa.scale.x <= 0.8) && (objetosMesa.scale.y >= 1.5 || objetosMesa.scale.y <= 0.8) && (objetosMesa.scale.z >= 1.5 || objetosMesa.scale.z <= 0.8)) {
                escala = -escala
            }
            objetosMesa.scale.x += escala;
            objetosMesa.scale.y += escala;
            objetosMesa.scale.z += escala;
        }
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function render() {
    // PointerLockControls
    if (controlsEnabled === true) {
        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 10;

        var intersections = raycaster.intersectObjects(objects);

        var onObject = intersections.length > 0;

        var time = performance.now();
        var delta = (time - prevTime) / 1000;

        // Move in X and Z axis
        velocity.x -= velocity.x * 14.0 * delta;
        velocity.z -= velocity.z * 14.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveLeft) - Number(moveRight);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;


        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateZ(velocity.z * delta);

        prevTime = time;
    }

    requestAnimationFrame(render);
    //controls.update();
    renderer.render(scene, camera);
}

function onClick(event) {

    var mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1, //x
        - (event.clientY / window.innerHeight) * 2 + 1); //y

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects([quadro]);
    if (intersects.length > 0) {
        intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
    }

    var intersects2 = raycaster.intersectObjects([coluna]);
    if (intersects2.length > 0) {

        sound = new THREE.Audio(listener);

        // load a sound and set it as the Audio object's buffer
        var audioLoader = new THREE.AudioLoader();
        audioLoader.load('musica/hey.ogg', function (buffer) {
            sound.setBuffer(buffer);
            sound.setVolume(0.5);
            sound.play();
        });
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Create Crosshair
function criaCrosshair() {

    var material = new THREE.LineBasicMaterial({ color: 0xAAFFAA });
    // crosshair size
    var x = 0.015, y = 0.015;

    // Crosshair
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(x, y, 0));
    geometry.vertices.push(new THREE.Vector3(-x, y, 0));
    geometry.vertices.push(new THREE.Vector3(-x, -y, 0));
    geometry.vertices.push(new THREE.Vector3(x, -y, 0));
    geometry.vertices.push(new THREE.Vector3(x, y, 0));

    crosshair = new THREE.Line(geometry, material);

    // place it in the center
    var crosshairPercentX = 50;
    var crosshairPercentY = 50;
    var crosshairPositionX = (crosshairPercentX / 100) * 2 - 1; // Min é 0.23 e max 1.77
    var crosshairPositionY = (crosshairPercentY / 100) * 2 - 1; // Min é 0.23 e max 1.77

    crosshair.position.x = crosshairPositionX * camera.aspect;
    crosshair.position.y = crosshairPositionY;
    crosshair.position.z = -1;
    crosshair.name = "Crosshair";

    camera.add(crosshair);
}




