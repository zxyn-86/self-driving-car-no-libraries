const canvas = document.getElementById("myCanvas");
canvas.width = 200;


const ctx = canvas.getContext("2d");
//console.log(ctx); 
const car = new Car(100,100,30,50);
car.draw(ctx);

animate();

function animate()
{
    car.update();
    canvas.height = window.innerHeight;  //this resizes the canvas so the car looks like it smoving
    car.draw(ctx);
    requestAnimationFrame(animate);
}