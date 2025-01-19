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

// red
class Red extends Bird {
  constructor(x, y) {
    const img = birdImg[0]; 
    super(x, y, 20, 3, img); 
  }
}

// Terence
class Terence extends Bird {
  constructor(x, y) {
    const img = birdImg[1];  
    super(x, y, 30, 10, img);  
  }
}

// Chuck
class Chuck extends Bird {
  constructor(x, y) {
    const img = birdImg[2]; 
    super(x, y, 20, 2, img); 
  }
}

// Loser
class Loser extends Bird {
  constructor(x, y) {
    const img = birdImg[3]; 
    super(x, y, 20, 2, img); 
  }
}
