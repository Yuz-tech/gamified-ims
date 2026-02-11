const requestButton = document.getElementById('request');
const loginButton = document.getElementById('login');
const container = document.getElementById('container');

requestButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

loginButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});