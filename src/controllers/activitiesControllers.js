const {db, collection} = require("../firebaseConfig");


const getQuiz = async (req, res) =>{
    const {exerciseId} = req.params;

    try{

        const quizDoc = await db.collection("exercises").doc(exerciseId).get();

        if(!quizDoc){
            res.status(401).json({message: "Quiz not found"});
        }

        res.status(200).json(quizDoc.data());
    }catch(err){
        res.status(500).json({error: err.message});
    }


}

const getCognitiveChallenges = async(req, res) =>{
    const {exerciseId} = req.params;

    try{

        const cognitiveChallengeDoc = await db.collection("exercises").doc(exerciseId).get();

        if(!cognitiveChallengeDoc){
            res.status(401).message({message: "Cognitive Challenge not found!"});
        }

        res.status(200).json(cognitiveChallengeDoc.data())
    }catch(err){
        res.status(500).json({error: err.message});
    }
    
}

const getDragAndDrop = async (req, res) =>{
    const {exerciseId} = req.params;

    try{
        
        const dragAndDropDoc = await db.collection("exercises").doc(exerciseId).get();

        if(!dragAndDropDoc){
            res.status(401).json({message: "Drag And Drop Challenge is not found"});
        }

        res.status(200).json(dragAndDropDoc.data());
    }catch(err){    
        res.status(500).json({error: err.message })
    }
}

module.exports = {getQuiz, getDragAndDrop, getCognitiveChallenges};