export function createMonsterAudio() {
    let audio = null;

    function getAudio() {
        if (!audio) {
            const AudioContext =
                window.AudioContext || window.webkitAudioContext;

            if (!AudioContext) return null;
            audio = new AudioContext();
        }

        if (audio.state === 'suspended') audio.resume();
        return audio;
    }

    function tone(freq, duration, volume, type = 'sine', delay = 0) {
        const ctx = getAudio();
        if (!ctx) return;

        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime + delay);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(
            volume, ctx.currentTime + delay + 0.015
        );
        gain.gain.exponentialRampToValueAtTime(
            0.001, ctx.currentTime + delay + duration
        );

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start(ctx.currentTime + delay);
        oscillator.stop(ctx.currentTime + delay + duration + 0.03);
    }

    function noise(duration, volume, filterFrequency = 500) {
        const ctx = getAudio();
        if (!ctx) return;

        const length = Math.floor(ctx.sampleRate * duration);
        const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < length; i++) {
            data[i] = (Math.random() * 2 - 1) *
                Math.pow(1 - i / length, 2);
        }

        const source = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        source.buffer = buffer;
        filter.type = 'lowpass';
        filter.frequency.value = filterFrequency;
        gain.gain.value = volume;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start();
    }

    // BUSH BABY: eerie fictional crying sound
    function bushBabyCry(rank = 'stalker') {
        const power = rank === 'nightmare' ? 1.8 :
                      rank === 'hunter' ? 1.3 : 1;

        tone(520, 0.7, 0.055 * power, 'sawtooth');
        tone(390, 0.9, 0.045 * power, 'triangle', 0.35);
        tone(610, 0.65, 0.04 * power, 'sawtooth', 0.8);
        tone(280, 1.0, 0.05 * power, 'triangle', 1.15);
        noise(0.8, 0.025 * power, 1200);
    }

    // OPIANKWU: axe striking a tree
    function opiankwuChop(rank = 'stalker') {
        const power = rank === 'nightmare' ? 2 :
                      rank === 'hunter' ? 1.5 : 1;

        noise(0.16, 0.22 * power, 900);
        tone(95, 0.22, 0.18 * power, 'triangle', 0.01);
        tone(48, 0.35, 0.16 * power, 'sine', 0.025);
        tone(180, 0.08, 0.06 * power, 'square', 0.03);
    }

    // MADAM KOI-KOI: high heels striking a hard floor
    function madamHeelClick(rank = 'stalker') {
        const power = rank === 'nightmare' ? 1.8 :
                      rank === 'hunter' ? 1.35 : 1;

        tone(1250, 0.045, 0.12 * power, 'square');
        tone(720, 0.07, 0.07 * power, 'triangle', 0.025);
        noise(0.045, 0.045 * power, 3000);
    }

    return {
        bushBabyCry,
        opiankwuChop,
        madamHeelClick
    };
}

