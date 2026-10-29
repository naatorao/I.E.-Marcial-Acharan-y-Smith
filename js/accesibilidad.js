(() => {
    const storageKey = 'marcial-accessibility-config';
    const defaults = {
        fontScale: 1,
        highContrast: false,
        reducedMotion: false,
        underlinedLinks: true,
        readableSpacing: false
    };
    const state = { ...defaults };
    const main = document.querySelector('main');

    if (main) {
        if (!main.id) main.id = 'main-content';
        if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');

        if (!document.querySelector('.a11y-skip-link, .skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.className = 'a11y-skip-link';
            skipLink.href = `#${main.id}`;
            skipLink.textContent = 'Saltar al contenido principal';
            document.body.prepend(skipLink);
        }
    }

    const toolbar = document.createElement('aside');
    toolbar.className = 'a11y-toolbar';
    toolbar.setAttribute('aria-label', 'Herramientas de accesibilidad');

    const toggle = document.createElement('button');
    toggle.className = 'a11y-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'a11y-panel');

    const icon = document.createElement('span');
    icon.className = 'a11y-toggle-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '♿';

    const toggleText = document.createElement('span');
    toggleText.textContent = 'Accesibilidad';
    toggle.append(icon, toggleText);

    const panel = document.createElement('section');
    panel.className = 'a11y-panel';
    panel.id = 'a11y-panel';
    panel.setAttribute('aria-labelledby', 'a11y-panel-title');
    panel.hidden = true;

    const heading = document.createElement('h2');
    heading.id = 'a11y-panel-title';
    heading.textContent = 'Opciones de accesibilidad';

    const actions = document.createElement('div');
    actions.className = 'a11y-actions';

    const status = document.createElement('span');
    status.className = 'a11y-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    const createAction = (action, label, pressed) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.accessibilityAction = action;
        button.textContent = label;
        if (pressed !== undefined) button.setAttribute('aria-pressed', String(pressed));
        actions.append(button);
        return button;
    };

    createAction('increase-font', 'Aumentar texto');
    createAction('decrease-font', 'Disminuir texto');
    createAction('toggle-contrast', 'Alto contraste', false);
    createAction('toggle-motion', 'Reducir movimiento', false);
    createAction('toggle-links', 'Enlaces subrayados', true);
    createAction('toggle-spacing', 'Espaciado de lectura amplio', false);
    createAction('reset', 'Restablecer opciones');

    panel.append(heading, actions, status);
    toolbar.append(toggle, panel);
    document.body.append(toolbar);

    const controls = [...actions.querySelectorAll('button[aria-pressed]')];
    const clampFontScale = (value) => Math.min(1.5, Math.max(1, value));

    const loadState = () => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (!stored) return;

            const parsed = JSON.parse(stored);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
                throw new TypeError('El valor debe ser un objeto.');
            }

            state.fontScale = clampFontScale(
                typeof parsed.fontScale === 'number' && Number.isFinite(parsed.fontScale)
                    ? parsed.fontScale
                    : defaults.fontScale
            );
            for (const key of ['highContrast', 'reducedMotion', 'underlinedLinks', 'readableSpacing']) {
                state[key] = typeof parsed[key] === 'boolean' ? parsed[key] : defaults[key];
            }
        } catch (error) {
            console.warn('No se pudo leer la configuración de accesibilidad guardada.', error);
        }
    };

    const saveState = () => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(state));
        } catch (error) {
            console.warn('No se pudo guardar la configuración de accesibilidad.', error);
        }
    };

    const applyState = () => {
        document.documentElement.style.setProperty('--a11y-page-scale', String(state.fontScale));
        document.body.classList.toggle('a11y-large-text', state.fontScale > 1);
        document.body.classList.toggle('a11y-high-contrast', state.highContrast);
        document.body.classList.toggle('a11y-reduced-motion', state.reducedMotion);
        document.body.classList.toggle('a11y-underlined-links', state.underlinedLinks);
        document.body.classList.toggle('a11y-readable-spacing', state.readableSpacing);

        for (const control of controls) {
            switch (control.dataset.accessibilityAction) {
                case 'toggle-contrast':
                    control.setAttribute('aria-pressed', String(state.highContrast));
                    break;
                case 'toggle-motion':
                    control.setAttribute('aria-pressed', String(state.reducedMotion));
                    break;
                case 'toggle-links':
                    control.setAttribute('aria-pressed', String(state.underlinedLinks));
                    break;
                case 'toggle-spacing':
                    control.setAttribute('aria-pressed', String(state.readableSpacing));
                    break;
            }
        }

        status.textContent = `Tamaño del texto: ${Math.round(state.fontScale * 100)} por ciento.`;
    };

    const updateState = (changes) => {
        Object.assign(state, changes);
        applyState();
        saveState();
    };

    toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        panel.hidden = isOpen;
        if (!isOpen) actions.querySelector('button').focus();
    });

    actions.addEventListener('click', (event) => {
        if (!(event.target instanceof Element)) return;
        const button = event.target.closest('button[data-accessibility-action]');
        if (!button) return;

        switch (button.dataset.accessibilityAction) {
            case 'increase-font':
                updateState({ fontScale: clampFontScale(Number((state.fontScale + 0.1).toFixed(1))) });
                break;
            case 'decrease-font':
                updateState({ fontScale: clampFontScale(Number((state.fontScale - 0.1).toFixed(1))) });
                break;
            case 'toggle-contrast':
                updateState({ highContrast: !state.highContrast });
                break;
            case 'toggle-motion':
                updateState({ reducedMotion: !state.reducedMotion });
                break;
            case 'toggle-links':
                updateState({ underlinedLinks: !state.underlinedLinks });
                break;
            case 'toggle-spacing':
                updateState({ readableSpacing: !state.readableSpacing });
                break;
            case 'reset':
                Object.assign(state, defaults);
                applyState();
                saveState();
                break;
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !panel.hidden) {
            panel.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
        }
    });

    loadState();
    applyState();
})();
