const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navbar');
const menuLabel = menuToggle?.querySelector('.sr-only');

const closeMenu = () => {
    if (!menuToggle || !navigation || !menuLabel) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuLabel.textContent = 'Abrir menú';
    navigation.classList.remove('is-open');
};

if (menuToggle && navigation && menuLabel) {
    document.body.classList.add('has-js');

    menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!isOpen));
        menuLabel.textContent = isOpen ? 'Abrir menú' : 'Cerrar menú';
        navigation.classList.toggle('is-open', !isOpen);
    });

    navigation.addEventListener('click', (event) => {
        if (event.target instanceof Element && event.target.closest('a')) {
            closeMenu();
        }
    });

    window.matchMedia('(min-width: 721px)').addEventListener('change', closeMenu);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
});

const revealItems = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
}