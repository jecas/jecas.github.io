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
    'Chatbot',
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
      '<span class="chat-step-error" id="chatEmailError" hidden></span>' +
      '<button type="button" class="chat-send" id="chatEmailNext">Dalje →</button>';

    const input = document.getElementById('chatEmail');
    const error = document.getElementById('chatEmailError');
    const next = document.getElementById('chatEmailNext');

    const submit = () => {
      const value = input.value.trim();
      if (!value || !value.includes('@') || !value.includes('.')) {
        error.textContent = 'Unesite ispravan email.';
        error.hidden = false;
        return;
      }
      inquiry.email = value;
      addMessage(value, true);
      renderMessageStep();
      botSay('Opišite ukratko šta vam je potrebno (ili samo pošaljite upit bez opisa).');
    };

    next.addEventListener('click', submit);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    input.focus();
  }

  function renderMessageStep() {
    stepEl.innerHTML =
      '<textarea id="chatMessage" rows="3" placeholder="Opciono..."></textarea>' +
      '<button type="button" class="chat-send" id="chatMessageSend">Pošaljite upit</button>';

    const input = document.getElementById('chatMessage');
    const send = document.getElementById('chatMessageSend');

    send.addEventListener('click', () => {
      const value = input.value.trim();
      inquiry.message = value;
      addMessage(value || '(bez dodatnog opisa)', true);
      sendInquiry();
    });
    input.focus();
  }

  function renderDoneStep() {
    stepEl.innerHTML = '<button type="button" class="chat-restart" id="chatRestart">Nov razgovor</button>';
    document.getElementById('chatRestart').addEventListener('click', () => {
      inquiry = { service: '', name: '', email: '', message: '' };
      messagesEl.innerHTML = '';
      startConversation();
    });
  }

  async function sendInquiry() {
    stepEl.innerHTML = '<span class="chat-step-error" style="color: var(--text-dim)">Šaljem upit…</span>';

    const formData = new FormData();
    formData.append('_subject', 'Novi upit sa Webnica chatbota');
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    formData.append('Usluga', inquiry.service);
    formData.append('Ime', inquiry.name);
    formData.append('Email', inquiry.email);
    formData.append('Poruka', inquiry.message || '(bez dodatnog opisa)');

    try {
      const res = await fetch('https://formsubmit.co/ajax/' + CONTACT_EMAIL, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      if (!res.ok) throw new Error('send failed');
      botSay('Hvala, ' + inquiry.name.split(' ')[0] + '! Javiću vam se uskoro na ' + inquiry.email + '.', 200);
      setTimeout(renderDoneStep, 500);
    } catch (err) {
      botSay('Nešto nije prošlo kako treba. Pišite mi direktno na ' + CONTACT_EMAIL + '.', 200);
      setTimeout(renderDoneStep, 500);
    }
  }

  function startConversation() {
    botSay('Zdravo! 👋 Ja sam Webnica bot. Koja usluga vas zanima?', 150);
    renderServiceStep();
  }

  toggle.addEventListener('click', () => {
    const isOpen = panel.hidden;
    panel.hidden = !isOpen;
    toggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen && !started) {
      started = true;
      startConversation();
    }
  });
})();
