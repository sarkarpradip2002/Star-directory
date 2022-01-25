const express=require('express');
const stars=require('./stars.json');
const fs=require('fs');
const app=express();

app.use(express.json());

// fetch the stars from the database
app.get('/',(req,res)=>{
    res.status(200).json({
        stars
    })
})

// Adding the dtars in the database
app.post('/',(req,res)=>{
    const {name,email}=req.body;
    if(!name || !email){
       return res.status(406).json({
            "message":"Please fill all the fields"
        })
    }
    const starexists=stars.find((star)=>star.name===name)
    if(starexists){
       return res.status(401).json({
           "message":"Star already exists in the database"
       })
    }
    stars.push({
        name:name,
        email:email,
    })
    fs.writeFileSync('./stars.json',JSON.stringify(stars),(err)=>{
        res.status(408).json({
            "message":"Cannot add to the database...request timeout"
        })
    })
    res.status(200).json({
        "message":"Star added successfully",
    })
})

// Update the name of the exisitng star 
app.put('/:name',(req,res)=>{
    const {name}=req.params;
    const {email,newname}=req.body;
    const find=stars.find((star)=>star.name===name);
    if(find){
        if(find.email===email){
            stars.find((star)=>{
                if(star.name===name){
                    star.name=newname
                }
            })
            fs.writeFileSync('./stars.json',JSON.stringify(stars),(err)=>{
                return res.status(408).json({
                    "message":"Cannot add to the database...request timeout"
                })
            })
            return res.status(200).json({
                "message":"Star updated successfully"
            })
        }
        return res.status(401).json({
            "message":"please put a the correct email to change the name "
        })
    }
    res.status(404).json({
        "message":"star is not exist in the database"
    })
})

// Delete a star from the database 
app.delete('/',(req,res)=>{
    const {name,email}=req.body;
    const findstar=stars.find((star)=>star.name===name)
    
    if(findstar){
        if(findstar.email===email){
            stars.splice(stars.findIndex((star)=>star.name===name),1)
            fs.writeFileSync('./stars.json',JSON.stringify(stars),(err)=>{
                return res.status(408).json({
                    "message":"Star is not deleted...request timeout"
                })
            }
            )
            return res.status(200).json({
                "message":"star deleted successfully form the database"
            })
    }
    return res.status(401).json({
        "message":"Please put the correct email to delete the star"
    })
}
     res.status(404).json({
         "message":"star not found in the database"
     })
})

app.listen(9000,()=>{
    console.log("star server is running");
})