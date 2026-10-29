const serviceDetails = {
    certificados: {
        category: 'Trámites',
        title: 'Certificados de Estudio',
        description: 'Accede al trámite digital o presencial para solicitar certificados oficiales de estudios de nivel secundario aprobados por la UGEL.',
        requirements: ['Copia de DNI', 'Pago de tasa de trámite', 'Ficha de solicitud debidamente llenada'],
        action: 'Solicitar Certificado',
        href: './certificado.html'
    },
    matricula: {
        category: 'Trámites',
        title: 'Proceso de Matrícula',
        description: 'Consulta los requisitos y el cronograma del proceso de matrícula escolar para el período lectivo actual.',
        requirements: ['DNI del estudiante y apoderado', 'Ficha de vacante', 'Certificado de estudios previos'],
        action: 'Ver Cronograma',
        href: './matr%C3%ACcula.html'
    },
    horarios: {
        category: 'Académico',
        title: 'Horarios Escolares',
        description: 'Consulta el cronograma de clases por grado y sección, así como los horarios de atención para apoderados.',
        requirements: ['Número de sección y grado del estudiante'],
        action: 'Consultar Horarios',
        href: './horarios.html'
    },
    materiales: {
        category: 'Académico',
        title: 'Material Educativo',
        description: 'Consulta los recursos pedagógicos, carpetas de recuperación y textos digitales asignados a cada nivel escolar.',
        requirements: ['Acceso al correo institucional del alumno'],
        action: 'Acceder al Material',
        href: './material.html'
    },
    convivencia: {
        category: 'Bienestar',
        title: 'Convivencia Escolar',
        description: 'Un espacio para velar por el bienestar integral, la buena convivencia escolar y la orientación de estudiantes y familias.',
        requirements: ['Solicita orientación directamente en la oficina de psicología o tutoría.'],
        action: 'Contactar al Colegio',
        href: './contacto.html'
    },
    comites: {
        category: 'Institucional',
        title: 'Comités y Reglamento',
        description: 'Consulta información institucional, los acuerdos de convivencia y las normas que orientan nuestra comunidad educativa.',
        requirements: ['La información está disponible para estudiantes, familias y personal de la institución.'],
        action: 'Ver Comités y Reglamento',
        href: './comit%C3%A8s.html'
    },
    talleres: {
        category: 'Bienestar',
        title: 'Talleres Extracurriculares',
        description: 'Conoce las actividades complementarias que fortalecen las habilidades artísticas, deportivas y científicas de los alumnos.',
        requirements: ['Ficha de inscripción del taller', 'Autorización firmada del apoderado'],
        action: 'Consultar Talleres',
        href: './talleres.html'
    },
    directorio: {
        category: 'Institucional',
        title: 'Directorio y Galería',
        description: 'Encuentra los canales de contacto del colegio y descubre momentos de nuestra comunidad educativa.',
        requirements: ['Directorio institucional', 'Galería de actividades escolares'],
        action: 'Explorar Directorio',
        href: './directorio.html',
        secondaryAction: 'Ver Galería',
        secondaryHref: './galeria.html'
    }
};

const cards = [...document.querySelectorAll('.service-card')];
const searchInput = document.querySelector('#service-search');
const filterButtons = [...document.querySelectorAll('.filter-pill')];
const resultCount = document.querySelector('#result-count');
const emptyState = document.querySelector('#empty-state');
const dialog = document.querySelector('#service-dialog');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navbar');
let selectedCategory = 'Todos';
let lastFocusedElement;

const normalize = (value) => value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim();

function updateResults() {
    const query = normalize(searchInput.value);
    let visibleCount = 0;

    cards.forEach((card) => {
        const matchesCategory = selectedCategory === 'Todos' || card.dataset.category === selectedCategory;
        const searchableText = normalize(`${card.dataset.search} ${card.querySelector('h3').textContent} ${card.querySelector('.category-tag').textContent}`);
        const matchesQuery = !query || searchableText.includes(query);
        const isVisible = matchesCategory && matchesQuery;
        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
    });

    resultCount.textContent = String(visibleCount);
    emptyState.hidden = visibleCount > 0;
}

function showService(serviceId, trigger) {
    const service = serviceDetails[serviceId];
    if (!service) return;

    lastFocusedElement = trigger;
    document.querySelector('#dialog-category').textContent = service.category;
    document.querySelector('#dialog-title').textContent = service.title;
    document.querySelector('#dialog-description').textContent = service.description;

    const requirementList = document.querySelector('#dialog-requirements');
    requirementList.replaceChildren(...service.requirements.map((requirement) => {
        const item = document.createElement('li');
        item.textContent = requirement;
        return item;
    }));

    const action = document.querySelector('#dialog-action');
    action.href = service.href;
    action.textContent = `${service.action} →`;
    action.setAttribute('aria-label', service.action);

    const previousSecondaryAction = dialog.querySelector('.dialog-secondary-action');
    if (previousSecondaryAction) previousSecondaryAction.remove();
    if (service.secondaryAction && service.secondaryHref) {
        const secondaryAction = document.createElement('a');
        secondaryAction.className = 'dialog-action dialog-secondary-action';
        secondaryAction.href = service.secondaryHref;
        secondaryAction.textContent = `${service.secondaryAction} →`;
        dialog.append(secondaryAction);
    }

    dialog.showModal();
    document.querySelector('.dialog-close').focus();
}

searchInput.addEventListener('input', updateResults);

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        selectedCategory = button.dataset.category;
        filterButtons.forEach((filter) => {
            const isActive = filter === button;
            filter.classList.toggle('is-active', isActive);
            filter.setAttribute('aria-pressed', String(isActive));
        });
        updateResults();
    });
});

cards.forEach((card) => {
    const action = card.querySelector('.card-action');
    action.setAttribute('aria-label', `Ver información sobre ${serviceDetails[action.dataset.service].title}`);
    action.addEventListener('click', (event) => {
        showService(event.currentTarget.dataset.service, event.currentTarget);
    });
});

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
    if (lastFocusedElement) lastFocusedElement.focus();
});

document.querySelector('#clear-filters').addEventListener('click', () => {
    searchInput.value = '';
    selectedCategory = 'Todos';
    filterButtons.forEach((button) => {
        const isActive = button.dataset.category === selectedCategory;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
    updateResults();
    searchInput.focus();
});

menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    menuToggle.setAttribute('aria-label', isExpanded ? 'Abrir menú' : 'Cerrar menú');
    navigation.classList.toggle('is-open', !isExpanded);
});

navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
        navigation.classList.remove('is-open');
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) && !dialog.open) {
        event.preventDefault();
        searchInput.focus();
    }
});
