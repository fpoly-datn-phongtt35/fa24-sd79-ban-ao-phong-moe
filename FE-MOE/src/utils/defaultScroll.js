// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
export const ScrollToTop = () => {
  const contentArea = document.querySelector(".content-area_client");
  if (contentArea) {
    contentArea.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};
