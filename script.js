const header = document.querySelector('.site-header');
const navLinks = [...document.querySelectorAll('.nav-links a')];
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
const toast = document.querySelector('.toast');

window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 24), { passive: true });
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
navLinks.forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(el);
});

const sections = [...document.querySelectorAll('main section[id]')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-30% 0px -58% 0px' });
sections.forEach(section => sectionObserver.observe(section));

const typeTarget = document.querySelector('.typing');
if (typeTarget) {
  const phrase = typeTarget.dataset.text;
  let typeIndex = 0;
  function typeText() {
    if (typeIndex <= phrase.length) {
      typeTarget.textContent = phrase.slice(0, typeIndex++);
      setTimeout(typeText, 55);
    }
  }
  setTimeout(typeText, 700);
}

const metricObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-count]').forEach(counter => {
      const end = Number(counter.dataset.count);
      const start = performance.now();
      const tick = now => {
        const progress = Math.min((now - start) / 1100, 1);
        counter.textContent = Math.round(end * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    metricObserver.unobserve(entry.target);
  });
}, { threshold: .45 });
const metrics = document.querySelector('.metrics');
if (metrics) metricObserver.observe(metrics);

document.querySelectorAll('.career-summary').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.career-card');
    const open = card.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
    button.querySelector('.career-toggle').textContent = open ? '收起' : '展开';
  });
});

document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category.split(' ').includes(filter);
      card.classList.toggle('hidden', !show);
    });
  });
});

document.querySelectorAll('[data-modal]').forEach(button => {
  button.addEventListener('click', () => document.getElementById(button.dataset.modal).showModal());
});
document.querySelectorAll('.project-dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
});

document.querySelectorAll('.copy-email').forEach(button => {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.email);
    } catch {
      const input = document.createElement('input');
      input.value = button.dataset.email;
      document.body.append(input);
      input.select();
      document.execCommand('copy');
      input.remove();
    }
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  });
});

if (matchMedia('(pointer:fine)').matches) {
  const glow = document.querySelector('.cursor-glow');
  window.addEventListener('pointermove', event => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}
