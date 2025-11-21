class Car
{
    constructor(x,y,width,height, controlType, maxSpeed=3)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
        this.speed = 0;
        this.acceleration = 0.15;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;
        this.polygon = [];

        this.useBrain = controlType == "AI";
        if(controlType != "DUMMY")
        {
            this.sensor = new sensor(this);
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount,6,4]
            );
        }
        this.controls = new Controls(controlType);
    }


    update(roadBorders, traffic)
    {
        if(!this.damaged)
        {
            this.#move();
            this.polygon = this.#createPolygon();
            //console.log(this.polygon[3].y);
            this.damaged = this.#assessDamage(roadBorders,traffic);
        }
        
        if(this.sensor)
        {
            this.sensor.update(roadBorders,traffic);
            const offset = this.sensor.readings.map(
                s => s== null? 0: 1-s.offset
            );
            const outputs = NeuralNetwork.feedForward(offset,this.brain );
            console.log(outputs);
        }

        if(this.useBrain)
        {
            this.controls.forward = outputs[0];
            this.controls.left = outputs[1];
            this.controls.right = outputs[2];
            this.controls.reverse = outputs[3];
        }
    }

    #assessDamage(roadBorders,traffic)
    {
        
        for(let i = 0; i<roadBorders.length; i++)
        {
            if(polysIntersect(this.polygon, roadBorders[i]))
            {
                return true;
            }
        }

        for(let i = 0; i<traffic.length; i++)
        {
            if(polysIntersect(this.polygon, traffic[i].polygon))
            {
                return true;
            }
        }
        return false;
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
    draw(ctx, color)
    {
        console.log(this.damaged)
        if(this.damaged){
            ctx.fillStyle = "gray";
        }
        else{
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i = 1 ; i<this.polygon.length; i++)
        {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();

        if(this.sensor)
        {
            this.sensor.draw(ctx);
        }
    }


    


    //this func allows us to get the points and even alter them to give different shapes
    #createPolygon() //bcos we need to track where corners are for collision
    {
        const points = [];
        const rad = Math.hypot(this.width,this.height)/2;
        const alpha = Math.atan2(this.width,this.height);

        //here i am pushing all 4 corners of the car to points
        //for the math stuff thing about a rectangle and how you can make a triangle from its centre
        //top right
        points.push({
            x:this.x - Math.sin(this.angle-alpha)*rad,
            y: this.y - Math.cos(this.angle-alpha)*rad
        });

        //top left
        points.push({
            x:this.x - Math.sin(this.angle+alpha)*rad,
            y: this.y - Math.cos(this.angle+alpha)*rad
        });

        //bottom right
        points.push({
            x:this.x - Math.sin(Math.PI + this.angle-alpha)*rad,
            y: this.y - Math.cos(Math.PI + this.angle-alpha)*rad
        });

        //bottom left
        points.push({
            x:this.x - Math.sin(Math.PI + this.angle+alpha)*rad,
            y: this.y - Math.cos(Math.PI + this.angle+alpha)*rad
        });
        
        return points;

    }

    



}