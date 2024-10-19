export const speacker = (value) => {
  const utterance = new SpeechSynthesisUtterance(value);
  utterance.lang = "vi-VN";
  speechSynthesis.speak(utterance);
};
