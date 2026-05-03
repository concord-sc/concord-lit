    function drawMatrix() {
        mCtx.fillStyle = 'rgba(0, 0, 0, 0.2)'; 
        mCtx.fillRect(0, 0, mCanvas.width, mCanvas.height);

        fadingMarks = fadingMarks.filter(mark => mark.life > 0);
        fadingMarks.forEach(mark => {
            mCtx.font = 'bold 13px Orbitron';
            mCtx.fillStyle = `rgba(168, 65, 0, ${mark.life / 75})`; 
            mCtx.fillText(mark.text, mark.x, mark.y);
            mark.life -= 1; 
        });

        for (let i = 0; i < drops.length; i++) {
            if (drops[i] >= 0) {
                const leadCrimson = '#ff1a1a';
                const trailCrimson = '#3d0405';
                for (let j = 0; j < 5; j++) {
                    const yPos = (drops[i] - j) * fontSize;
                    if (yPos < 0) continue;
                    mCtx.fillStyle = j === 0 ? leadCrimson : trailCrimson;
                    mCtx.font = fontSize + 'px monospace';
                    mCtx.fillText(String.fromCharCode(0x30A0 + Math.random() * 96), i * fontSize, yPos);
                }
                drops[i] += 1.8; 
                if (drops[i] * fontSize > mCanvas.height + 150) drops[i] = -1;
            }

            if (directiveDrops[i]) {
                const d = directiveDrops[i];
                const textX = i * fontSize;
                if (!d.hasFlashed) {
                    d.y = drops[i] > -1 ? drops[i] * fontSize : d.y + d.speed;
                } else {
                    d.y += d.speed;
                }
                if (!d.hasFlashed && drops[i] > 5 && Math.random() > 0.70) {
                    d.flash = true;
                    d.hasFlashed = true;
                    fadingMarks.push({ x: textX, y: d.y, text: d.text, life: 75 });
                }
                mCtx.font = 'bold 12px Orbitron';
                if (d.flash) {
                    mCtx.fillStyle = '#ffffff'; 
                    mCtx.fillText(d.text, textX, d.y);
                    d.flash = false; 
                } else if (!d.hasFlashed) {
                    mCtx.fillStyle = '#3d0405';
                    mCtx.fillText(d.text, textX, d.y);
                } else {
                    mCtx.fillStyle = `rgba(168, 65, 0, ${d.ttl / 75})`;
                    mCtx.fillText(d.text, textX, d.y);
                    d.ttl--;
                    if (d.ttl <= 0 || d.y > mCanvas.height) directiveDrops[i] = null;
                }
            }
        }
    }

    triggerScan();
    setInterval(drawMatrix, 40);
