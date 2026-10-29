const pageLinks = [
    ['Inicio', 'inicio.html'],
    ['Nosotros', 'nosotros.html'],
    ['Servicios', 'servicios.html'],
    ['Noticias', 'blog.html'],
    ['Galería', 'galeria.html'],
    ['Contacto', 'contacto.html']
];

const pageTitle = document.title.split('|')[0].trim();
const currentFile = decodeURIComponent(window.location.pathname.split('/').pop() || '');
const pageSlug = currentFile.toLocaleLowerCase('es');
const header = document.querySelector('header');
const navigation = document.querySelector('nav');
const main = document.querySelector('main');
const footer = document.querySelector('footer');

document.documentElement.lang = 'es';
document.body.classList.add('portal-page');

const themeColor = document.querySelector('meta[name="theme-color"]') || document.createElement('meta');
themeColor.name = 'theme-color';
themeColor.content = '#400409';
if (!themeColor.parentElement) document.head.append(themeColor);

if (header) {
    header.classList.add('portal-header');
    const heading = header.querySelector('h1');
    if (heading) {
        heading.textContent = pageTitle;
    } else {
        const title = document.createElement('h1');
        title.textContent = pageTitle;
        header.append(title);
    }

    const kicker = document.createElement('p');
    kicker.className = 'portal-kicker';
    kicker.textContent = 'I.E. Marcial Acharán y Smith';
    header.prepend(kicker);

    const tagline = document.createElement('p');
    tagline.className = 'portal-tagline';
    tagline.textContent = 'Disciplina · Conocimiento · Futuro';
    header.append(tagline);
}

if (navigation) {
    navigation.classList.add('portal-nav');
    navigation.setAttribute('aria-label', 'Navegación principal');
    navigation.replaceChildren();

    const brand = document.createElement('a');
    brand.className = 'portal-nav-brand';
    brand.href = './inicio.html';
    brand.setAttribute('aria-label', 'I.E. Marcial Acharán y Smith, inicio');

    const logo = document.createElement('img');
    logo.src = '../media/images/insignea.png';
    logo.alt = 'Insignia de la institución';
    brand.append(logo);
    navigation.append(brand);

    const list = document.createElement('ul');
    list.className = 'portal-nav-links';
    pageLinks.forEach(([label, file]) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `./${file}`;
        link.textContent = label;
        if (pageSlug === file.toLocaleLowerCase('es')) {
            link.setAttribute('aria-current', 'page');
        }
        item.append(link);
        list.append(item);
    });
    navigation.append(list);
}

const addEmptyState = (title, message) => {
    const section = document.createElement('section');
    section.className = 'portal-empty-state';

    const heading = document.createElement('h2');
    heading.textContent = title;
    section.append(heading);

    const description = document.createElement('p');
    description.textContent = message;
    section.append(description);

    const actions = document.createElement('div');
    actions.className = 'portal-actions';
    const servicesLink = document.createElement('a');
    servicesLink.className = 'portal-button';
    servicesLink.href = './servicios.html';
    servicesLink.textContent = 'Ver servicios';
    actions.append(servicesLink);
    const contactLink = document.createElement('a');
    contactLink.className = 'portal-button portal-button-secondary';
    contactLink.href = './contacto.html';
    contactLink.textContent = 'Contactar con el colegio';
    actions.append(contactLink);
    section.append(actions);
    main.append(section);
};

if (main && !main.children.length) {
    if (pageSlug === 'contacto.html') {
        const heading = document.createElement('h2');
        heading.className = 'portal-section-title';
        heading.textContent = 'Estamos para atenderte';
        main.append(heading);

        const grid = document.createElement('section');
        grid.className = 'portal-contact-grid';

        const addContactCard = (title, content) => {
            const card = document.createElement('article');
            card.className = 'portal-contact-card';
            const cardHeading = document.createElement('h2');
            cardHeading.textContent = title;
            card.append(cardHeading);
            card.append(content);
            grid.append(card);
        };

        const address = document.createElement('address');
        address.textContent = 'Jr. Colón Nº 467, Trujillo, Perú';
        addContactCard('Dirección', address);

        const phone = document.createElement('p');
        const phoneLink = document.createElement('a');
        phoneLink.href = 'tel:+51978838793';
        phoneLink.textContent = '(+51) 978 838 793';
        phone.append(phoneLink);
        addContactCard('Teléfono', phone);

        const email = document.createElement('p');
        const emailLink = document.createElement('a');
        emailLink.href = 'mailto:acharanysmith@gmail.com';
        emailLink.textContent = 'acharanysmith@gmail.com';
        email.append(emailLink);
        addContactCard('Correo electrónico', email);

        const hours = document.createElement('p');
        hours.textContent = 'Lunes a viernes: 8:00 a.m. a 1:00 p.m. y 2:00 p.m. a 4:45 p.m.';
        addContactCard('Horario de atención', hours);
        main.append(grid);
    } else if (pageSlug === 'galeria.html') {
        const heading = document.createElement('h2');
        heading.className = 'portal-section-title';
        heading.textContent = 'La vida en nuestra institución';
        main.append(heading);

        const gallery = document.createElement('section');
        gallery.className = 'portal-gallery-grid';
        const images = [
            ['../media/images/I.E.%20Centenaria.jpg', 'Comunidad educativa en una actividad cívica'],
            ['../media/images/DICTTIVA.jpg', 'Estudiantes reunidos en el patio escolar'],
            ['../media/images/estudiantes-aula.jpg', 'Estudiantes participando en clase']
        ];

        images.forEach(([src, caption]) => {
            const figure = document.createElement('figure');
            const image = document.createElement('img');
            image.src = src;
            image.alt = caption;
            image.loading = 'lazy';
            const description = document.createElement('figcaption');
            description.textContent = caption;
            figure.append(image, description);
            gallery.append(figure);
        });
        main.append(gallery);
    } else if (pageSlug === 'blog.html') {
        addEmptyState(
            'Noticias de la institución',
            'Las novedades y comunicados oficiales se publicarán aquí. Para consultas, comunícate directamente con la institución.'
        );
    } else {
        addEmptyState(
            `Información de ${pageTitle}`,
            'Esta sección está preparada para compartir información oficial. Para conocer los detalles disponibles, consulta con la institución.'
        );
    }
}

if (main) {
    main.querySelectorAll('section').forEach((section) => {
        const articles = section.querySelectorAll('article');
        if (!articles.length) return;
        section.classList.add('portal-grid');

        articles.forEach((article) => {
            article.querySelectorAll('img').forEach((image) => {
                if (!image.getAttribute('src')) image.remove();
            });
            if (pageSlug === 'servicios.html' && !article.querySelector('p')) {
                const serviceLink = article.querySelector('a');
                const description = document.createElement('p');
                description.textContent = serviceLink
                    ? `Consulta la sección de ${serviceLink.textContent.trim()} y comunícate con el colegio para conocer los detalles vigentes.`
                    : 'Consulta con la institución para conocer los detalles vigentes.';
                article.append(description);
            }
        });
    });
}

if (footer) {
    footer.classList.add('portal-footer');
    if (!footer.children.length) {
        const message = document.createElement('p');
        message.className = 'portal-footer-message';
        message.textContent = 'Marcial Acharán y Smith trabaja por el desarrollo de los jóvenes.';
        footer.append(message);

        const address = document.createElement('address');
        address.append('Jr. Colón Nº 467, Trujillo · ');
        const phone = document.createElement('a');
        phone.href = 'tel:+51978838793';
        phone.textContent = '(+51) 978 838 793';
        address.append(phone, document.createElement('br'));
        const email = document.createElement('a');
        email.href = 'mailto:acharanysmith@gmail.com';
        email.textContent = 'acharanysmith@gmail.com';
        address.append(email);
        footer.append(address);

        const copyright = document.createElement('p');
        copyright.className = 'portal-copyright';
        copyright.textContent = `© 2026 I.E. Marcial Acharán y Smith. Todos los derechos reservados.`;
        footer.append(copyright);
    } else {
        const message = footer.querySelector('section p');
        if (message) message.classList.add('portal-footer-message');
        const copyright = footer.querySelector('p:last-child small');
        if (copyright) copyright.parentElement.classList.add('portal-copyright');
    }
}