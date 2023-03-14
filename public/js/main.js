
const text = document.querySelector(".colorChange");
const colors = ["red", "green", "blue", "orange", "purple"];


let i = 0;
setInterval(function() {
    // fading effect is done with CSS .colorChange
    const newColor = colors[i];
    i = (i + 1) % colors.length;
    text.style.color = newColor;
}, 200);