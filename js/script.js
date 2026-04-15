document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const alertBtn = document.getElementById('alertBtn');
    const status = document.getElementById('status');
    const timerEl = document.getElementById('timer');

    let stream = null;
    let timer = 0;
    let timerInterval = null;
    let animationId = null;

    startBtn.addEventListener('click', async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480 } 
            });
            video.srcObject = stream;
            
            startBtn.disabled = true;
            stopBtn.disabled = false;
            status.textContent = 'Monitoreando posturas... Muévete cada 5 minutos.';
            status.className = 'mt-3 alert alert-success';

            timerInterval = setInterval(() => {
                timer++;
                const minutes = Math.floor(timer / 60);
                const seconds = timer % 60;
                timerEl.textContent = `Tiempo sedentario: ${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
                
                if (timer >= 300) {
                    alertBtn.style.display = 'inline-block';
                    status.className = 'mt-3 alert alert-warning pulsing';
                    status.textContent = '¡PAUSA ACTIVA! Realiza ejercicios.';
                }
            }, 1000);

            video.addEventListener('loadedmetadata', () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                detectMotion();
            });

        } catch (err) {
            status.textContent = 'Error al acceder a la cámara: ' + err.message;
            status.className = 'mt-3 alert alert-danger';
        }
    });

    stopBtn.addEventListener('click', () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        if (timerInterval) clearInterval(timerInterval);
        if (animationId) cancelAnimationFrame(animationId);
        
        video.srcObject = null;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        alertBtn.style.display = 'none';
        status.textContent = 'Cámara detenida. Presiona "Iniciar Cámara" para continuar.';
        status.className = 'mt-3 alert alert-info';
        timer = 0;
        timerEl.textContent = 'Tiempo sedentario: 00:00';
    });

    alertBtn.addEventListener('click', () => {
        const ejercicios = [
            '1. Estiramiento de cuello: Inclina la cabeza hacia los hombros (10 seg cada lado)',
            '2. Rotación de hombros: 10 círculos hacia adelante y atrás',
            '3. Estiramiento de brazos: Cruza un brazo sobre el pecho (15 seg cada lado)',
            '4. Marcha en el lugar: 30 segundos elevando las rodillas'
        ];
        const randomEjercicio = ejercicios[Math.floor(Math.random() * ejercicios.length)];
        alert('¡PAUSA ACTIVA!\n\n' + randomEjercicio);
        timer = 0;
        status.className = 'mt-3 alert alert-success';
        status.textContent = '¡Excelente! Timer reiniciado. Sigue trabajando.';
    });


    function detectMotion() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
 
        }
        animationId = requestAnimationFrame(detectMotion);
    }
});