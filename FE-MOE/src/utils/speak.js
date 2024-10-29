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