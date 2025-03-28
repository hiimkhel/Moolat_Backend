const {db, collection, FieldValue} = require("../firebaseConfig");


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


const submitActivity = async(req, res) =>{
    const {childId, exerciseId, userAnswer} = req.body;

    try{
        const exerciseDoc = await db.collection("exercises").doc(exerciseId).get();

        if(!exerciseDoc){
            res.status(401).json({message: `Exercise ${exerciseId} not found`});
        }

        const exerciseData = await exerciseDoc.data();
        let isCorrect = false;
        const exerciseType = exerciseData.type;

        if(exerciseType === "quiz"){
            isCorrect = userAnswer.toLowerCase() === exerciseData.correctAnswer.toLowerCase();
        }
        else if(exerciseType == "drag-and-drop"){
            const sortedUserAnswer = [...userAnswer].sort();
            const sortedCorrectAnswer = [...exerciseData.correctAnswer].sort();
            isCorrect = JSON.stringify(sortedUserAnswer) === JSON.stringify(sortedCorrectAnswer);
        }
        else if(exerciseType === "cognitive-challenge"){
            isCorrect = JSON.stringify(userAnswer) === JSON.stringify(exerciseData.correctAnswer);
        }

        const earnedPoints = isCorrect ? exerciseData.points : 0;

        const childRef = db.collection("children").doc(childId);
        await childRef.update({
            "progress.points": FieldValue.increment(earnedPoints),
            "progress.exercisesCompleted": FieldValue.arrayUnion(exerciseId)
        });

        res.status(201).json({
            message: "Exercise checked",
            exerciseId,
            exerciseType,
            userAnswer,
            correctAnswer: exerciseData.correctAnswer,
            isCorrect,
            earnedPoints
        });
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

module.exports = {getQuiz, getDragAndDrop, getCognitiveChallenges, submitActivity};