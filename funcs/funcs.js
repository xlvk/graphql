/**
 * a function to update the page's stylesheet based on the path to the CSS file.
 * This function is used in the routing logic to update the page's stylesheet
 * when the user navigates to a new page. The function takes the path to the CSS
 * file as an argument and updates the href attribute of the page's stylesheet
 * link element with the new path. It also removes any existing style tags from
 * the page to prevent conflicts with the new stylesheet.
 */

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

/**
 * 
 * a function that checks if the skill name is a programming language or not.
 * Go
 * Js
 * Html
 * Css
 * Unix
 * Docker
 * Sql
 * C
 * Ruby
 * Rails
*/

export function isProgrammingLanguage(skillName) {
  const programmingLanguages = ['go', 'js', 'html', 'css', 'unix', 'docker', 'sql', 'c', 'ruby', 'rails', 'java'];
  return programmingLanguages.includes(skillName);
}

/**
 * a function that returns a random color for the graphs values
 * Random color generator
 */

export function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
