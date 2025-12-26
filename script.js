// Estado do jogo
let currentPhase = 0;

// Contexto de áudio
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Função para criar sons usando Web Audio API
function playSound(type) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'click':
            // Som de clique alegre
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
            
        case 'phase':
            // Som de transição de fase (mais musical)
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
            
        case 'victory':
            // Som de vitória (melodia ascendente)
            const notes = [523.25, 587.33, 659.25, 783.99, 880.00]; // C5, D5, E5, G5, A5
            notes.forEach((freq, index) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                
                osc.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1);
                gain.gain.setValueAtTime(0.2, audioContext.currentTime + index * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.3);
                
                osc.start(audioContext.currentTime + index * 0.1);
                osc.stop(audioContext.currentTime + index * 0.1 + 0.3);
            });
            break;
            
        case 'start':
            // Som de início (nota alegre e ascendente)
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
    }
}

// Função para esconder todas as telas
function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
}

// Função para mostrar uma tela específica
function showScreen(screenId) {
    hideAllScreens();
    const screen = document.getElementById(screenId);
    if (screen) {
        setTimeout(() => {
            screen.classList.add('active');
        }, 100);
    }
}

// Função para iniciar o jogo
function startGame() {
    playSound('start');
    currentPhase = 1;
    showScreen('phase1-screen');
}

// Função para avançar para a próxima fase
function nextPhase(phase) {
    playSound('phase');
    currentPhase = phase;
    
    if (phase === 4) {
        // Tela de vitória
        setTimeout(() => {
            showScreen('phase4-screen');
            playSound('victory');
            createConfetti();
        }, 300);
    } else {
        showScreen(`phase${phase}-screen`);
    }
}

// Função para reiniciar o jogo
function restartGame() {
    playSound('click');
    currentPhase = 0;
    showScreen('start-screen');
}

// Função para criar confetes na tela de vitória
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.opacity = '0.8';
            
            document.body.appendChild(confetti);
            
            const duration = 2000 + Math.random() * 1000;
            const rotation = Math.random() * 360;
            const xMovement = (Math.random() - 0.5) * 200;
            
            confetti.animate([
                { 
                    transform: 'translateY(0) translateX(0) rotate(0deg)',
                    opacity: 0.8
                },
                { 
                    transform: `translateY(${window.innerHeight + 20}px) translateX(${xMovement}px) rotate(${rotation}deg)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            setTimeout(() => {
                confetti.remove();
            }, duration);
        }, i * 30);
    }
}

// Adicionar eventos de teclado para navegação
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        if (currentPhase === 0) {
            startGame();
        } else if (currentPhase > 0 && currentPhase < 4) {
            nextPhase(currentPhase + 1);
        } else if (currentPhase === 4) {
            restartGame();
        }
    }
});

// Inicializar o jogo quando a página carregar
window.addEventListener('load', () => {
    console.log('🧇 Waffle Mágico carregado com sucesso!');
    showScreen('start-screen');
});
