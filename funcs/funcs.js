export const UpdateCSS = (stylesheet) => {
    const linkElement = document.getElementById("page-styles");
    if (linkElement) {
      linkElement.href = stylesheet;
      const styleTags = document.querySelectorAll("style");
      styleTags.forEach((tag) => tag.remove());
    } else {
      console.error("Page stylesheet link not found");
    }
  };