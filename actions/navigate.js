// actions/navigate.js
async function navigateToSlide(slideNumber) {
  await AgentBrowserStorage.write('nav.json', { slide: slideNumber });
}
