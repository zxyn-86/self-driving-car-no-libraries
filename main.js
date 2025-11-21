const canvas = document.getElementById("myCanvas");
canvas.width = 200;


const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2, canvas.width*0.9);
const car = new Car(road.getLaneCentre(1),100,30,50, "AI");
const traffic = [
    new Car(road.getLaneCentre(1),-100,30,50, "DUMMY",2),
    // new Car(road.getLaneCentre(0),-300,30,50,"DUMMY",2),
    // new Car(road.getLaneCentre(2),-300,30,50,"DUMMY",2),
    // new Car(road.getLaneCentre(1),-500,30,50,"DUMMY",2)
];

animate();

function animate()
{
    for(let i =0; i<traffic.length; i++)
    {
        traffic[i].update(road.borders,[]); //empty array as a param so traffic not interacting w itself
    }
   
    car.update(road.borders, traffic);
    canvas.height = window.innerHeight;  //this resizes the canvas so the car looks like it smoving
    //by saving and translating we make it look as though the road is moving 
    ctx.save();
    ctx.translate(0,-car.y + canvas.height*0.7);
    road.draw(ctx);

    for(let i =0; i<traffic.length; i++)
    {
        traffic[i].draw(ctx, "red");
    }
    car.draw(ctx, "blue");

    ctx.restore();
    requestAnimationFrame(animate);
}