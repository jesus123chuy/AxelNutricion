import './fonts.css';
import './style.css';
import { siteConfig } from './data/siteConfig.js';

const whatsappNumber = siteConfig.whatsappNumber.replace(/\D/g, '');

function applyContactDetails() {
  document.querySelectorAll('[data-contact="professional-name"]').forEach((element) => {
    element.textContent = siteConfig.professionalName || 'Nombre del profesional por confirmar';
  });
  document.querySelectorAll('[data-contact="email"]').forEach((element) => {
    if (siteConfig.email) {
      const link = document.createElement('a');
      link.href = `mailto:${siteConfig.email}`;
      link.textContent = siteConfig.email;
      element.replaceChildren(link);
    }
  });
  document.querySelectorAll('[data-contact="phone"]').forEach((element) => {
    element.href = `tel:+${whatsappNumber}`;
    element.setAttribute('aria-label', `Llamar al ${siteConfig.phoneDisplay}`);
  });
  document.querySelectorAll('[data-contact="phone-label"]').forEach((element) => {
    element.textContent = siteConfig.phoneDisplay;
  });
  document.querySelectorAll('[data-contact="instagram"]').forEach((element) => {
    element.href = siteConfig.instagramUrl;
    element.target = '_blank';
    element.rel = 'noopener noreferrer';
    element.setAttribute('aria-label', 'Instagram de Danthe Axel (abre en una pestaña nueva)');
  });
}

function setWhatsAppDestination(anchor, message = 'Hola, quiero información sobre las consultas de nutrición deportiva.') {
  if (whatsappNumber) {
    anchor.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    anchor.target = '_blank';
    anchor.rel = 'noreferrer';
    anchor.setAttribute('aria-label', `${anchor.getAttribute('aria-label') || anchor.textContent.trim()} (abre WhatsApp en una pestaña nueva)`);
  } else {
    anchor.href = '#contacto';
    anchor.removeAttribute('target');
    anchor.removeAttribute('rel');
  }
}

function setupWhatsApp() {
  const status = document.querySelector('#contact-status');
  const liveRegion = document.querySelector('#whatsapp-live');
  document.querySelectorAll('[data-whatsapp]').forEach((anchor) => {
    setWhatsAppDestination(anchor, anchor.dataset.whatsappMessage);
    if (!whatsappNumber) {
      anchor.addEventListener('click', () => {
        if (status) status.textContent = 'WhatsApp estará disponible cuando se configure el número de contacto. Por ahora, puedes completar la solicitud y guardar el mensaje para enviarlo después.';
        if (liveRegion) liveRegion.textContent = 'El número de WhatsApp todavía no está configurado. El formulario permanece disponible.';
      });
    }
  });

  const form = document.querySelector('#contact-form');
  const textFields = [
    [form.elements.namedItem('name'), 'Escribe tu nombre.'],
    [form.elements.namedItem('message'), 'Cuéntame brevemente qué objetivo te gustaría trabajar.'],
  ];
  textFields.forEach(([field]) => field.addEventListener('input', () => field.setCustomValidity('')));
  let lastSubmit = 0;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // A double click or double tap must not open two WhatsApp chats.
    if (Date.now() - lastSubmit < 2000) return;
    textFields.forEach(([field, message]) => {
      field.value = field.value.trim();
      field.setCustomValidity(field.value ? '' : message);
    });
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const message = [
      'Hola, quiero solicitar información sobre una consulta de nutrición deportiva.',
      `Nombre: ${values.get('name')}`,
      `Modalidad de interés: ${values.get('mode')}`,
      `Objetivo: ${values.get('message')}`,
    ].join('\n');

    if (!whatsappNumber) {
      status.textContent = `El número de WhatsApp aún no está configurado. Tu mensaje está listo para enviar cuando se agregue.\n\n${message}`;
      liveRegion.textContent = 'El número de WhatsApp aún no está configurado. Tu solicitud no se envió.';
      return;
    }

    lastSubmit = Date.now();
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    const retryLink = document.createElement('a');
    retryLink.href = whatsappUrl;
    retryLink.target = '_blank';
    retryLink.rel = 'noopener noreferrer';
    retryLink.textContent = 'Abrir WhatsApp';
    status.replaceChildren('Tu mensaje está listo. Revisa el texto y envíalo desde WhatsApp. Si no se abrió la ventana, usa este enlace: ', retryLink);
    liveRegion.textContent = 'Tu solicitud está lista para enviar por WhatsApp.';
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });
}

function setupNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  const setOpen = (isOpen) => {
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    nav.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) setOpen(false);
  });
}

function setupFaq() {
  const triggers = [...document.querySelectorAll('.faq-trigger')];
  const setExpanded = (trigger, isExpanded) => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    trigger.setAttribute('aria-expanded', String(isExpanded));
    panel.setAttribute('aria-hidden', String(!isExpanded));
    panel.inert = !isExpanded;
    panel.style.maxHeight = isExpanded ? `${panel.scrollHeight}px` : '0px';
  };

  triggers.forEach((trigger, index) => {
    setExpanded(trigger, trigger.getAttribute('aria-expanded') === 'true');
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      triggers.forEach((item) => setExpanded(item, false));
      if (!isOpen) setExpanded(trigger, true);
    });
    trigger.addEventListener('keydown', (event) => {
      const targets = { ArrowDown: (index + 1) % triggers.length, ArrowUp: (index - 1 + triggers.length) % triggers.length, Home: 0, End: triggers.length - 1 };
      if (!(event.key in targets)) return;
      event.preventDefault();
      triggers[targets[event.key]].focus();
    });
  });

  const refreshOpenPanels = () => {
    triggers.forEach((trigger) => {
      if (trigger.getAttribute('aria-expanded') === 'true') setExpanded(trigger, true);
    });
  };
  window.addEventListener('resize', refreshOpenPanels);
  document.fonts?.ready.then(refreshOpenPanels);
}

function setupCasesPassage() {
  const passage = document.querySelector('[data-cases-marquee]');
  if (!passage) return;
  const runway = passage.querySelector('.cases-runway');
  const group = runway.querySelector('.cases-grid');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const duplicate = group.cloneNode(true);
  duplicate.setAttribute('aria-hidden', 'true');
  duplicate.inert = true;
  runway.append(duplicate);

  const toggle = document.querySelector('[data-cases-pause]');
  const toggleLabel = toggle?.querySelector('span');
  const setPaused = (isPaused) => {
    passage.classList.toggle('is-paused', isPaused);
    if (!toggle) return;
    toggle.setAttribute('aria-pressed', String(isPaused));
    toggleLabel.textContent = isPaused ? 'Reanudar casos' : 'Pausar casos';
  };
  toggle?.addEventListener('click', () => setPaused(!passage.classList.contains('is-paused')));

  const syncMotion = () => {
    passage.classList.toggle('is-moving', !preference.matches);
    duplicate.hidden = preference.matches;
    if (toggle) toggle.hidden = preference.matches;
  };
  preference.addEventListener('change', syncMotion);
  syncMotion();
}

function setupFooter() {
  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
}

applyContactDetails();
setupWhatsApp();
setupNavigation();
setupFaq();
setupCasesPassage();
setupFooter();
