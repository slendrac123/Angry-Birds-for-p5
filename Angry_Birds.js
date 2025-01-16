const {Engine, World, Bodies,
  Body, Constraint,
  Mouse, MouseConstraint} = Matter;

let engine, world, ground, bird, piggie,
  slingShot, boxes = [], mc,
  birdImg = [], piggieImg = [],
  boxImg, groundImg;

let birdIndex = 0; // Índice para controlar el cambio de pájaros
const birds = [Red, Stella, Terence, Red, Terence]; // Array con las clases de pájaros en el orden deseado


function preload(){
  birdImg = [
    loadImage("img/red.webp"),
    loadImage("img/stella.webp"),
    loadImage("img/terence.webp")
  ];
  boxImg = loadImage("img/box.png");
  groundImg = loadImage("img/ground.jpg");
  piggieImg = [
    loadImage("img/piggie1.webp")
  ];
}

function setup() {
  const canvas = createCanvas(700, 500);
  
  engine = Engine.create();
  world = engine.world;
  
  const mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = pixelDensity();
  
  mc = MouseConstraint.create(
    engine, {
      mouse: mouse,
      collisionFilter: {
        mask: 2
      }
    });
  World.add(world, mc);
  
  ground = new Ground(
    width/2, height-10, width, 20,
    groundImg);
  
  for (let j=0; j<4; j++){
    for (let i=0; i<10; i++){
      const box = new Box(
        400 + j*60,
        height - 40*(i+1),
        40, 40, boxImg);
      boxes.push(box);
    }
  }
  
  bird = new birds[birdIndex](120, 375);
  
  slingShot = new SlingShot(bird);
  
  piggie = new Piggie1(100, 100);
}

function draw() {
  background(0, 181, 226);
  
  Engine.update(engine);
  slingShot.fly(mc);
  
  ground.show();
  
  for(const box of boxes) {
    box.show();
  }
  
  slingShot.show();
  bird.show();
  piggie.show();
}

function keyPressed() {
  if (key == ' ') {
    World.remove(world, bird.body); // Eliminar el pájaro actual
    
    // Incrementar el índice para que el siguiente pájaro sea el siguiente en el orden
    birdIndex = (birdIndex + 1) % birds.length;
    // Crear el siguiente pájaro según el índice
    bird = new birds[birdIndex](120, 375);

    slingShot.attach(bird); // Volver a conectar el pájaro al SlingShot
  }
}
