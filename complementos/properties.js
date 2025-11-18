// Array con los datos de las propiedades
const properties = [
    {
        image: "https://ext.same-assets.com/1748467512/496956485.jpeg",
        titleKey: "properties.list.1",
        title: {
            es: "ENCANTADOR APARTAMENTO DE DISEÑO EN EL CORAZÓN DEL RAVAL",
            en: "CHARMING DESIGN APARTMENT IN THE HEART OF EL RAVAL",
            ca: "ENCANTADOR APARTAMENT DE DISSENY AL COR DEL RAVAL"
        },
        price: "489.000 €",
        alt: "Encantador Apartamento"
    },
    {
        image: "https://ext.same-assets.com/1748467512/2402669859.jpeg",
        titleKey: "properties.list.2",
        title: {
            es: "ENCANTADOR PISO RENOVADO EN EL RAVAL",
            en: "CHARMING RENOVATED APARTMENT IN EL RAVAL",
            ca: "ENCANTADOR PIS RENOVAT AL RAVAL"
        },
        price: "292.000 €",
        alt: "Encantador piso renovado"
    },
    {
        image: "https://ext.same-assets.com/1748467512/684537922.jpeg",
        titleKey: "properties.list.3",
        title: {
            es: "ESPECTACULAR CASA FAMILIAR EN BARCELONA CON JARDÍN PRIVADO",
            en: "SPECTACULAR FAMILY HOUSE IN BARCELONA WITH PRIVATE GARDEN",
            ca: "ESPECTACULAR CASA FAMILIAR A BARCELONA AMB JARDÍ PRIVAT"
        },
        price: "1.400.000 €",
        alt: "Casa familiar"
    },
    {
        image: "https://ext.same-assets.com/1748467512/512189235.jpeg",
        titleKey: "properties.list.4",
        title: {
            es: "ÁTICO ÚNICO CON TERRAZA PRIVADA Y VISTAS A LA SAGRADA FAMILIA",
            en: "UNIQUE PENTHOUSE WITH PRIVATE TERRACE AND VIEWS OF THE SAGRADA FAMILIA",
            ca: "ÀTIC ÚNIC AMB TERRASSA PRIVADA I VISTES A LA SAGRADA FAMÍLIA"
        },
        price: "319.000 €",
        alt: "Ático único"
    },
    {
        image: "https://ext.same-assets.com/1748467512/4091390319.jpeg",
        titleKey: "properties.list.5",
        title: {
            es: "IMPRESIONANTE DÚPLEX CON VISTAS AL MAR Y DOS TERRAZAS PRIVADAS EN BARCELONA",
            en: "IMPRESSIVE DUPLEX WITH SEA VIEWS AND TWO PRIVATE TERRACES IN BARCELONA",
            ca: "IMPRESSIONANT DÚPLEX AMB VISTES AL MAR I DUES TERRASSES PRIVADES A BARCELONA"
        },
        price: "1.950.000 €",
        alt: "Dúplex"
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
    return `
        <a href="https://www.idealista.com/pro/ag-servicios-inmobiliarios/" target="_blank" class="property-card">
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

