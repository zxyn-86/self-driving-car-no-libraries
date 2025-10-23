class Car
{
    constructor(x,y,width,height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
        this.speed = 0;
        this.acceleration = 0.15;
        this.maxSpeed = 3;
        this.friction = 0.05;
        this.angle = 0;

        this.controls = new Controls();
    }


    update()
    {
        this.#move();
        
    }

    //handles car movement
    #move(){
        if(this.controls.forward)
        {
            this.speed += this.acceleration;
        }
        if(this.controls.reverse)
        {
            this.speed -= this.acceleration;
        }

        if(this.speed > this.maxSpeed) //this one and next just stop car from going to fast
        {
            this.speed = this.maxSpeed/2;
        }

        if(this.speed < -this.maxSpeed) 
        {
            this.speed = -this.maxSpeed/2;
        }

        if(this.speed>0 ) //reducing the speed by the friction
        {
               this.speed += this.friction; 
        }

        //solves the issue that when you release in the right way the friction moves car forward by small amount
        if(Math.abs(this.speed)<this.friction){
            this.speed = 0;
        }


        //here a conditional operator is used to flip the angle so when reversing controls work like normal
        //it also stops us from rotation on the spot
        if(this.speed != 0)
        {
            const flip = this.speed>0? 1: -1;
            if(this.controls.left)
            {
                this.angle += 0.03*flip;
           
            }
            if(this.controls.right)
            {
                this.angle -= 0.03*flip;
            }
        }
        

        this.x -= Math.sin(this.angle)*this.speed;   //based on unit circle will allow car to move in direction of angle
        this.y -= Math.cos(this.angle)*this.speed;
        
        
    }
    //this basically draws the car
    draw(ctx)
    {
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect(
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
        

        ctx.fill();
        ctx.restore();
    }
}