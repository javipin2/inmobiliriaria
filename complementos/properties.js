// Array con los datos de las propiedades
const properties = [
    {
        image: "https://img4.idealista.com/blur/480_360_mq/0/id.pro.es.image.master/b3/67/d2/1388459748.webp",
        titleKey: "properties.list.1",
        title: {
            es: "Piso en venta en Horta, Guinardó - Barcelona",
            en: "Apartment for sale in Horta, Guinardó - Barcelona",
            ca: "Pis en venda a Horta, Guinardó - Barcelona",
            de: "Wohnung zum Verkauf in Horta, Guinardó - Barcelona"
        },
        price: "285.000 €",
        alt: "Piso en venta en Horta, Guinardó - Barcelona",
        link: "https://www.idealista.com/pro/ag-servicios-inmobiliarios/inmueble/109882563/" // Agregar el link aquí
    },
    {
        image: "https://img4.idealista.com/blur/480_360_mq/0/id.pro.es.image.master/c0/45/3b/1382200947.webp",
        titleKey: "properties.list.2",
        title: {
            es: "Chalet adosado en venta en Calle de París, Creu de Barberà - Sabadell",
            en: "Terraced house for sale on París Street, Creu de Barberà - Sabadell",
            ca: "Xalet adossat en venda al Carrer de París, Creu de Barberà - Sabadell",
            de: "Reihenhaus zum Verkauf in der París Straße, Creu de Barberà - Sabadell"
        },
        price: "220.000 €",
        alt: "Chalet adosado en venta en Calle de París, Creu de Barberà - Sabadell",
        link: "https://www.idealista.com/pro/ag-servicios-inmobiliarios/inmueble/109678480/" // Agregar el link aquí
    }
];

// Función para obtener el título traducido
function getPropertyTitle(property) {
    const currentLang = localStorage.getItem('language') || 'es';
    return property.title[currentLang] || property.title.es;
}

// Función para crear una tarjeta de propiedad (slide)
function createPropertyCard(property) {
    const title = getPropertyTitle(property);
    const link = property.link || "https://www.idealista.com/pro/ag-servicios-inmobiliarios/";
    return `
        <a href="${link}" target="_blank" class="property-card">
            <div class="property-image">
                <img src="${property.image}" alt="${property.alt || title}" loading="lazy">
            </div>
            <div class="property-info">
                <h3 class="property-title">${title}</h3>
                <p class="property-price">${property.price}</p>
            </div>
        </a>
    `;
}

// Slider state para propiedades
let propertiesCurrentIndex = 0;
const PROPERTIES_SLIDE_GAP_PX = 90; // debe coincidir con el gap del track en CSS

function getPropertiesVisibleCount() {
    // 3 en desktop, 2 en tablet, 1 en móvil
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
}

function layoutAndUpdateProperties(track) {
    const viewport = track.closest('.properties-carousel-wrapper')?.querySelector('.carousel-viewport');
    if (!viewport) return;
    
    const visible = getPropertiesVisibleCount();
    const slides = Array.from(track.children);

    if (slides.length === 0) return;

    // calcular el ancho exacto de cada slide para que quepan completas
    const totalGap = PROPERTIES_SLIDE_GAP_PX * (visible - 1);
    const slideWidth = Math.max(0, Math.floor((viewport.clientWidth - totalGap) / visible));
    
    slides.forEach(function (slide) {
        slide.style.width = slideWidth + 'px';
        slide.style.flex = '0 0 auto';
    });
    track.style.gap = PROPERTIES_SLIDE_GAP_PX + 'px';

    const maxIndex = Math.max(0, slides.length - visible);
    if (propertiesCurrentIndex > maxIndex) propertiesCurrentIndex = maxIndex;
    if (propertiesCurrentIndex < 0) propertiesCurrentIndex = 0;

    const offset = -(propertiesCurrentIndex * (slideWidth + PROPERTIES_SLIDE_GAP_PX));
    track.style.transform = `translateX(${offset}px)`;
    track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

    const prevBtn = document.getElementById('prevProperties');
    const nextBtn = document.getElementById('nextProperties');
    if (prevBtn && nextBtn) {
        prevBtn.disabled = propertiesCurrentIndex === 0;
        nextBtn.disabled = propertiesCurrentIndex >= maxIndex;
    }
}

function renderProperties() {
    const track = document.getElementById('propertiesTrack');
    if (!track) return;
    
    track.innerHTML = properties.map(function (p) { 
        return `<div class="carousel-slide">${createPropertyCard(p)}</div>`; 
    }).join('');
    
    propertiesCurrentIndex = 0;
    
    // Esperar a que las imágenes se carguen antes de calcular dimensiones
    const images = track.querySelectorAll('img');
    let imagesLoaded = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
        layoutAndUpdateProperties(track);
    } else {
        images.forEach(img => {
            if (img.complete) {
                imagesLoaded++;
            } else {
                img.addEventListener('load', () => {
                    imagesLoaded++;
                    if (imagesLoaded === totalImages) {
                        layoutAndUpdateProperties(track);
                    }
                });
                img.addEventListener('error', () => {
                    imagesLoaded++;
                    if (imagesLoaded === totalImages) {
                        layoutAndUpdateProperties(track);
                    }
                });
            }
        });

        if (imagesLoaded === totalImages) {
            layoutAndUpdateProperties(track);
        }
    }

    const prevBtn = document.getElementById('prevProperties');
    const nextBtn = document.getElementById('nextProperties');
    
    if (prevBtn && nextBtn) {
        // Remover listeners anteriores si existen
        const newPrevBtn = prevBtn.cloneNode(true);
        const newNextBtn = nextBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

        newPrevBtn.addEventListener('click', function () {
            if (propertiesCurrentIndex > 0) {
                propertiesCurrentIndex -= 1;
                layoutAndUpdateProperties(track);
            }
        });
        
        newNextBtn.addEventListener('click', function () {
            const visible = getPropertiesVisibleCount();
            const maxIndex = Math.max(0, track.children.length - visible);
            if (propertiesCurrentIndex < maxIndex) {
                propertiesCurrentIndex += 1;
                layoutAndUpdateProperties(track);
            }
        });
    }

    // Debounce para resize
    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            layoutAndUpdateProperties(track);
        }, 150);
    });
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', renderProperties);

// Hacer la función disponible globalmente para el sistema de traducciones
window.renderProperties = renderProperties;

