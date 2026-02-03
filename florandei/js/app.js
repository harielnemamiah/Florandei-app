// app.js - Arquivo Principal do Florandei

class FlorandeiApp {
    constructor() {
        this.initialized = false;
    }

    async init() {
        try {
            console.log('Inicializando Florandei...');
            
            // Inicializar mapa
            await mapa.init();
            console.log('✓ Mapa inicializado');
            
            // Inicializar UI
            ui.init();
            console.log('✓ UI inicializada');
            
            // Ocultar tela de loading
            this.hideLoadingScreen();
            
            this.initialized = true;
            console.log('✓ Florandei pronto!');
            
            // Verificar se é primeira vez
            const firstTime = await registrosDB.getSetting('firstTime', true);
            if (firstTime) {
                this.showWelcome();
                await registrosDB.saveSetting('firstTime', false);
            }
            
        } catch (error) {
            console.error('Erro ao inicializar app:', error);
            this.showError('Erro ao carregar o aplicativo. Tente recarregar a página.');
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            app.style.display = 'flex';
        }, 300);
    }

    showWelcome() {
        ui.showMessage('Bem-vindo ao Florandei! 🌿', 'success');
        setTimeout(() => {
            ui.showMessage('Clique no + para adicionar seu primeiro registro', 'info');
        }, 2000);
    }

    showError(message) {
        const loadingScreen = document.getElementById('loading-screen');
        const content = loadingScreen.querySelector('.loading-content');
        content.innerHTML = `
            <h2 style="color:#ff5252">⚠️ Erro</h2>
            <p>${message}</p>
            <button onclick="location.reload()" style="margin-top:20px;padding:12px 24px;background:white;border:none;border-radius:8px;cursor:pointer">
                Recarregar
            </button>
        `;
    }
}

// Inicializar app quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const app = new FlorandeiApp();
    app.init();
});

// Prevenir zoom acidental no mobile
document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});

// Prevenir pull-to-refresh no Chrome mobile
let scrollY = 0;
document.addEventListener('touchstart', function(e) {
    scrollY = window.scrollY;
});

document.addEventListener('touchmove', function(e) {
    if (window.scrollY === 0 && scrollY === 0) {
        e.preventDefault();
    }
}, { passive: false });
