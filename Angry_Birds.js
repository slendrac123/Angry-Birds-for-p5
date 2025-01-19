const { Engine, World, Bodies, Body, Constraint, Mouse, MouseConstraint } = Matter;

// Variables principales
let engine, world, ground, bird, slingShot, mc, board;
let slingShot1, slingShot2, metalBox;
let piggies = [], boxes = [], metalBoxes = [], explosions = [];
let birdIndex = 0, bgMusic;
let timeStarted = 0;  // Variable para almacenar el tiempo de lanzamiento
let resetDelay = 3000; // Tiempo de espera antes de resetear (4 segundos)
let birdLaunched = false; // Indica si el pájaro fue lanzado
let lost = false;
let won = false;

// Imágenes
let birdImg = [], piggyImg = [];
let boxImg, groundImg, bgImg, explosionImg, boardImg;
let slingShot1Img, slingShot2Img, metalBoxImg;

// Lista de pájaros
const birds = [Red, Terence, Chuck, Loser, Loser];

function preload() {
  bgImg = loadImage("img/background.jpg");
  birdImg = [
    loadImage("img/red.webp"),
    loadImage("img/terence.webp"),
    loadImage("img/chuck.webp"),
    loadImage("img/loser.png")
  ];
  boxImg = loadImage("img/box.png");
  metalBoxImg = loadImage("img/metalBox.png");
  groundImg = loadImage("img/ground.jpg");
  piggyImg = [loadImage("img/piggy1.webp")];
  explosionImg = loadImage("img/explosion.png");
  slingShot1Img = loadImage("img/slingshot1.png");
  slingShot2Img = loadImage("img/slingshot2.png");
  boardImg = loadImage("img/board.jpg");
  bgMusic = loadSound("music/music.mp3");
}

function setup() {
  createCanvas(900, 600);

  engine = Engine.create();
  world = engine.world;

  // Configuración del mouse
  const mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = pixelDensity();
  mc = MouseConstraint.create(engine, { mouse, collisionFilter: { mask: 2 } });
  World.add(world, mc);

  // Música de fondo
  if (!bgMusic.isPlaying()) {
    bgMusic.setVolume(0.5);
    bgMusic.loop();
  }
  
  
  // Inicialización de elementos
  slingShot1 = new Decoration(120, 400, 100, 150, slingShot1Img);
  slingShot2 = new Decoration(142, 371, 70, 100, slingShot2Img);
  metalBox = new MetalBox(125, 518, 50, 125, metalBoxImg);
  ground = new Ground(width / 2, height - 10, width, 20, groundImg);
  bird = new birds[birdIndex](120, 350);
  slingShot = new SlingShot(bird);

  createPiggies();
  createBoxes();
  createMetalBoxes();

  // Eventos de colisión
  Matter.Events.on(engine, "collisionStart", handleCollisions);
}

function draw() {
  background(bgImg);
  Engine.update(engine);

  ground.show();
  slingShot.fly(mc);
  slingShot2.show();
  slingShot.show();
  bird.show();
  slingShot1.show();

  metalBox.show(); // Mostrar la caja
  
  handleExplosions();
  handleBoxes();
  handlePiggies();
  
  for (let box of metalBoxes) {
    box.show();
  }
  
  
  // Comprobar si el pájaro fue lanzado y el tiempo transcurrido
  if (!slingShot.isAttached() && !birdLaunched) {
    birdLaunched = true;  // Indicar que el pájaro fue lanzado
    timeStarted = millis();  // Guardar el tiempo en que el pájaro fue lanzado
  }

  // Si han pasado 4 segundos desde que el pájaro fue lanzado, resetear el pájaro
  if (birdLaunched && millis() - timeStarted >= resetDelay) {
    resetBird();
    birdLaunched = false;  // Resetear el estado de "pájaro lanzado"
  }
  
  
  
  if (piggies.length === 0) {
    won = true;
  }
  
  if (birdIndex === 3 && piggies.length > 0) {
    lost = true;
  }
  
  if (won === true) {
    Board = new Ground(width / 2, height / 2 , 500, 400, boardImg);
    winMessage(); // Mostrar el mensaje de "Reintentar Nivel"
  }
  
  if (lost === true) {
    Board = new Ground(width / 2, height / 2 , 500, 400, boardImg);
    loseMessage(); // Mostrar el mensaje de "Reintentar Nivel"
  }
}

// Crear cerditos
function createPiggies() {
  const positions = [400, 460, 520, 580];
  positions.forEach((x) => piggies.push(new Piggy1(x, 360)));
  piggies.push(new Piggy1(360, 560));
}

// Crear cajas
function createBoxes() {
  boxes.push(new Box(80, 560, 40, 40, boxImg, 300));
  boxes.push(new Box(80, 520, 40, 40, boxImg, 300));
  boxes.push(new Box(40, 560, 40, 40, boxImg, 300));
  for (let i = 0; i < 5; i++) {
    const x = 520 - i * 40;
    boxes.push(new Box(320, x, 40, 40, boxImg, 300));
  }
  for (let i = 0; i < 5; i++) {
    const x = 520 - i * 40;
    boxes.push(new Box(660, x, 40, 40, boxImg, 300));
  }
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 5; i++) {
      const x = 400 + j * 60;
      const y = height - 40 * (i + 1);
      boxes.push(new Box(x, y, 40, 40, boxImg, 300));
    }
  }
}

function createMetalBoxes() {
  const startX = width + 25; // Posición cerca del borde derecho
  const boxWidth = 50; // Ancho de las cajas
  const boxHeight = 50; // Altura de las cajas
  metalBoxes.push(new MetalBox(320, 560, 40, 40, metalBoxImg));
  metalBoxes.push(new MetalBox(280, 560, 40, 40, metalBoxImg));
  metalBoxes.push(new MetalBox(280, 520, 40, 40, metalBoxImg));
  metalBoxes.push(new MetalBox(660, 560, 40, 40, metalBoxImg));
  metalBoxes.push(new MetalBox(700, 560, 40, 40, metalBoxImg));
  metalBoxes.push(new MetalBox(700, 520, 40, 40, metalBoxImg));
  for (let j = 0; j < 1; j++) { // Columnas
    for (let i = 0; i < 5; i++) { // Filas
      const x = startX - j * boxWidth; // Ajustar posición horizontal
      const y = height - (i + 1) * boxHeight; // Ajustar posición vertical
      metalBoxes.push(new MetalBox(x, y, boxWidth, boxHeight, metalBoxImg));
    }
  }
}

// Manejo de explosiones
function handleExplosions() {
  for (let i = explosions.length - 1; i >= 0; i--) {
    explosions[i].show();
    if (explosions[i].isExpired()) {
      explosions.splice(i, 1);
    }
  }
}

// Manejo de cajas
function handleBoxes() {
  for (let i = boxes.length - 1; i >= 0; i--) {
    boxes[i].show();
    if (boxes[i].isDestroyed()) {
      const pos = boxes[i].body.position;
      explosions.push(new Explosion(pos.x, pos.y));
      World.remove(world, boxes[i].body);
      boxes.splice(i, 1);
    }
  }
}

// Manejo de cerditos
function handlePiggies() {
  for (let i = piggies.length - 1; i >= 0; i--) {
    piggies[i].show();
    if (piggies[i].isDestroyed()) {
      const pos = piggies[i].body.position;
      explosions.push(new Explosion(pos.x, pos.y));
      World.remove(world, piggies[i].body);
      piggies.splice(i, 1);
    }
  }
}

// Manejo de colisiones
function handleCollisions(event) {
  const pairs = event.pairs;

  pairs.forEach((pair) => {
    handleBoxCollision(pair);
    handlePiggyCollision(pair);
  });
}

function handleBoxCollision(pair) {
  boxes.forEach((box) => {
    if (pair.bodyA === box.body || pair.bodyB === box.body) {
      const impactForce = calculateImpact(pair);
      box.applyDamage(impactForce);
    }
  });
}

function handlePiggyCollision(pair) {
  for (let i = piggies.length - 1; i >= 0; i--) {
    if (pair.bodyA === piggies[i].body || pair.bodyB === piggies[i].body) {
      piggies[i].applyDamage(25);
      if (piggies[i].isDestroyed()) {
        const pos = piggies[i].body.position;
        explosions.push(new Explosion(pos.x, pos.y));
        World.remove(world, piggies[i].body);
        piggies.splice(i, 1);
      }
    }
  }
}

// Calcular fuerza de impacto
function calculateImpact(pair) {
  const velocityA = pair.bodyA.velocity;
  const velocityB = pair.bodyB.velocity;
  return Math.sqrt(
    Math.pow(velocityA.x - velocityB.x, 2) + Math.pow(velocityA.y - velocityB.y, 2)
  ) * 5; // Factor de escala
}

// Control de teclado
function keyPressed() {
  if (key.toLowerCase() === "r") {
    location.reload();
  }
}

// Reiniciar pájaro
function resetBird() {
  World.remove(world, bird.body);
  birdIndex = (birdIndex + 1) % birds.length;
  bird = new birds[birdIndex](120, 350);
  slingShot.attach(bird);
}

function loseMessage() {
  Board.show();
  fill(255); // Color blanco para el texto
  textSize(35);
  textAlign(CENTER, CENTER);
  text("Nivel Fallido", width / 2, height / 2 - 20); // Ajuste de la posición del texto
  fill(200); // Color blanco para el texto
  textSize(20);
  textAlign(CENTER, CENTER);
  text("(R) para reiniciar", width / 2, height / 2 + 50); // Ajuste de la posición del texto
}

function winMessage() {
  Board.show();
  fill(255); // Color blanco para el texto
  textSize(35);
  textAlign(CENTER, CENTER);
  text("¡Nivel Completado!", width / 2, height / 2 - 20); // Ajuste de la posición del texto
  fill(200); // Color blanco para el texto
  textSize(20);
  textAlign(CENTER, CENTER);
  text("(R) para reiniciar", width / 2, height / 2 + 50); // Ajuste de la posición del texto
}
