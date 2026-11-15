const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const installButton = document.getElementById('installButton');
const installHelp = document.getElementById('installHelp');
let installPrompt;

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.addEventListener('click', event => {
        if (event.target.closest('a')) {
            navLinks.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

function showInstallHelp(message) {
    if (!installHelp) return;
    installHelp.textContent = message;
    installHelp.hidden = false;
    window.setTimeout(() => {
        installHelp.hidden = true;
    }, 7000);
}

window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
});

window.addEventListener('appinstalled', () => {
    installPrompt = null;
    if (installButton) installButton.hidden = true;
});

if (installButton) {
    installButton.addEventListener('click', async () => {
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
            showInstallHelp('Viharan is already installed on this device.');
            return;
        }

        if (!installPrompt) {
            const isAppleMobile = /iPhone|iPad|iPod/.test(window.navigator.userAgent);
            showInstallHelp(isAppleMobile
                ? 'To install Viharan, tap Share in Safari, then choose “Add to Home Screen”.'
                : 'To install Viharan, open your browser menu and choose “Install app” or “Add to Home screen”.');
            return;
        }

        await installPrompt.prompt();
        await installPrompt.userChoice;
        installPrompt = null;
    });
}

if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').catch(error => {
            console.error('Viharan offline support could not be enabled:', error);
        });
    });
}
