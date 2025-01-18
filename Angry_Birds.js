const {Engine, World, Bodies, Body, Constraint, Mouse, MouseConstraint} = Matter;

let engine, world, ground, bird, piggies = [],
  slingShot, boxes = [], mc,
  birdImg = [], piggyImg = [],
  boxImg, groundImg, bgImg, explosionImg, 
  explosions = [], bgMusic;

let birdIndex = 0; // Índice para controlar el cambio de pájaros
const birds = [Red, Terence, Chuck]; // Array con las clases de pájaros

function preload() {
  bgImg = loadImage("img/background.jpg");
  birdImg = [
    loadImage("img/red.webp"),
    loadImage("img/terence.webp"),
    loadImage("img/chuck.webp")
  ];
  boxImg = loadImage("img/box.png");
  groundImg = loadImage("img/ground.jpg");
  piggyImg = [
    loadImage("img/piggy1.webp")
  ];
  explosionImg = loadImage("img/explosion.png");
  bgMusic = loadSound("music/music.mp3");
}

function setup() {
  const canvas = createCanvas(900, 600);

  engine = Engine.create();
  world = engine.world;

  const mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = pixelDensity();

  mc = MouseConstraint.create(engine, {
    mouse: mouse,
    collisionFilter: {
      mask: 2
    }
  });
  World.add(world, mc);
  
  // Reproducir la música de fondo en bucle si no está sonando
  if (!bgMusic.isPlaying()) {
    bgMusic.setVolume(0.5); // Controla el volumen (0 a 1)
    bgMusic.loop(); // Inicia la música en bucle
  }

  ground = new Ground(width / 2, height - 10, width, 20, groundImg);

  bird = new birds[birdIndex](120, 350);
  
  slingShot = new SlingShot(bird);
  
  // Crear los cerditos
  piggies.push(new Piggy1(400, 270));
  piggies.push(new Piggy1(460, 270));
  piggies.push(new Piggy1(520, 270));
  piggies.push(new Piggy1(580, 270));

  // Crear las cajas
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 5; i++) {
      const box = new Box(
        400 + j * 60,
        height - 40 * (i + 1),
        40, 40, boxImg, 300
      );
      boxes.push(box);
    }
  }
  
  // Detectar colisiones y aplicar daño a cajas
  Matter.Events.on(engine, "collisionStart", (event) => {
    const pairs = event.pairs;

    for (let pair of pairs) {
      // Si alguno de los cuerpos en la colisión es una caja
      for (let i = 0; i < boxes.length; i++) {
        if (pair.bodyA === boxes[i].body || pair.bodyB === boxes[i].body) {
          const velocityA = pair.bodyA.velocity;
          const velocityB = pair.bodyB.velocity;
          const impactForce = Math.sqrt(
            Math.pow(velocityA.x - velocityB.x, 2) +
            Math.pow(velocityA.y - velocityB.y, 2)
          ) * 5; // Factor de escala para daño

          boxes[i].applyDamage(impactForce); // Aplicar daño a la caja
        }
      }
    }
  });
  
  // Detectar colisiones y aplicar daño a los cerdos
  Matter.Events.on(engine, "collisionStart", (event) => {
    const pairs = event.pairs;

    for (let pair of pairs) {
      // Comprobamos si alguno de los cuerpos involucrados en la colisión es un cerdito
      for (let i = piggies.length - 1; i >= 0; i--) {
        if (pair.bodyA === piggies[i].body || pair.bodyB === piggies[i].body) {
          piggies[i].applyDamage(25); // Aplica 25 de daño por colisión
          if (piggies[i].isDestroyed()) {
            // Crear una explosión en la posición del cerdito
            const pos = piggies[i].body.position;
            explosions.push(new Explosion(pos.x, pos.y));    
            // Eliminar el cerdito del mundo y del arreglo
            World.remove(world, piggies[i].body);
            piggies.splice(i, 1);
          }
        }
      }
    }
  });
}

function draw() {
  background(bgImg);

  Engine.update(engine);
  slingShot.fly(mc);

  ground.show();

  // Mostrar explosiones
  for (let i = explosions.length - 1; i >= 0; i--) {
    explosions[i].show();
    if (explosions[i].isExpired()) {
      explosions.splice(i, 1); // Eliminar explosión si ha expirado
    }
  }
  
  // Mostrar y manejar cajas
  for (let i = boxes.length - 1; i >= 0; i--) {
    boxes[i].show();
    if (boxes[i].isDestroyed()) {
      const pos = boxes[i].body.position;
      explosions.push(new Explosion(pos.x, pos.y)); // Crear explosión
      World.remove(world, boxes[i].body); // Eliminar la caja del mundo
      boxes.splice(i, 1); // Eliminar la caja del arreglo
    }
  }

  slingShot.show();
  
  bird.show();
  
  // Mostrar cerditos
  for (let i = piggies.length - 1; i >= 0; i--) {
    piggies[i].show();
  }
}

function keyPressed() {
  if (key == 'r') {
    World.remove(world, bird.body); // Eliminar el pájaro actual

    // Incrementar el índice para que el siguiente pájaro sea el siguiente en el orden
    birdIndex = (birdIndex + 1) % birds.length;
    // Crear el siguiente pájaro según el índice
    bird = new birds[birdIndex](120, 350);

    slingShot.attach(bird); // Volver a conectar el pájaro al SlingShot
  }
  
  // Aumentar velocidad de Chuck al presionar espacio
  if (key == ' ' && bird instanceof Chuck) {
    const isFlying = !slingShot.isAttached(); // Verifica si el pájaro está volando (desconectado)
    if (isFlying) {
      // Aplicar una fuerza adicional en la dirección del movimiento actual
      const force = 0.05; // Ajusta el valor según lo que necesites
      const velocity = bird.body.velocity;
      Body.applyForce(
        bird.body,
        bird.body.position,
        { x: velocity.x * force, y: velocity.y * force }
      );
    }
  }
}
