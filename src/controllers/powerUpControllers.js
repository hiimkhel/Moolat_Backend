const {db, FieldValue} = require("../firebaseConfig");

const getPowerUps = async (req, res) =>{
    try{
        const powerUpSnapshot = await db.collection("powerups").get();
        const powerups =  powerUpSnapshot.docs.map(doc =>({
            id: doc.id,
            ...doc.data()
        }))
        res.status(200).json(powerups);
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

const usePowerUps = async(req, res)=>{
    const {childId, powerUpId} = req.body;

    try{
        const powerUpDoc = await db.collection("powerups").doc(powerUpId).get();

        if(!powerUpDoc){
            res.status(401).json({message: `Power up ${powerUpId} is not found`});
        }

        const powerUp = powerUpDoc.data();

        const childRef =  db.collection("children").doc(childId);
        const childDoc = await childRef.get();


        if(!childDoc){
            res.status(401).json({message: `Child's doc ${childId} is not found`});
        }

        const childData = childDoc.data();

        if(childData.progress.points < powerUp.cost){
            return res.status(400).json({message: "Not enough points"});
        }

        await childRef.update({
            "progress.points": FieldValue.increment(-powerUp.cost),
            "progress.activePowerUps": FieldValue.arrayUnion(powerUp.effect)
        });

        res.status(200).json({
            message: `Power up ${powerUp.name} applied succesfully`,
            effect: powerUp.effect
        })

    }catch(err){
        res.status(500).json({error: err.message});
    }
}

module.exports = {getPowerUps, usePowerUps};