document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* Chat widget */

(function () {
  const CONTACT_EMAIL = 'jelena_s7@yahoo.com';
  const SERVICES = [
    'Statički web sajt',
    'Dinamički web sajt',
    'eCommerce prodavnica',
    'SaaS aplikacija',
    'SEO optimizacija',
    'Hosting',
    'Desktop aplikacija',
    'Nešto drugo',
  ];

  const toggle = document.getElementById('chatToggle');
  const panel = document.getElementById('chatPanel');
  const messagesEl = document.getElementById('chatMessages');
  const stepEl = document.getElementById('chatStep');

  let started = false;
  let inquiry = { service: '', name: '', email: '', message: '' };

  function addMessage(text, isUser) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + (isUser ? 'chat-msg-user' : 'chat-msg-bot');
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function botSay(text, delay) {
    setTimeout(() => addMessage(text, false), delay || 250);
  }

  function renderServiceStep() {
    stepEl.innerHTML = '';
    SERVICES.forEach((service) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chat-option';
      btn.textContent = service;
      btn.addEventListener('click', () => {
        inquiry.service = service;
        addMessage(service, true);
        renderNameStep();
        botSay('Kako se zovete?');
      });
      stepEl.appendChild(btn);
    });
  }

  function renderNameStep() {
    stepEl.innerHTML =
      '<input type="text" id="chatName" placeholder="Vaše ime i prezime">' +
      '<span class="chat-step-error" id="chatNameError" hidden></span>' +
      '<button type="button" class="chat-send" id="chatNameNext">Dalje →</button>';

    const input = document.getElementById('chatName');
    const error = document.getElementById('chatNameError');
    const next = document.getElementById('chatNameNext');

    const submit = () => {
      const value = input.value.trim();
      if (!value) {
        error.textContent = 'Unesite ime.';
        error.hidden = false;
        return;
      }
      inquiry.name = value;
      addMessage(value, true);
      renderEmailStep();
      botSay('Na koji email da vam odgovorim?');
    };

    next.addEventListener('click', submit);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    input.focus();
  }

  function renderEmailStep() {
    stepEl.innerHTML =
      '<input type="email" id="chatEmail" placeholder="vas@email.com">' +