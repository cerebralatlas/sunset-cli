document.addEventListener('DOMContentLoaded', () => {
    // Typewriter Effect
    const terminalOutput = document.getElementById('typewriter');
    const commands = [
        { text: 'sunset plan', type: 'command' },
        { text: '? 今晚的主要关注点是什么？', type: 'prompt', input: '写我的个人项目' },
        { text: '? 想清理的一件琐事是什么？', type: 'prompt', input: '洗碗' },
        { text: '? 睡前准备做什么来放松？', type: 'prompt', input: '读20页书' },
        { text: '> 正在发送晚间计划到飞书...', type: 'output' },
        { text: '✔ 晚间行动指南推送成功！', type: 'success' }
    ];

    let stepIndex = 0;
    let charIndex = 0;
    let isTyping = false;

    async function typeWriter() {
        if (stepIndex >= commands.length) {
            await new Promise(r => setTimeout(r, 3000));
            terminalOutput.innerHTML = '';
            stepIndex = 0;
            typeWriter();
            return;
        }

        const step = commands[stepIndex];

        if (!terminalOutput.querySelector(`[data-step="${stepIndex}"]`)) {
            const line = document.createElement('div');
            line.dataset.step = stepIndex;
            line.style.marginBottom = '0.5rem';
            
            if (step.type === 'command') {
                line.innerHTML = '<span style="color: #27c93f">➜</span> <span style="color: #5af78e">~</span> ';
            } else if (step.type === 'prompt') {
                line.innerHTML = '<span style="color: #5af78e">?</span> ' + step.text + '<span style="color: #a0a0a0">›</span> ';
            } else if (step.type === 'success') {
                line.style.color = '#27c93f';
                line.textContent = step.text;
            } else {
                line.style.color = '#a0a0a0';
                line.textContent = step.text;
            }
            
            terminalOutput.appendChild(line);

            if (step.type === 'success' || step.type === 'output') {
                stepIndex++;
                setTimeout(typeWriter, 500);
                return;
            }
        }

        const currentLine = terminalOutput.querySelector(`[data-step="${stepIndex}"]`);
        
        if (step.input || step.type === 'command') {
            const textToType = step.type === 'command' ? step.text : step.input;
            
            if (charIndex < textToType.length) {
                // For prompts, we append to existing HTML. For commands, we append to the line.
                // Actually, let's just append a span for the input
                let inputSpan = currentLine.querySelector('.input-text');
                if (!inputSpan) {
                    inputSpan = document.createElement('span');
                    inputSpan.className = 'input-text';
                    inputSpan.style.color = step.type === 'prompt' ? '#00ffff' : '#ffffff';
                    currentLine.appendChild(inputSpan);
                }
                
                inputSpan.textContent += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, Math.random() * 50 + 30);
            } else {
                charIndex = 0;
                stepIndex++;
                setTimeout(typeWriter, 800);
            }
        } else {
            stepIndex++;
            setTimeout(typeWriter, 500);
        }
    }

    typeWriter();

    // Copy to Clipboard
    const copyBtn = document.querySelector('.copy-btn');
    copyBtn.addEventListener('click', () => {
        const command = 'bun install sunset-cli';
        navigator.clipboard.writeText(command).then(() => {
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = '✓';
            copyBtn.style.color = '#27c93f';
            setTimeout(() => {
                copyBtn.innerHTML = originalIcon;
                copyBtn.style.color = '';
            }, 2000);
        });
    });

    // Parallax Effect for Stars
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        document.querySelector('.ambient-glow').style.transform = 
            `translate(calc(-50% + ${x * 30}px), calc(-50% + ${y * 30}px))`;
    });
});
