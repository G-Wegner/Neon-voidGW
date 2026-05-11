function openProject(title, desc, ...images) {
    // A. Texte im Modal und Deep-Dive setzen
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    
    document.getElementById('modal-title').innerText = title;
   document.getElementById('modal-desc').innerHTML = desc;

   
   // C. Galerie-Bilder im Modal
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach((item, index) => {
    const fileSrc = images[index] ? images[index].trim() : null;
    
    if (fileSrc) {
        item.style.display = "block";
        
        // Prüfen, ob die Datei auf .mp4 endet
        if (fileSrc.toLowerCase().endsWith('.mp4')) {
            item.innerHTML = `
                <video autoplay loop muted playsinline class="modal-img">
                    <source src="${fileSrc}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>`;
        } else {
            // Normales Bild
            item.innerHTML = `<img src="${fileSrc}" class="modal-img">`;
        }
    } else {
        item.style.display = "none";
        item.innerHTML = "";
    }
});

    // C. Modal anzeigen & Scroll-Reset
    const modal = document.getElementById('project-modal');
    if(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; 
        
        // WICHTIG: Setzt die Bildergalerie rechts beim Öffnen nach oben
        const gallerySide = document.querySelector('.modal-gallery-side');
        if(gallerySide) gallerySide.scrollTop = 0;

        gsap.fromTo(".modal-window", 
            { y: 100, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
        );
    }
}

function closeModal() {
    gsap.to(".modal-window", { 
        y: 100, 
        opacity: 0, 
        duration: 0.4, 
        ease: "power2.in",
        onComplete: () => {
            // 1. Modal verstecken
            const modal = document.getElementById('project-modal');
            if(modal) modal.style.display = 'none';
            
            // 2. Hintergrund-Scrollen wieder aktivieren
            document.body.style.overflow = 'auto';
            
            // 3. ZURÜCK ZU DEN BOXEN SCROLLEN
            // Wir suchen die Sektion mit den Projekt-Boxen
            const projectSection = document.querySelector('.projects');
            if(projectSection) {
                projectSection.scrollIntoView({ behavior: 'smooth' });
            }
        } 
    });
}

// --- 2. HIGH-END PARTICLE VORTEX (Three.js) ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const particlesCount = 15000;
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05, color: 0x00f2ff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);
camera.position.z = 30;

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX - window.innerWidth / 2;
    mouseY = e.clientY - window.innerHeight / 2;
});

function animate() {
    requestAnimationFrame(animate);
    particlesMesh.rotation.y += 0.001 + (mouseX * 0.00005);
    particlesMesh.rotation.x += 0.0005 + (mouseY * 0.00005);
    particlesMesh.position.y = Math.sin(Date.now() * 0.0001) * 2;
    renderer.render(scene, camera);
}
animate();

// --- 3. GSAP ANIMATIONEN & LOADER ---
gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
    // Seite beim Laden nach oben zwingen
    window.scrollTo(0, 0);

    let count = { val: 0 };
    let target = 100;

    gsap.to(count, {
        val: target,
        duration: 3, // Wie lange der Loader braucht (3 Sek)
        ease: "power2.inOut",
        onUpdate: () => {
            // Update den Text und den Ladebalken
            const counterEl = document.querySelector('.counter');
            const barEl = document.querySelector('.progress-bar');
            
            if(counterEl) counterEl.innerHTML = Math.floor(count.val);
            if(barEl) barEl.style.width = count.val + "%";
        },
        onComplete: () => {
            // Wenn fertig: Loader verschwindet
            const tl = gsap.timeline();
            
            tl.to("#loader", { 
                yPercent: -100, 
                duration: 1.2, 
                ease: "expo.inOut" 
            })
            // Das Logo auf der Webseite schwebt sanft ein
            .from(".main-nav", { 
                y: -50, 
                opacity: 0, 
                duration: 1, 
                ease: "power3.out" 
            }, "-=0.6")
            // Dein restlicher Content (Überschriften etc.)
            .from(".reveal", { 
                y: 50, 
                opacity: 0, 
                stagger: 0.1, 
                duration: 1, 
                ease: "power4.out" 
            }, "-=0.8");
        }
    });
});

// Slider Navigation
function moveSlider(direction) {
    const carousel = document.getElementById('project-carousel');
    if(carousel) carousel.scrollBy({ left: direction * 430, behavior: 'smooth' });
}

// Rechtsklick-Schutz
document.addEventListener('contextmenu', e => { e.preventDefault(); alert("Inhalte geschützt."); });

// Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Suche den onComplete Bereich deines Loaders in der main.js
onComplete: () => {
    const tl = gsap.timeline();
    tl.to("#loader", { yPercent: -100, duration: 1.2, ease: "expo.inOut" })
      
      // Das Logo zusammen mit dem Text einblenden
      .from(".site-logo", { y: -50, opacity: 0, duration: 1.2, ease: "power3.out" }, "-=0.6")
      .from(".reveal", { y: 50, opacity: 0, stagger: 0.15, duration: 1, ease: "power4.out" }, "-=0.8");
}