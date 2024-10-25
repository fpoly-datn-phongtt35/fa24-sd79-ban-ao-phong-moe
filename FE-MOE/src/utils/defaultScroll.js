export const ScrollToTop = () => {
  const contentArea = document.querySelector(".content-area_client");
  if (contentArea) {
    contentArea.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};
