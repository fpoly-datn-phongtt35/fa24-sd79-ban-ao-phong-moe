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