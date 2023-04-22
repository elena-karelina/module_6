document.getElementById("video").onclick = ggg;

function ggg() {
const video = document.querySelector("video");
const canvas = document.querySelector("canvas");


canvas.style.transform = "scaleY(0.55)";
canvas.style.transition = "1s";

// добавляем обработчик события transitionend
canvas.addEventListener("transitionend", function() {
canvas.style.display = "none";
video.style.display = "inline";
video.style.transition = "1s";
video.style.width = "550px";
//video.style.height = "280px";
//video.style.marginTop = "123px";  
  


}, { once: true });
video.play();
}