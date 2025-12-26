// Estado do jogo
let currentPhase = 0;
let collectedIngredients = [];
let mixCount = 0;
let decorationCount = 0;

// Contexto de áudio
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Função para criar sons usando Web Audio API
function playSound(type, frequency = 440) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'collect':
            // Som de coleta de ingrediente (específico por tipo)
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, audioContext.currentTime + 0.15);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
            break;
            
        case 'mix':
            // Som de mistura
            oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
            
        case 'pour':
            // Som de despejar líquido
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.5);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
            break;
            
        case 'close':
            // Som de fechar máquina
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
            
        case 'open':
            // Som de abrir máquina
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
            
        case 'decorate':
            // Som de decoração
            oscillator.frequency.setValueAtTime(700, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
            
        case 'phase':
            // Som de transição de fase
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
            
        case 'victory':
            // Som de vitória
            const notes = [523.25, 587.33, 659.25, 783.99, 880.00];
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
            // Som de início
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
    collectedIngredients = [];
    mixCount = 0;
    decorationCount = 0;
    
    // Resetar ingredientes
    const ingredientBtns = document.querySelectorAll('.ingredient-btn');
    ingredientBtns.forEach(btn => {
        btn.classList.remove('collected');
    });
    
    document.getElementById('collected-count').textContent = '0';
    showScreen('phase1-screen');
}

// FASE 1: Coletar Ingredientes
function collectIngredient(ingredient) {
    if (collectedIngredients.includes(ingredient)) return;
    
    // Sons diferentes para cada ingrediente
    const frequencies = {
        'ovo': 500,
        'leite': 600,
        'farinha': 700,
        'acucar': 800
    };
    
    playSound('collect', frequencies[ingredient]);
    
    collectedIngredients.push(ingredient);
    
    // Marcar botão como coletado
    const btn = document.querySelector(`[data-ingredient="${ingredient}"]`);
    btn.classList.add('collected');
    
    // Atualizar contador
    document.getElementById('collected-count').textContent = collectedIngredients.length;
    
    // Se coletou todos, avançar após 1 segundo
    if (collectedIngredients.length === 4) {
        setTimeout(() => {
            playSound('phase');
            currentPhase = 2;
            showScreen('phase2-screen');
            setupMixingPhase();
        }, 1000);
    }
}

// FASE 2: Configurar fase de mistura
function setupMixingPhase() {
    mixCount = 0;
    document.getElementById('mix-count').textContent = '0';
    document.getElementById('mix-progress').style.width = '0%';
    
    // Adicionar ingredientes na tigela
    const ingredientsInBowl = document.getElementById('ingredients-in-bowl');
    ingredientsInBowl.innerHTML = '';
    
    collectedIngredients.forEach((ingredient, index) => {
        setTimeout(() => {
            const img = document.createElement('img');
            img.src = `assets/images/ingredients/${ingredient}.png`;
            img.alt = ingredient;
            ingredientsInBowl.appendChild(img);
        }, index * 200);
    });
}

// FASE 2: Misturar ingredientes
function mixIngredients() {
    if (mixCount >= 10) return;
    
    playSound('mix');
    mixCount++;
    
    // Animar colher
    const spoon = document.getElementById('spoon');
    spoon.classList.add('mixing');
    setTimeout(() => {
        spoon.classList.remove('mixing');
    }, 300);
    
    // Atualizar progresso
    document.getElementById('mix-count').textContent = mixCount;
    document.getElementById('mix-progress').style.width = (mixCount * 10) + '%';
    
    // Se completou, avançar
    if (mixCount === 10) {
        setTimeout(() => {
            playSound('phase');
            currentPhase = 3;
            showScreen('phase3-screen');
        }, 1000);
    }
}

// FASE 3: Despejar massa
function pourBatter() {
    playSound('pour');
    
    // Desabilitar botão
    event.target.disabled = true;
    event.target.textContent = 'Despejando... 🥣';
    
    setTimeout(() => {
        playSound('phase');
        currentPhase = 4;
        showScreen('phase4-screen');
    }, 1500);
}

// FASE 4: Fechar máquina e cozinhar
function closeMachine() {
    playSound('close');
    
    // Desabilitar botão
    const closeButton = document.getElementById('close-button');
    closeButton.disabled = true;
    closeButton.style.display = 'none';
    
    // Mostrar progresso de cozimento
    const cookingProgress = document.getElementById('cooking-progress');
    cookingProgress.style.display = 'block';
    
    // Adicionar vapor
    createSteam();
    
    // Simular cozimento
    let cookingPercent = 0;
    const cookingInterval = setInterval(() => {
        cookingPercent += 5;
        document.getElementById('cooking-percent').textContent = cookingPercent;
        document.getElementById('cooking-bar').style.width = cookingPercent + '%';
        
        if (cookingPercent >= 100) {
            clearInterval(cookingInterval);
            setTimeout(() => {
                playSound('phase');
                currentPhase = 5;
                showScreen('phase5-screen');
            }, 500);
        }
    }, 200);
}

// Criar efeito de vapor
function createSteam() {
    const steamContainer = document.getElementById('steam');
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const steamPuff = document.createElement('div');
            steamPuff.style.position = 'absolute';
            steamPuff.style.width = '30px';
            steamPuff.style.height = '30px';
            steamPuff.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
            steamPuff.style.borderRadius = '50%';
            steamPuff.style.left = (Math.random() * 80 + 10) + '%';
            steamPuff.style.bottom = '40%';
            steamPuff.style.filter = 'blur(5px)';
            
            steamContainer.appendChild(steamPuff);
            
            steamPuff.animate([
                { 
                    transform: 'translateY(0) scale(1)',
                    opacity: 0.6
                },
                { 
                    transform: 'translateY(-100px) scale(1.5)',
                    opacity: 0
                }
            ], {
                duration: 2000,
                easing: 'ease-out'
            });
            
            setTimeout(() => {
                steamPuff.remove();
            }, 2000);
        }, i * 300);
    }
}

// FASE 5: Abrir máquina
function openMachine() {
    playSound('open');
    
    event.target.disabled = true;
    event.target.textContent = 'Abrindo... 🎊';
    
    setTimeout(() => {
        playSound('phase');
        currentPhase = 6;
        showScreen('phase6-screen');
    }, 1000);
}

// FASE 6: Adicionar decoração
function addDecoration(decoration) {
    playSound('decorate');
    decorationCount++;
    
    const decorationsLayer = document.getElementById('decorations-layer');
    const decorationItem = document.createElement('img');
    decorationItem.src = `assets/images/decorations/${decoration}.png`;
    decorationItem.alt = decoration;
    decorationItem.className = 'decoration-item';
    
    // Posição aleatória
    const randomX = Math.random() * 60 + 20; // 20% a 80%
    const randomY = Math.random() * 60 + 20; // 20% a 80%
    decorationItem.style.left = randomX + '%';
    decorationItem.style.top = randomY + '%';
    
    decorationsLayer.appendChild(decorationItem);
}

// FASE 6: Finalizar decoração
function finishDecoration() {
    if (decorationCount === 0) {
        alert('Adicione pelo menos uma decoração ao seu waffle! 🎨');
        return;
    }
    
    playSound('phase');
    currentPhase = 7;
    showScreen('phase7-screen');
    
    setTimeout(() => {
        playSound('victory');
        createConfetti();
    }, 500);
}

// Função para reiniciar o jogo
function restartGame() {
    playSound('start');
    
    // Limpar decorações
    const decorationsLayer = document.getElementById('decorations-layer');
    if (decorationsLayer) {
        decorationsLayer.innerHTML = '';
    }
    
    // Resetar estado
    currentPhase = 0;
    collectedIngredients = [];
    mixCount = 0;
    decorationCount = 0;
    
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
        } else if (currentPhase === 7) {
            restartGame();
        }
    }
});

// Inicializar o jogo quando a página carregar
window.addEventListener('load', () => {
    console.log('🧇 Waffle Mágico carregado com sucesso!');
    showScreen('start-screen');
});
