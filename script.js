const headline = document.getElementById('headline');

const fonts = [
    'Arial', 'Verdana', 'Courier New', 'Times New Roman', 'Georgia', 
    'Tahoma', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact',
    'Cormorant Garamond', 'Playfair Display', 'Montserrat', 'Raleway', 'Cinzel'
];

function setRandomFont(element) {
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    element.style.fontFamily = randomFont;
}

function updateHeadlineFont() {
    // Convert the headline string to an array
    const headlineArray = [...headline.textContent];
    
    // Create a new span for each character with a random font
    headline.innerHTML = headlineArray.map(char => {
        const span = document.createElement('span');
        span.textContent = char;
        setRandomFont(span);
        return span.outerHTML;
    }).join('');
}

// Update the font of the headline every second
setInterval(updateHeadlineFont, 1000);



// Particles logic
const NUM_PARTICLES = 100;
const SPEED_GAIN = 0.005;  
const GRAVITY_GAIN = 0.005;  // Made it smaller as it'll incrementally add to the particle's speed
const FADE_SPEED = 0.02;  

const MAX_SPEED = 5;
const GRAVITY_SPEED_LIMIT = 2;
const SPEED_LIMIT_GAIN = 0.05;
const GRAVITY_LIMIT_GAIN = 0.02;

class Particle {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.opacity = 1;
        this.fadeDirection = Math.random() < 0.5 ? -1 : 1; 
        this.element = null;
    }

    create() {
        this.element = document.createElement('div');
        this.element.classList.add('particle');
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.opacity = this.opacity;
        document.body.appendChild(this.element);
    }

    applySpeedLimits() {
        // Apply speed limits for mouse movement
        if (this.speedX > MAX_SPEED) this.speedX -= SPEED_LIMIT_GAIN;
        if (this.speedX < -MAX_SPEED) this.speedX += SPEED_LIMIT_GAIN;
        if (this.speedY > MAX_SPEED) this.speedY -= SPEED_LIMIT_GAIN;
        if (this.speedY < -MAX_SPEED) this.speedY += SPEED_LIMIT_GAIN;

        // Apply speed limits for gravity
        if (this.speedY > GRAVITY_SPEED_LIMIT) this.speedY -= GRAVITY_LIMIT_GAIN;
    }

    move() {
        this.x += this.speedX;
        this.speedY += GRAVITY_GAIN;
        this.y += this.speedY;

        this.applySpeedLimits();
    
        // Wrap particles around screen
        if (this.x < 0) this.x += window.innerWidth;
        if (this.x > window.innerWidth) this.x -= window.innerWidth;
        if (this.y < 0) this.y += window.innerHeight;
        if (this.y > window.innerHeight) this.y -= window.innerHeight;
    
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    
        // Fade logic
        if (this.opacity <= 0.1 || this.opacity >= 1) {
            this.fadeDirection *= -1;
        }
        this.opacity += this.fadeDirection * FADE_SPEED;
        this.element.style.opacity = this.opacity;
    }

    destroy() {
        this.element.remove();
    }
}

let particles = [];

for (let i = 0; i < NUM_PARTICLES; i++) {
    const particle = new Particle();
    particles.push(particle);
    particle.create();
}

function moveParticles(e) {
    particles.forEach(particle => {
        particle.speedX += e.movementX * SPEED_GAIN;
        particle.speedY += e.movementY * SPEED_GAIN;
    });
}

function animate() {
    particles.forEach(particle => particle.move());
    requestAnimationFrame(animate);
}

let currentWidth = window.innerWidth;
let currentHeight = window.innerHeight;

function updateParticlesForResize() {
    const widthDifference = Math.abs((window.innerWidth - currentWidth) / currentWidth);
    const heightDifference = Math.abs((window.innerHeight - currentHeight) / currentHeight);

    if (widthDifference > 0.3 || heightDifference > 0.3) {
        // Reload the entire particle setup
        particles.forEach(particle => particle.destroy());
        particles = [];
        for (let i = 0; i < NUM_PARTICLES; i++) {
            const particle = new Particle();
            particles.push(particle);
            particle.create();
        }
    } else {
        // Otherwise, just adjust particle positions
        particles.forEach(particle => {
            if (particle.x > window.innerWidth) {
                particle.x = Math.random() * window.innerWidth;
            }
            if (particle.y > window.innerHeight) {
                particle.y = Math.random() * window.innerHeight;
            }
        });
    }

    currentWidth = window.innerWidth;
    currentHeight = window.innerHeight;
}



document.addEventListener('mousemove', moveParticles);
window.addEventListener('resize', updateParticlesForResize);  

animate();  // Start the animation loop

