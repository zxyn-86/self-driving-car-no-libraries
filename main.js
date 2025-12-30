const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 600;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");



const road = new Road(carCanvas.width/2, carCanvas.width*0.9);
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
    carCanvas.height = window.innerHeight;  //this resizes the canvas so the car looks like it smoving
    //by saving and translating we make it look as though the road is moving 
    networkCanvas.height = window.innerHeight;


    carCtx.save();
    carCtx.translate(0,-car.y + carCanvas.height*0.7);
    road.draw(carCtx);

    for(let i =0; i<traffic.length; i++)
    {
        traffic[i].draw(carCtx, "red");
    }
    car.draw(carCtx, "blue");

    carCtx.restore();


    Visualiser.drawNetwork(networkCtx,car.brain); //need to implement
    requestAnimationFrame(animate);

}