// Properties Carousel
class Carousel {
    constructor(carouselElement, dotsContainer, prevBtn, nextBtn) {
        this.carousel = carouselElement;
        this.dotsContainer = dotsContainer;
        this.prevBtn = prevBtn;
        this.nextBtn = nextBtn;
        this.cards = Array.from(this.carousel.children);
        this.currentIndex = 0;
        this.cardWidth = 0;
        this.visibleCards = 3;

        this.init();
    }

    init() {
        // Esperar a que las imágenes se carguen para calcular dimensiones correctas
        const images = this.carousel.querySelectorAll('img');
        let imagesLoaded = 0;
        const totalImages = images.length;

        if (totalImages === 0) {
            this.setupCarousel();
        } else {
            images.forEach(img => {
                if (img.complete) {
                    imagesLoaded++;
                } else {
                    img.addEventListener('load', () => {
                        imagesLoaded++;
                        if (imagesLoaded === totalImages) {
                            this.setupCarousel();
                        }
                    });
                    img.addEventListener('error', () => {
                        imagesLoaded++;
                        if (imagesLoaded === totalImages) {
                            this.setupCarousel();
                        }
                    });
                }
            });

            if (imagesLoaded === totalImages) {
                this.setupCarousel();
            }
        }
    }

    setupCarousel() {
        // Pequeño delay para asegurar que el DOM está listo
        setTimeout(() => {
            this.updateDimensions();
            this.createDots();
            this.attachEvents();
            this.updateCarousel();

            window.addEventListener('resize', () => {
                clearTimeout(this.resizeTimeout);
                this.resizeTimeout = setTimeout(() => {
                    this.updateDimensions();
                    this.updateCarousel();
                }, 150);
            });
        }, 100);
    }

    updateDimensions() {
        if (this.cards.length === 0) return;

        const containerWidth = this.carousel.parentElement.offsetWidth;
        const gap = 30;
        const padding = 120; // padding left + right del wrapper

        if (window.innerWidth <= 480) {
            this.visibleCards = 1;
            this.cardWidth = Math.min(containerWidth - padding, window.innerWidth - padding);
        } else if (window.innerWidth <= 768) {
            this.visibleCards = 1;
            this.cardWidth = this.cards[0]?.offsetWidth + gap || 350 + gap;
        } else if (window.innerWidth <= 1024) {
            this.visibleCards = 2;
            this.cardWidth = this.cards[0]?.offsetWidth + gap || 350 + gap;
        } else {
            this.visibleCards = 3;
            this.cardWidth = this.cards[0]?.offsetWidth + gap || 350 + gap;
        }

        // Asegurar que cardWidth tenga un valor válido
        if (!this.cardWidth || this.cardWidth <= 0) {
            this.cardWidth = this.cards[0]?.offsetWidth + gap || 380;
        }

        this.maxIndex = Math.max(0, this.cards.length - this.visibleCards);
    }

    createDots() {
        if (!this.dotsContainer) return;

        this.dotsContainer.innerHTML = '';
        const numDots = this.cards.length - this.visibleCards + 1;

        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    attachEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        // Touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) {
                this.next();
            } else if (touchEndX - touchStartX > 50) {
                this.prev();
            }
        });
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }

    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }

    goToSlide(index) {
        this.currentIndex = Math.min(index, this.maxIndex);
        this.updateCarousel();
    }

    updateCarousel() {
        if (this.cards.length === 0) return;
        
        // Recalcular dimensiones antes de actualizar
        this.updateDimensions();
        
        const offset = -this.currentIndex * this.cardWidth;
        this.carousel.style.transform = `translateX(${offset}px)`;
        this.carousel.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

        this.updateDots();
    }

    updateDots() {
        if (!this.dotsContainer) return;

        const dots = this.dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
}

// Properties carousel is now handled by complementos/properties.js

// Initialize Reviews Carousel
const reviewsCarousel = document.querySelector('.reviews-carousel');
const reviewsDots = document.querySelector('.reviews-dots');
const reviewsPrev = document.querySelector('.reviews-prev');
const reviewsNext = document.querySelector('.reviews-next');

if (reviewsCarousel) {
    new Carousel(reviewsCarousel, reviewsDots, reviewsPrev, reviewsNext);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Hero top bar scroll effect
const heroTopBar = document.querySelector('.hero-top-bar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (heroTopBar) {
        if (currentScroll > 100) {
            heroTopBar.style.opacity = '0.9';
            heroTopBar.style.transform = 'translateY(-5px)';
        } else {
            heroTopBar.style.opacity = '1';
            heroTopBar.style.transform = 'translateY(0)';
        }
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-item, .service-card').forEach(el => {
    observer.observe(el);
});

// Auto-scroll carousels (optional)
let autoScrollInterval;

function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
        const event = new Event('click');
        if (reviewsNext && reviewsCarousel) {
            const currentTransform = reviewsCarousel.style.transform;
            const maxScroll = reviewsCarousel.scrollWidth - reviewsCarousel.parentElement.offsetWidth;

            if (!currentTransform || currentTransform === 'translateX(0px)' ||
                Math.abs(parseInt(currentTransform.match(/-?\d+/)[0])) < maxScroll - 50) {
                reviewsNext.dispatchEvent(event);
            } else {
                // Reset to beginning
                const dots = reviewsDots?.querySelectorAll('.dot');
                if (dots && dots[0]) {
                    dots[0].click();
                }
            }
        }
    }, 5000);
}

function stopAutoScroll() {
    clearInterval(autoScrollInterval);
}

// Start auto-scroll for reviews
if (reviewsCarousel) {
    startAutoScroll();

    // Pause auto-scroll on hover
    const reviewsSection = document.querySelector('.reviews');
    reviewsSection?.addEventListener('mouseenter', stopAutoScroll);
    reviewsSection?.addEventListener('mouseleave', startAutoScroll);
}

// Parallax effect on hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');

    if (hero && scrolled <= hero.offsetHeight) {
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
    }
});

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// WhatsApp button pulse on scroll
const whatsappBtn = document.querySelector('.whatsapp-float');
let pulseTimeout;

window.addEventListener('scroll', () => {
    if (whatsappBtn) {
        whatsappBtn.style.animation = 'none';
        clearTimeout(pulseTimeout);

        pulseTimeout = setTimeout(() => {
            whatsappBtn.style.animation = 'bounce 2s infinite';
        }, 1000);
    }
});

// Formulario de contacto - Envío a WhatsApp
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevenir el envío por defecto del formulario

        // Obtener los valores del formulario
        const nombreCompleto = document.getElementById('nombreCompleto').value.trim();
        const numeroContacto = document.getElementById('numeroContacto').value.trim();
        const transaccion = document.getElementById('transaccion').value;
        const ubicacion = document.getElementById('ubicacion').value.trim();

        // Validar que todos los campos estén llenos
        if (!nombreCompleto || !numeroContacto || !transaccion || !ubicacion) {
            alert('Por favor, completa todos los campos del formulario.');
            return;
        }

        // Formatear el nombre de la transacción
        const transaccionTexto = transaccion.charAt(0).toUpperCase() + transaccion.slice(1);

        // Construir el mensaje para WhatsApp
        const mensaje = `Hola, me gustaría solicitar información sobre una propiedad.

*Datos del contacto:*
• Nombre: ${nombreCompleto}
• Teléfono: ${numeroContacto}
• Tipo de transacción: ${transaccionTexto}
• Ubicación de interés: ${ubicacion}

Gracias por su atención.`;

        // Número de WhatsApp (sin espacios ni caracteres especiales)
        const whatsappNumber = '34651640323';

        // Codificar el mensaje para la URL
        const mensajeCodificado = encodeURIComponent(mensaje);

        // Construir la URL de WhatsApp
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${mensajeCodificado}`;

        // Abrir WhatsApp en una nueva ventana
        window.open(whatsappUrl, '_blank');

        // Opcional: Limpiar el formulario después de enviar
        contactForm.reset();
    });
}
