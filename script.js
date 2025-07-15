// script.js
AOS.init();
document.querySelectorAll('.skill-block ul li').forEach(item => {
  item.addEventListener('click', function() {
    const skill = this.textContent.trim();
    alert(`You clicked on ${skill}! This could trigger a detailed view or action.`);
  });
});