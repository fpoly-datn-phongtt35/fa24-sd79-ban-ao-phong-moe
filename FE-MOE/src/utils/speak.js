// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
export const speacker = (value) => {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = "vi-VN";
    utterance.rate = 1.2;
    utterance.onend = () => {
      resolve();
    };

    speechSynthesis.speak(utterance);
  });
};

export const playAudio = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const playTone = () => {
    const oscillator = audioContext.createOscillator();
    oscillator.type = "sine"; // sine, square, sawtooth, triangle
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05);
  };

  playTone();

  setTimeout(() => {
    playTone();
  }, 100);
};
