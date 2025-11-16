// Array con los datos de los testimonios
const testimonials = [
    /*{
        name: "Maria Grau",
        date: "2025-04-10",
        image: "https://ui-avatars.com/api/?name=Milvia+gstetica&background=e91e63&color=fff&size=100",
        comment: "Excelente servicio, cumplieron con todas mis expectativas, muy contenta con todo, súper recomendado."
    }*/

];

// Función para formatear la fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('es-ES', options);
}

// Función para crear una tarjeta de testimonio (slide)
function createTestimonialCard(testimonial) {
    return `
        <div class="testimonial-card">
            <div class="card-header">
                <img src="${testimonial.image}" alt="${testimonial.name}" class="profile-image">
                <div class="user-info">
                    <div class="user-name">${testimonial.name}</div>
                    <div class="comment-date">${formatDate(testimonial.date)}</div>
                </div>
                <svg class="google-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
            </div>
            <div class="card-stars">
                <span>★★★★★</span>
                <img src="images/verificado.png" alt="Verificado" class="verified-badge">
            </div>
            <div class="comment-text">${testimonial.comment}</div>
        </div>
    `;
}

// Slider state
let currentIndex = 0;
const SLIDE_GAP_PX = 30; // debe coincidir con el gap del track en CSS

// Ancho estándar para las tarjetas
const STANDARD_CARD_WIDTH = {
    mobile: 350,   // móvil
    tablet: 400,   // tablet
    desktop: 420   // desktop
};

function getVisibleCount() {
    // 3 en desktop, 2 en tablet, 1 en móvil
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
}

function getStandardCardWidth() {
    if (window.innerWidth <= 640) return STANDARD_CARD_WIDTH.mobile;
    if (window.innerWidth <= 1024) return STANDARD_CARD_WIDTH.tablet;
    return STANDARD_CARD_WIDTH.desktop;
}

function layoutAndUpdate(track) {
    const viewport = document.querySelector('.carousel-viewport');
    if (!viewport) return;
    const visible = getVisibleCount();
    const slides = Array.from(track.children);

    const prevBtn = document.getElementById('prevTestimonials');
    const nextBtn = document.getElementById('nextTestimonials');

    // Ocultar botones si no hay slides o si todas las tarjetas caben en la pantalla
    if (slides.length === 0 || slides.length <= visible) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    // Mostrar botones si hay suficientes slides para desplazar
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';

    // Usar ancho estándar para las tarjetas
    const standardWidth = getStandardCardWidth();
    slides.forEach(function (slide) {
        slide.style.width = standardWidth + 'px';
        slide.style.minWidth = standardWidth + 'px';
        slide.style.maxWidth = standardWidth + 'px';
        slide.style.flex = '0 0 auto';
    });
    track.style.gap = SLIDE_GAP_PX + 'px';

    const maxIndex = Math.max(0, slides.length - visible);
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const offset = -(currentIndex * (standardWidth + SLIDE_GAP_PX));
    track.style.transform = `translateX(${offset}px)`;
    track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

    if (prevBtn && nextBtn) {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === maxIndex;
    }
}

function renderTestimonials() {
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;
    
    const prevBtn = document.getElementById('prevTestimonials');
    const nextBtn = document.getElementById('nextTestimonials');
    
    // Ocultar botones si no hay testimonios
    if (testimonials.length === 0) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }
    
    track.innerHTML = testimonials.map(function (t) { return `<div class="carousel-slide">${createTestimonialCard(t)}</div>`; }).join('');
    currentIndex = 0;
    layoutAndUpdate(track);

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function () {
            currentIndex -= 1;
            layoutAndUpdate(track);
        });
        nextBtn.addEventListener('click', function () {
            currentIndex += 1;
            layoutAndUpdate(track);
        });
    }

    window.addEventListener('resize', function () {
        layoutAndUpdate(track);
    });
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', renderTestimonials);