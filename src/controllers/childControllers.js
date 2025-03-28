const {db, collection} = require("../firebaseConfig");

const registerChild = async(req, res) =>{
    const {parentId, name, age, gradeLevel} = req.body;

    try{
        const childRef = await db.collection("children").add({
            parentId,
            name,
            age,
            gradeLevel,
            progress:{testCompleted: 0, exercisesCompleted: [], points: 0},
        })
        res.status(201).json({message: "Child registered successfully", childId: childRef.id});
    }catch(err){
        res.status(400).json({error:err.message});
    }
};


const getChildProfile = async(req, res) =>{
    const {childId} = req.params;

    try{
        const childDoc = await db.collection("children").doc(childId).get();
        if(!childDoc){
            res.status(404).json({message: "Child not found"});
        }
        res.status(200).json(childDoc.data());
    }catch(err){
        res.status(500).json({error: err.message})
    }
   
}

module.exports = {getChildProfile, registerChild};