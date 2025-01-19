class Box {
  constructor(x, y, w, h, img, durability) {
    this.body = Bodies.rectangle(x, y, w, h, { restitution: 0.5 });
    this.w = w;
    this.h = h;
    this.img = img;
    this.durability = durability; // Durabilidad inicial
    this.brokenImg = loadImage("img/brokenbox.png"); // Imagen cuando está dañado
    World.add(world, this.body);
  }

  show() {
    const pos = this.body.position;
    const angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);

    imageMode(CENTER);
    if (this.durability <= 50 && this.durability > 0) {
      image(this.brokenImg, 0, 0, this.w, this.h);
    } else {
      image(this.img, 0, 0, this.w, this.h);
    }
    pop();
  }

  isDestroyed() {
    return this.durability <= 0;
  }

  applyDamage(impactForce) {
    this.durability -= impactForce;
    if (this.durability < 0) {
      this.durability = 0;
    }
  }
}

class Ground {
  constructor(x, y, w, h, img) {
    this.body = Bodies.rectangle(x, y, w, h, { isStatic: true });
    this.w = w;
    this.h = h;
    this.img = img;
    World.add(world, this.body);
  }

  show() {
    const pos = this.body.position;
    push();
    imageMode(CENTER);
    image(this.img, pos.x, pos.y, this.w, this.h);
    pop();
  }
}

class SlingShot {
  constructor(bird) {
    this.sling = Constraint.create({
      pointA: {
        x: bird.body.position.x,
        y: bird.body.position.y
      },
      bodyB: bird.body,
      stiffness: 0.1,
      length: 1
    });
    World.add(world, this.sling);
    this.slingImg = null;
  }
  
  // Método para asignar la imagen del slingshot
  setImage(img) {
    this.slingImg = img;
  }
  
  show() {
    if (this.sling.bodyB) {    
      line(this.sling.pointA.x,
        this.sling.pointA.y,
        this.sling.bodyB.position.x,
        this.sling.bodyB.position.y
      );
    }
  }
  
  fly(mc){
    if(this.sling.bodyB &&
       mc.mouse.button === -1 &&
       this.sling.bodyB.position.x > 
       this.sling.pointA.x + 10) {
       this.sling.bodyB.collisionFilter.category = 1
       this.sling.bodyB = null;
    }
  }
  
  attach(bird) {
    this.sling.bodyB = bird.body;
  }
  
  isAttached() {
    return this.sling.bodyB !== null; // Devuelve true si hay un cuerpo conectado
  }
}

class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.timer = 10; // Duración de la explosión (~1 segundo a 60 FPS)
  }

  show() {
    if (this.timer > 0) {
      push();
      imageMode(CENTER);
      image(explosionImg, this.x, this.y, 70, 70); // Utiliza la imagen cargada
      pop();
      this.timer--;
    }
  }

  isExpired() {
    return this.timer <= 0;
  }
}

class Decoration {
  constructor(x, y, w, h, img, opacity = 255) {
    this.x = x; // Posición x
    this.y = y; // Posición y
    this.w = w; // Ancho
    this.h = h; // Alto
    this.img = img; // Imagen de la decoración
    this.opacity = opacity; // Opacidad de la decoración (255 es totalmente opaco)
  }

  show() {
    push();
    tint(255, this.opacity); // Aplicar opacidad
    imageMode(CENTER);
    image(this.img, this.x, this.y, this.w, this.h); // Dibujar la imagen
    pop();
  }

  // Método para cambiar la opacidad
  setOpacity(opacity) {
    this.opacity = opacity;
  }

  // Método para cambiar la posición
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  // Método para cambiar el tamaño
  setSize(w, h) {
    this.w = w;
    this.h = h;
  }

  // Método para cambiar la imagen
  setImage(img) {
    this.img = img;
  }
}

class MetalBox {
  constructor(x, y, w, h, img) {
    this.body = Bodies.rectangle(x, y, w, h, { isStatic: true });
    this.w = w;
    this.h = h;
    this.img = img;
    World.add(world, this.body);
  }

  show() {
    const pos = this.body.position;
    push();
    imageMode(CENTER);
    image(this.img, pos.x, pos.y, this.w, this.h);
    pop();
  }
}
