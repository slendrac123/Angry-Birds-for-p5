class Bird {
  constructor(x, y, r, mass, img) {
    this.body = Bodies.circle(x, y, r, {
      restitution: 0.7,
      collisionFilter: {
        category: 2
      }
    });
    this.img = img;
    Body.setMass(this.body, mass);
    World.add(world, this.body);
  }

  show() {
    push();
    imageMode(CENTER);
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    image(this.img, 0, 0, 2 * this.body.circleRadius, 2 * this.body.circleRadius);
    pop();
  }
}

// Clase para el pájaro rojo
class Red extends Bird {
  constructor(x, y) {
    const img = birdImg[0]; // Red bird image
    super(x, y, 20, 2, img);  // Llama al constructor de Bird
  }
}

// Clase para el pájaro Stella
class Stella extends Bird {
  constructor(x, y) {
    const img = birdImg[1]; // Stella bird image
    super(x, y, 20, 3, img);  // Llama al constructor de Bird con un tamaño distinto
  }
}

// Clase para el pájaro Stella
class Terence extends Bird {
  constructor(x, y) {
    const img = birdImg[2]; // Stella bird image
    super(x, y, 30, 3, img);  // Llama al constructor de Bird con un tamaño distinto
  }
}
