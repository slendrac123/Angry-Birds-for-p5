class Piggy {
  constructor(x, y, r, mass, img, durability = 100) {
    this.body = Bodies.circle(x, y, r, {
      restitution: 0.7,
    });
    this.img = img;
    this.durability = durability; // Resistencia inicial
    Body.setMass(this.body, mass);
    World.add(world, this.body);
  }

  show() {
    if (this.isDestroyed()) {
      return; 
    }

    push();
    imageMode(CENTER);
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    image(this.img, 0, 0, 2 * this.body.circleRadius, 2 * this.body.circleRadius);
    pop();
  }

  applyDamage(damage) {
    this.durability -= damage;
    if (this.durability < 0) {
      this.durability = 0;
    }
  }

  isDestroyed() {
    return this.durability <= 0;
  }
}

// Piggy1 (normal)
class Piggy1 extends Piggy {
  constructor(x, y) {
    const img = piggyImg[0];
    const durability = 100;
    super(x, y, 20, 2, img, durability);
  }
}
