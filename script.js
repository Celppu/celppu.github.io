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
    const headlineArray =  [...headline.textContent];
    
    // Create a new span for each character with a random font
    headline.innerHTML = headlineArray.map(char => {
        const span = document.createElement('span');
        span.textContent = char;
        setRandomFont(span);
        return span.outerHTML;
    }).join('');
}

// Update the font of the headline every second
setInterval(updateHeadlineFont, 500);

function getRandomHSV() {
    const hue = Math.floor(Math.random() * 360); // Hue: 0 to 359 degrees
    // Saturation: 0 to 50%
    const saturation = Math.floor(Math.random() * 51);
    // Value: 50 to 100%
    const value = Math.floor(Math.random() * 51) + 50;
    return { hue, saturation, value };
}

function hsvToRgb(h, s, v) {
    let r, g, b;
    s = s / 100;
    v = v / 100;

    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - s * f);
    const t = v * (1 - s * (1 - f));

    switch (i) {
        case 0:
            r = v; g = t; b = p; break;
        case 1:
            r = q; g = v; b = p; break;
        case 2:
            r = p; g = v; b = t; break;
        case 3:
            r = p; g = q; b = v; break;
        case 4:
            r = t; g = p; b = v; break;
        case 5:
            r = v; g = p; b = q; break;
        default:
            r = g = b = v; break;
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}


// Particles logic
const NUM_PARTICLES = 100;
const SPEED_GAIN = 0.004;  
const GRAVITY_GAIN = 0.003;  
const FADE_SPEED = 0.005;  

const MAX_SPEED = 4;
const GRAVITY_SPEED_LIMIT = 1.1;
const SPEED_LIMIT_GAIN = 0.05;
const GRAVITY_LIMIT_GAIN = 0.02;

const SIZE_GAIN = 0.01;  // How fast the size of the particle changes
const MAX_SIZE = 10;  // Max size of a particle
const MIN_SIZE = 2;  // Min size of a particle

const particlesContainer = document.createElement('div');
particlesContainer.classList.add('particles-container');
document.body.appendChild(particlesContainer);

let documentHeight = document.documentElement.scrollHeight;
let documentWidth = document.documentElement.scrollWidth;

class Particle {
    constructor() {
        //this.x = Math.random() * window.innerWidth;
        //this.y = Math.random() * window.innerHeight;
        this.x = Math.random() * document.documentElement.scrollWidth;
        this.y = Math.random() * document.documentElement.scrollHeight;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.opacity = Math.random();
        this.fadeDirection = Math.random() < 0.5 ? -1 : 1; 
        this.element = null;
        this.size = (Math.random() * (MAX_SIZE - MIN_SIZE)) + MIN_SIZE; // Random initial size
        this.sizeChangeRate = (Math.random() < 0.5 ? 1 : -1) * SIZE_GAIN; // Random initial direction for size change
        
        const hsv = getRandomHSV();
        const rgb = hsvToRgb(hsv.hue, hsv.saturation, hsv.value);
        this.color = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    }

    create() {
        this.element = document.createElement('div');
        this.element.classList.add('particle');
        this.element.classList.add('particle');
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.opacity = this.opacity;
        this.element.style.backgroundColor = this.color;
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
        //if (this.x < 0) this.x += window.innerWidth;
        //if (this.x > window.innerWidth) this.x -= window.innerWidth;
        //if (this.y < 0) this.y += window.innerHeight;
        //if (this.y > window.innerHeight) this.y -= window.innerHeight;
        if (this.x < 0) this.x += documentWidth;
        if (this.x > documentWidth) this.x -= documentWidth;
        if (this.y < 10) this.y += documentHeight;
        if (this.y > documentHeight-10) this.y -= documentHeight;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    
        // Fade logic
        if (this.opacity <= 0.1 || this.opacity >= 1) {
            this.fadeDirection *= -1;
        }
        this.opacity += this.fadeDirection * FADE_SPEED;
        this.element.style.opacity = this.opacity;

        // Adjust the size
        this.size += this.sizeChangeRate;

        // Reverse the size change direction if limits are hit
        if (this.size >= MAX_SIZE || this.size <= MIN_SIZE) {
            this.sizeChangeRate = -this.sizeChangeRate;
        }

        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
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
            /*if (particle.x > window.innerWidth) {
                particle.x = Math.random() * window.innerWidth;
            }
            if (particle.y > window.innerHeight) {
                particle.y = Math.random() * window.innerHeight;
            }*/
            if (particle.x > document.documentElement.scrollWidth) {
                particle.x = Math.random() * document.documentElement.scrollWidth;
            }
            if (particle.y > document.documentElement.scrollHeight) {
                particle.y = Math.random() * document.documentElement.scrollHeight;
            }
        });
    }

    currentWidth = window.innerWidth;
    currentHeight = window.innerHeight;
}

function updateDocumentDimensions() {
    documentHeight = document.documentElement.scrollHeight;
    documentWidth = document.documentElement.scrollWidth;
}
window.addEventListener('resize', updateDocumentDimensions);

window.onload = function() {
    updateDocumentDimensions();
    updateParticlesForResize();
}

document.addEventListener('mousemove', moveParticles);
window.addEventListener('resize', updateParticlesForResize);  

animate();  // Start the animation loop

/*
$(document).ready(function() {
    $(window).scroll(function() {
        $('.fade-in').each(function() {
            let objectTop = $(this).offset().top;
            let windowBottom = $(window).scrollTop() + $(window).height();
            
            // Adjust these numbers if you want the fade to happen earlier or later
            let fadeInStart = objectTop + 200; // When to start fading in
            let fadeOutEnd = objectTop - 100;  // When the fade out is complete

            if (windowBottom > fadeInStart) {
                $(this).css('opacity', 1); // Fade in
            } else if ($(window).scrollTop() < fadeOutEnd) {
                $(this).css('opacity', 0); // Fade out
            }
        });
    });
});*/
/* Same fade in/out effect, but scale the opacity by how much of the element is visible*/

$(document).ready(function() {
    $(window).scroll(function() {
        $('.fade-in').each(function() {
            let objectTop = $(this).offset().top;
            let objectBottom = objectTop + $(this).outerHeight();
            let windowTop = $(window).scrollTop();
            let windowBottom = windowTop + $(window).height();

            // Check how much of the object is currently visible
            let objectVisibleTop = Math.max(objectTop, windowTop);
            let objectVisibleBottom = Math.min(objectBottom, windowBottom);

            let visibleHeight = Math.max(0, objectVisibleBottom - objectVisibleTop);
            let totalHeight = $(this).outerHeight();

            // Scale opacity based on visible percentage
            let opacity = visibleHeight / totalHeight;

            $(this).css('opacity', opacity);
        });
    });
});
