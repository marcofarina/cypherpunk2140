document.addEventListener('DOMContentLoaded', function() {

    // Gestione Menu Laterale (Off-canvas)
    const menuToggleButton = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const sideMenuNavLinks = sideMenu.querySelectorAll('nav a');

    function openMenu() {
        menuToggleButton.classList.add('active');
        sideMenu.classList.add('open');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menuToggleButton.classList.remove('active');
        sideMenu.classList.remove('open');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (menuToggleButton && sideMenu && menuOverlay) {
        menuToggleButton.addEventListener('click', function(event) {
            event.stopPropagation();
            if (sideMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        menuOverlay.addEventListener('click', closeMenu);

        sideMenuNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (link.getAttribute('target') !== '_blank') {
                    closeMenu();
                }
            });
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && sideMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // Anno corrente per il footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Gestione Altezza Header (necessaria per offset scroll e posizionamento menu)
    const header = document.getElementById('main-header');
    let headerHeight = header ? header.offsetHeight : 70;

    function updateHeaderHeight() {
        if (header) {
            headerHeight = header.offsetHeight;
        }
    }
    window.addEventListener('resize', updateHeaderHeight);
    updateHeaderHeight(); // Calcola all'inizio

    // Smooth scroll per i link interni e gestione link attivo nell'header
    const headerNavLinks = document.querySelectorAll('.header-nav a');
    const sections = []; // Array per memorizzare gli elementi delle sezioni
    headerNavLinks.forEach(link => {
        const sectionId = link.getAttribute('href');
        if (sectionId && sectionId.startsWith('#')) {
            const sectionElement = document.querySelector(sectionId);
            if (sectionElement) {
                sections.push(sectionElement);
            }
        }

        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    function changeActiveHeaderLinkOnScroll() {
        if (sections.length === 0) return;

        let currentSectionId = '';
        // Definisce una "linea di attivazione" sulla viewport, considerando l'altezza dell'header + un offset.
        // Una sezione è considerata attiva se la sua parte superiore è sopra questa linea
        // e la sua parte inferiore è sotto questa linea.
        const activationLine = window.scrollY + headerHeight + 50;

        // Verifica se siamo al fondo della pagina (o molto vicini)
        const scrollAtBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 15); // Aumentata leggermente la soglia a 15px

        // Se siamo al fondo della pagina, l'ultima sezione DEVE essere quella attiva.
        if (scrollAtBottom) {
            currentSectionId = '#' + sections[sections.length - 1].getAttribute('id');
        } else {
            // Altrimenti, itera sulle sezioni per trovare quella attiva "normalmente"
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;

                // La sezione è attiva se la linea di attivazione cade al suo interno
                if (sectionTop <= activationLine && sectionBottom > activationLine) {
                    currentSectionId = '#' + section.getAttribute('id');
                    break; // Trovata la sezione attiva, esci dal loop
                }
            }
        }

        // Se dopo i controlli sopra nessuna sezione è stata identificata come attiva
        // (es. siamo sopra la prima sezione o in uno spazio tra sezioni molto grandi)
        // e siamo in cima alla pagina, attiva il primo link se punta a #hero.
        if (!currentSectionId && sections.length > 0) {
            if (window.scrollY < (sections[0].offsetTop - headerHeight)) { // Se siamo sopra l'inizio della prima sezione
                if (headerNavLinks.length > 0 && headerNavLinks[0].getAttribute('href') === '#hero') {
                    currentSectionId = '#hero';
                }
            }
        }

        // Applica la classe attiva ai link dell'header
        headerNavLinks.forEach(link => {
            link.classList.remove('active-header-link');
            if (link.getAttribute('href') === currentSectionId) {
                link.classList.add('active-header-link');
            }
        });
    }

    if (sections.length > 0) {
        window.addEventListener('scroll', changeActiveHeaderLinkOnScroll);
        changeActiveHeaderLinkOnScroll(); // Esegui al caricamento per impostare lo stato iniziale
    }

    // Evidenzia il link attivo nel menu laterale (per pagine esterne)
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (sideMenu) {
        const sideLinks = sideMenu.querySelectorAll('nav a');
        sideLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref) {
                const linkPage = linkHref.split('/').pop().split('#')[0];
                if (linkPage === currentPage && currentPage !== 'index.html') {
                    link.classList.add('active-link');
                } else {
                    link.classList.remove('active-link');
                }
            }
        });
    }

    // Logica per il pulsante "Torna Su"
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
    }

});
