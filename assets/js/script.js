// ===============================
// MENU HAMBÚRGUER RESPONSIVO
// ===============================
const menuToggle = document.getElementById('menu-toggle');
const nav = document.querySelector('.main-nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('show');
    menuToggle.classList.toggle('active');
});

// Fecha o menu ao clicar em um link (mobile)
document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('show');
        menuToggle.classList.remove('active');
    });
});

// ===============================
// ANIMAÇÃO SUAVE AO ROLAR A PÁGINA
// ===============================
const elements = document.querySelectorAll('.section, .hero, .project-card');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

elements.forEach(el => observer.observe(el));

// ===============================
// EFEITO DE DIGITAÇÃO (opcional para o assistente virtual)
// ===============================
function typeEffect(element, speed) {
    const text = element.innerHTML;
    element.innerHTML = "";
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

// Ativa o efeito no chat da página de contato
const chatMessage = document.querySelector('.ai-chatbox .chat-message p');
if (chatMessage) {
    typeEffect(chatMessage, 30);
}