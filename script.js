// Aguarda o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Configuração inicial
    initLoader();
    initThreeJSBackground();
    initNavigation();
    initAudioPlayer();
    
    // Carrega Mrs. Potato Head inicialmente
    globalAudioPlayer.src = 'media/mrs_potato_head.mp3';
    globalAudioPlayer.load();
    console.log('Áudio inicial carregado:', globalAudioPlayer.src);
    
    initMusicPlayer();
    initSimpleVideoPopup();
    initMemoriesSection();
    initInteractiveTabs();
    initHeartGame();
    initLoveCalculator();
    initPoemGenerator();
    initSecretMessage();
    initVideoPopup();
    initMusicAndMemories();
    
    // Garante que todas as imagens do player sejam atualizadas para she.png
    const trackImage = document.getElementById('track-image');
    if (trackImage) {
        trackImage.src = 'media/she.png';
    }
});

// Variáveis globais para API do YouTube removidas
// Substituídas por player de áudio local

// Variável global para o player de áudio
let globalAudioPlayer = new Audio();
let isPlaying = false;

// Sistema de Carregamento
function initLoader() {
    const loader = document.querySelector('.loader-container');
    
    // Simula carregamento
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 2500);
}

// Fundo Three.js
function initThreeJSBackground() {
    const canvas = document.getElementById('bg-canvas');
    
    // Configura a cena, câmera e renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Ajusta o tamanho do canvas quando a janela é redimensionada
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Adiciona luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x4CAF50, 0.8);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);
    
    // Cria partículas flutuantes (como estrelas verdes)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const scaleArray = new Float32Array(particlesCount);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Posição das partículas em formato de coração
        const theta = Math.random() * Math.PI * 2;
        const r = 5 + Math.random() * 15;
        
        posArray[i] = Math.cos(theta) * r; // x
        posArray[i + 1] = Math.sin(theta) * r; // y
        posArray[i + 2] = (Math.random() - 0.5) * 20; // z
        
        // Escala variada para as partículas
        scaleArray[i / 3] = Math.random();
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));
    
    // Material para as partículas
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x4CAF50,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    // Cria o sistema de partículas
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Posiciona a câmera
    camera.position.z = 30;
    
    // Função de animação
    const animate = () => {
        requestAnimationFrame(animate);
        
        // Rotação suave das partículas
        particlesMesh.rotation.y += 0.0005;
        particlesMesh.rotation.x += 0.0002;
        
        // Movimento ondulante baseado no tempo
        const elapsedTime = Date.now() * 0.001;
        particlesMesh.position.y = Math.sin(elapsedTime * 0.5) * 0.5;
        
        // Renderiza a cena
        renderer.render(scene, camera);
    };
    
    animate();
}

// Sistema de Navegação
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Abre e fecha o menu
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
    });
    
    // Comportamento de rolagem suave
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Fecha o menu se estiver aberto
            navToggle.classList.remove('active');
            
            // Obtém o ID da seção alvo
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Rolagem suave até a seção
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        });
    });
    
    // Destacar link da seção atual durante a rolagem
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('.section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Player de Áudio de Fundo
function initAudioPlayer() {
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = musicToggle.querySelector('.music-icon');
    const progressBar = document.querySelector('.progress');
    
    let isPlaying = false;
    
    // Alterna reprodução de áudio
    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicIcon.textContent = '♪';
        } else {
            bgMusic.play().catch(error => {
                console.error("Erro ao reproduzir áudio:", error);
                alert("Para uma experiência completa, acesse este site em um servidor web local ou remoto.");
            });
            musicIcon.textContent = '◼';
        }
        
        isPlaying = !isPlaying;
    });
    
    // Atualiza a barra de progresso
    bgMusic.addEventListener('timeupdate', () => {
        const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
        progressBar.style.width = `${progress}%`;
    });
}

// Player de música local
function initMusicPlayer() {
    const albums = document.querySelectorAll('.album');
    const trackTitle = document.getElementById('track-title');
    const trackAlbum = document.getElementById('track-album');
    const trackImage = document.getElementById('track-image');
    const playPauseBtn = document.getElementById('play-pause');
    const prevTrackBtn = document.getElementById('prev-track');
    const nextTrackBtn = document.getElementById('next-track');
    
    // Remove o container de letras pois não é mais necessário
    const lyricsContainer = document.querySelector('.lyrics-container');
    if (lyricsContainer) {
        lyricsContainer.innerHTML = '';
    }
    
    // Manipula a seleção de álbum
    albums.forEach(album => {
        album.addEventListener('click', () => {
            // Para a reprodução atual
            globalAudioPlayer.pause();
            isPlaying = false;
            
            const albumType = album.getAttribute('data-album');
            
            // Seleciona a música específica com base no álbum clicado
            if (albumType === 'crybaby') {
                // Define o título e o álbum
                trackTitle.textContent = 'Mrs. Potato Head';
                trackAlbum.textContent = 'Crybaby (2015)';
                // Prepara o áudio
                globalAudioPlayer.src = 'media/mrs_potato_head.mp3';
                globalAudioPlayer.load();
                console.log('Áudio carregado:', globalAudioPlayer.src); // Debug
            } else if (albumType === 'k-12') {
                // Define o título como Orange Juice mas mantém o álbum K-12
                trackTitle.textContent = 'Orange Juice';
                trackAlbum.textContent = 'K-12 (2019)';
                // Prepara o áudio
                globalAudioPlayer.src = 'media/crybaby.mp3';
                globalAudioPlayer.load();
                console.log('Áudio carregado:', globalAudioPlayer.src); // Debug
            } else if (albumType === 'portals') {
                // Define o título e o álbum para Portals
                trackTitle.textContent = 'Milk of the Siren';
                trackAlbum.textContent = 'Portals (2023)';
                // Prepara o áudio
                globalAudioPlayer.src = 'media/mts.mp3';
                globalAudioPlayer.load();
                console.log('Áudio carregado:', globalAudioPlayer.src); // Debug
            }
            
            // Garante que a imagem seja sempre she.png
            trackImage.src = 'media/she.png';
        });
    });
    
    // Botão de reprodução/pausa
    playPauseBtn.addEventListener('click', () => {
        console.log('Botão play clicado. Estado atual:', isPlaying); // Debug
        console.log('Fonte do áudio:', globalAudioPlayer.src); // Debug
        
        if (isPlaying) {
            globalAudioPlayer.pause();
        } else {
            globalAudioPlayer.play().catch(error => {
                console.error("Erro ao reproduzir áudio:", error);
                alert("Erro ao tocar a música. Verifique o console para mais detalhes.");
            });
        }
        
        isPlaying = !isPlaying;
    });
    
    // Adiciona listener para erros no áudio
    globalAudioPlayer.addEventListener('error', (e) => {
        console.error('Erro no player de áudio:', e);
        console.error('Código do erro:', globalAudioPlayer.error.code);
        console.error('Mensagem do erro:', globalAudioPlayer.error.message);
    });
    
    // Adiciona listener para quando o áudio estiver pronto
    globalAudioPlayer.addEventListener('canplay', () => {
        console.log('Áudio pronto para tocar!');
    });
    
    // Adiciona listener para quando o áudio começar a tocar
    globalAudioPlayer.addEventListener('playing', () => {
        console.log('Áudio começou a tocar!');
    });
}

// Função para inicializar o popup de vídeo simples
function initSimpleVideoPopup() {
    const popup = document.getElementById('simple-video-popup');
    const closeBtn = document.querySelector('.close-simple-video');
    const videoPlayer = document.getElementById('simple-video-player');
    const videoSource = document.getElementById('simple-video-source');
    
    // Ocultar o popup inicialmente
    popup.style.display = 'none';
    
    // Função para abrir o popup
    window.openVideoPopup = function(videoUrl) {
        videoSource.src = videoUrl;
        videoPlayer.load();
        popup.style.display = 'flex';
    };
    
    // Fechar o popup ao clicar no botão fechar
    closeBtn.addEventListener('click', function() {
        popup.style.display = 'none';
        videoPlayer.pause();
    });
    
    // Fechar o popup ao clicar fora do vídeo
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            popup.style.display = 'none';
            videoPlayer.pause();
        }
    });
}

// Mostra o vídeo simples
function showSimpleVideo(videoSrc) {
    const popup = document.getElementById('video-popup');
    const video = document.getElementById('popup-video');
    
    // Define o vídeo
    video.src = videoSrc;
    
    // Exibe o popup
    popup.style.display = 'block';
}

// Esconde o vídeo simples
function hideSimpleVideo() {
    const popup = document.getElementById('video-popup');
    const video = document.getElementById('popup-video');
    
    // Esconde o popup
    popup.style.display = 'none';
    
    // Pausa o vídeo e limpa a fonte
    video.pause();
    video.src = '';
}

// Seção de Memórias
function initMemoriesSection() {
    // Inicializa o Swiper para o carrossel de memórias
    const memorySwiper = new Swiper('.memory-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        effect: 'coverflow',
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });
    
    // Botão para adicionar novas memórias
    const addMemoryBtn = document.getElementById('add-memory-btn');
    
    addMemoryBtn.addEventListener('click', () => {
        // Cria modal para adicionar memória
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Adicionar Nova Memória</h2>
                <div style="margin: 20px 0;">
                    <div class="input-group" style="margin-bottom: 15px;">
                        <label>Data</label>
                        <input type="text" id="memory-date" placeholder="Ex: 15 de Janeiro">
                    </div>
                    <div class="input-group" style="margin-bottom: 15px;">
                        <label>Título</label>
                        <input type="text" id="memory-title" placeholder="Título da memória">
                    </div>
                    <div class="input-group" style="margin-bottom: 15px;">
                        <label>Descrição</label>
                        <textarea id="memory-description" placeholder="Descreva esse momento especial..." style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); padding: 12px 15px; border-radius: 8px; color: white; font-size: 1rem; height: 100px; resize: none;"></textarea>
                    </div>
                </div>
                <button id="save-memory" style="background: var(--primary-green); color: white; border: none; padding: 12px 25px; border-radius: 30px; font-size: 1rem; cursor: pointer; display: block; margin: 0 auto;">Salvar Memória</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Manipuladores de eventos para o modal
        const closeModal = modal.querySelector('.close-modal');
        const saveMemoryBtn = modal.querySelector('#save-memory');
        
        closeModal.addEventListener('click', () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
            }, 500);
        });
        
        saveMemoryBtn.addEventListener('click', () => {
            const date = document.getElementById('memory-date').value;
            const title = document.getElementById('memory-title').value;
            const description = document.getElementById('memory-description').value;
            
            if (date && title && description) {
                // Cria novo slide
                const newSlide = document.createElement('div');
                newSlide.className = 'swiper-slide memory-card';
                newSlide.innerHTML = `
                    <div class="memory-content">
                        <div class="memory-date">${date}</div>
                        <h3>${title}</h3>
                        <p>${description}</p>
                    </div>
                `;
                
                // Adiciona ao Swiper
                document.querySelector('.swiper-wrapper').appendChild(newSlide);
                
                // Atualiza o Swiper
                memorySwiper.update();
                
                // Fecha o modal
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.remove();
                }, 500);
            }
        });
    });
}

// Inicializa as guias interativas
function initInteractiveTabs() {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove a classe active de todas as guias
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Adiciona a classe active na guia clicada
            tab.classList.add('active');
            
            // Mostra o conteúdo correspondente
            const contentId = `${tab.getAttribute('data-tab')}-content`;
            document.getElementById(contentId).classList.add('active');
        });
    });
}

// Jogo dos Corações
function initHeartGame() {
    const startBtn = document.getElementById('start-game');
    const gameArea = document.querySelector('.game-area');
    const scoreDisplay = document.getElementById('score');
    const gameMessage = document.querySelector('.game-message');
    
    let score = 0;
    let isPlaying = false;
    let gameInterval;
    
    const messages = [
        "Seu amor é como música para minha alma! ❤️",
        "Cada batida do meu coração é por você! 💕",
        "Nosso amor é mais forte a cada dia! 💖",
        "Você é o melhor presente que já recebi! 💝",
        "Seu sorriso ilumina meu mundo! ❤️",
        "Com você, tudo é mais especial! 💕",
        "Nosso amor é único e verdadeiro! 💖",
        "Você faz meu coração bater mais forte! 💝",
        "Cada momento com você é mágico! ❤️",
        "Nosso amor é eterno! 💕"
    ];
    
    startBtn.addEventListener('click', () => {
        if (!isPlaying) {
            startGame();
        }
    });
    
    function startGame() {
        // Reinicia o jogo
        score = 0;
        scoreDisplay.textContent = score;
        gameArea.innerHTML = '';
        gameMessage.textContent = 'Capture os corações!';
        isPlaying = true;
        startBtn.textContent = 'Jogo em Andamento';
        
        // Inicia a geração de corações
        gameInterval = setInterval(createHeart, 1000);
        
        // Termina o jogo após 30 segundos
        setTimeout(endGame, 30000);
    }
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'game-heart';
        
        // Posição aleatória
        const maxX = gameArea.clientWidth - 40;
        const maxY = gameArea.clientHeight - 40;
        heart.style.left = Math.random() * maxX + 'px';
        heart.style.top = Math.random() * maxY + 'px';
        
        heart.addEventListener('click', () => {
            score++;
            scoreDisplay.textContent = score;
            heart.remove();
            
            // Mostra mensagem aleatória
            gameMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
        });
        
        gameArea.appendChild(heart);
        
        // Remove o coração após 2 segundos se não for clicado
        setTimeout(() => heart.remove(), 2000);
    }
    
    function endGame() {
        clearInterval(gameInterval);
        isPlaying = false;
        startBtn.textContent = 'Jogar Novamente';
        
        let finalMessage;
        if (score >= 15) {
            finalMessage = "Uau! Você é incrível! Nosso amor é mais forte que tudo! 💖";
        } else if (score >= 10) {
            finalMessage = "Muito bem! Nosso amor cresce a cada dia! 💕";
        } else {
            finalMessage = "Cada coração capturado é especial como você! ❤️";
        }
        
        gameMessage.textContent = `Fim de jogo! ${finalMessage} Pontuação final: ${score}`;
    }
}

// Calculadora do Amor
function initLoveCalculator() {
    const calculateBtn = document.getElementById('calculate-love');
    const result = document.querySelector('.calculator-result');
    
    calculateBtn.addEventListener('click', () => {
        const item = document.getElementById('love-item').value;
        const number = document.getElementById('love-number').value;
        const color = document.getElementById('love-color').value;
        
        if (item && number && color) {
            // Gera um resultado personalizado
            const loveScore = Math.floor((parseInt(number) % 20) + 80); // Sempre alto :)
            
            const messages = [
                `💖 Nossa compatibilidade é de ${loveScore}%! Incrível!`,
                `💕 Seu amor por ${item} mostra como você é especial!`,
                `💝 A cor ${color} representa a pureza do nosso amor!`,
                `❤️ O número ${number} simboliza nossa conexão única!`,
                "✨ Nosso amor é verdadeiramente mágico!",
                "🌟 Juntos, somos mais fortes!"
            ];
            
            result.style.display = 'block';
            result.innerHTML = messages.join('<br><br>');
            
            // Adiciona animação
            result.style.animation = 'fade-in 0.5s ease-in';
        } else {
            alert('Por favor, preencha todos os campos! ❤️');
        }
    });
}

// Gerador de Poema
function initPoemGenerator() {
    const generateBtn = document.getElementById('generate-poem');
    const poemResult = document.querySelector('.poem-result');
    const poemText = document.querySelector('.poem-text');
    const saveBtn = document.getElementById('save-poem');
    
    const poemTemplates = [
        (feeling, element, future) => `
            No jardim do meu coração, o ${feeling} floresce,
            Como as ${element} que brilham no céu da noite,
            Nosso amor é uma jornada rumo à ${future},
            Um caminho que só nós dois podemos seguir.
        `,
        (feeling, element, future) => `
            Quando penso em você, sinto ${feeling},
            Tão intenso quanto as ${element} em movimento,
            Juntos construímos nossa ${future},
            Em cada momento, em cada sentimento.
        `,
        (feeling, element, future) => `
            O ${feeling} que sinto é como música,
            Dançando com as ${element} em harmonia,
            Nossa história é uma bela ${future},
            Que se renova a cada novo dia.
        `
    ];
    
    generateBtn.addEventListener('click', () => {
        const feeling = document.getElementById('feeling-select').value;
        const element = document.getElementById('element-select').value;
        const future = document.getElementById('future-select').value;
        
        // Escolhe um template aleatório
        const template = poemTemplates[Math.floor(Math.random() * poemTemplates.length)];
        
        // Gera o poema
        const poem = template(feeling, element, future);
        
        // Exibe o resultado
        poemText.innerHTML = poem;
        poemResult.style.display = 'block';
    });
    
    saveBtn.addEventListener('click', () => {
        const date = new Date().toLocaleDateString();
        alert(`Poema salvo com sucesso! 📝\nData: ${date}\nEste momento ficará para sempre em nossos corações! ❤️`);
    });
}

// Mensagem Secreta
function initSecretMessage() {
    const secretTrigger = document.getElementById('secret-trigger');
    const modal = document.getElementById('secret-modal');
    const closeModal = document.querySelector('.close-modal');
    const signPromiseBtn = document.getElementById('sign-promise');
    
    // Abre o modal
    secretTrigger.addEventListener('click', () => {
        modal.style.display = 'flex';
    });
    
    // Fecha o modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Clique fora do modal para fechar
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Confirma a promessa
    signPromiseBtn.addEventListener('click', () => {
        const signature = document.getElementById('signature-input').value;
        
        if (signature) {
            // Cria efeito de confete de corações
            createHeartConfetti();
            
            // Atualiza o conteúdo do modal
            const modalContent = document.querySelector('.modal-content');
            modalContent.innerHTML = `
                <h2>Promessa Selada com Amor</h2>
                <div class="secret-animation">
                    <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                        <path class="heart-path left" d="M25,40 A20,20 0,0,1 65,40 A20,20 0,0,1 105,40 Q105,70 65,95 Q25,70 25,40 Z" />
                        <path class="heart-path right" d="M95,40 A20,20 0,0,1 135,40 A20,20 0,0,1 175,40 Q175,70 135,95 Q95,70 95,40 Z" />
                    </svg>
                </div>
                <p class="secret-text">Nossa promessa foi selada para a eternidade. Agora, ${signature} e eu estaremos conectados por este laço de amor inabalável. Obrigado por fazer parte da minha história e por me permitir ser parte da sua. Nosso amor transcenderá o tempo.</p>
                <button id="close-final" style="background: var(--primary-green); color: white; border: none; padding: 12px 25px; border-radius: 30px; font-size: 1rem; cursor: pointer; margin-top: 20px;">Fechar com Amor</button>
            `;
            
            // Adiciona evento ao novo botão
            document.getElementById('close-final').addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
    });
    
    // Cria o efeito de confete de corações
    function createHeartConfetti() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.innerHTML = '❤️';
                confetti.style.position = 'fixed';
                confetti.style.zIndex = '9999';
                confetti.style.left = `${Math.random() * 100}vw`;
                confetti.style.top = '-20px';
                confetti.style.fontSize = `${Math.random() * 20 + 10}px`;
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
                confetti.style.opacity = Math.random() * 0.7 + 0.3;
                confetti.style.pointerEvents = 'none';
                
                document.body.appendChild(confetti);
                
                // Animação de queda
                const fallDuration = Math.random() * 3 + 2;
                const fallDelay = Math.random() * 2;
                
                confetti.animate(
                    [
                        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                        { transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
                    ],
                    {
                        duration: fallDuration * 1000,
                        delay: fallDelay * 1000,
                        easing: 'ease-in',
                        fill: 'forwards'
                    }
                ).onfinish = () => {
                    confetti.remove();
                };
            }, i * 100);
        }
    }
}

// Função para inicializar o popup de vídeo
function initVideoPopup() {
    const videoPopup = document.getElementById('videoPopup');
    const closeVideo = document.getElementById('closeVideo');
    const videoPlayer = document.getElementById('videoPlayer');
    
    // Botão para abrir o vídeo - pode ser qualquer elemento com a classe 'open-video'
    const openVideoButtons = document.querySelectorAll('.open-video');
    
    // Função para abrir o popup
    function openVideoPopup() {
        videoPopup.style.display = 'flex';
        videoPlayer.play();
    }
    
    // Função para fechar o popup
    function closeVideoPopup() {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
        videoPopup.style.display = 'none';
    }
    
    // Adicionar eventos aos botões
    openVideoButtons.forEach(button => {
        button.addEventListener('click', openVideoPopup);
    });
    
    // Fechar com o botão X
    closeVideo.addEventListener('click', closeVideoPopup);
    
    // Fechar clicando fora do vídeo
    videoPopup.addEventListener('click', function(e) {
        if (e.target === videoPopup) {
            closeVideoPopup();
        }
    });
}

// Função para inicializar a seção de música e memórias
function initMusicAndMemories() {
    // Adicionar manipulador para exibir o vídeo
    const videoButtons = document.querySelectorAll('.play-video-btn');
    const simplePopup = document.getElementById('simple-popup');
    const closeSimpleVideo = document.getElementById('close-simple-video');
    const simpleVideoPlayer = document.getElementById('simple-video-player');
    
    if (videoButtons.length && simplePopup && closeSimpleVideo && simpleVideoPlayer) {
        videoButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                simplePopup.style.display = 'flex';
                simpleVideoPlayer.play();
            });
        });
        
        closeSimpleVideo.addEventListener('click', function() {
            simplePopup.style.display = 'none';
            simpleVideoPlayer.pause();
            simpleVideoPlayer.currentTime = 0;
        });
    } else {
        console.log('Elementos de vídeo não encontrados');
    }
}

// Seleciona o elemento de áudio
const bgMusic = document.getElementById('bg-music');

// Função para iniciar a música
function playMusic() {
    if (bgMusic.paused) {
        bgMusic.play();
    }
}

// Adiciona eventos para detectar interações do usuário
document.addEventListener('mousemove', playMusic);
document.addEventListener('click', playMusic);
document.addEventListener('touchstart', playMusic);
document.addEventListener('touchmove', playMusic);
document.addEventListener('scroll', playMusic);

// Remove os eventos após a música começar a tocar
bgMusic.addEventListener('play', () => {
    document.removeEventListener('mousemove', playMusic);
    document.removeEventListener('click', playMusic);
    document.removeEventListener('touchstart', playMusic);
    document.removeEventListener('touchmove', playMusic);
    document.removeEventListener('scroll', playMusic);
});