export const speacker = (value) => {
  const utterance = new SpeechSynthesisUtterance(value);
  utterance.lang = "vi-VN";
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
};
