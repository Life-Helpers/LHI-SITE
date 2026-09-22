/**
 * Web Audio API procedural audio tone generator for interactive radio broadcast preview.
 * Provides authentic, gentle radio station broadcast chimes / interval signals so users
 * experience real sound feedback immediately without broken external remote mp3 requests.
 */

class RadioAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: number | null = null;
  private gainNode: GainNode | null = null;
  private volume = 0.8;

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  // Play a gentle pentatonic chime (radio broadcast acoustic identifier)
  public playChime(freq = 440, duration = 0.4, type: OscillatorType = "sine") {
    try {
      this.initContext();
      if (!this.ctx || !this.gainNode) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Envelope: gentle attack, warm decay
      const now = this.ctx.currentTime;
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(this.volume * 0.15, now + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // AudioContext unavailable or blocked by browser policy
    }
  }

  // Starts ambient broadcast melody pattern (simulating radio airwaves)
  public startAmbientBroadcast() {
    this.initContext();
    this.isPlaying = true;

    // African pentatonic frequency sequence: D4, F4, G4, A4, C5, D5
    const notes = [293.66, 349.23, 392.0, 440.0, 523.25, 587.33];
    let noteIdx = 0;

    // Initial chime
    this.playChime(notes[0], 0.6, "sine");
    setTimeout(() => this.playChime(notes[2], 0.6, "sine"), 250);
    setTimeout(() => this.playChime(notes[4], 0.8, "sine"), 500);

    // Periodic gentle background broadcast pulse every 4.5 seconds
    if (typeof window !== "undefined") {
      this.intervalId = window.setInterval(() => {
        if (!this.isPlaying) return;
        const note1 = notes[noteIdx % notes.length];
        const note2 = notes[(noteIdx + 2) % notes.length];
        this.playChime(note1, 0.4, "sine");
        setTimeout(() => this.playChime(note2, 0.5, "sine"), 200);
        noteIdx = (noteIdx + 1) % notes.length;
      }, 4500);
    }
  }

  public stopAmbientBroadcast() {
    this.isPlaying = false;
    if (this.intervalId !== null && typeof window !== "undefined") {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const radioAudioEngine = new RadioAudioEngine();
