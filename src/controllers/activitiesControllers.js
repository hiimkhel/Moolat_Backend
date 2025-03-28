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



const submitActivity = async (req, res) => {
    const { childId, exerciseId, userAnswer } = req.body;

    try {
        const childRef = db.collection("children").doc(childId);
        const childDoc = await childRef.get();

        if (!childDoc.exists) {
            return res.status(404).json({ message: "Child not found" });
        }

        const childData = childDoc.data();
        const activePowerUps = childData.progress.activePowerUps || [];

        const exerciseDoc = await db.collection("exercises").doc(exerciseId).get();
        if (!exerciseDoc.exists) {
            return res.status(404).json({ message: "Exercise not found" });
        }

        const exerciseData = exerciseDoc.data();
        let isCorrect = false;
        const exerciseType = exerciseData.type;

        if (exerciseType === "quiz") {
            isCorrect = userAnswer.toLowerCase() === exerciseData.correctAnswer.toLowerCase();
        } else if (exerciseType === "drag-and-drop") {
            isCorrect = JSON.stringify([...userAnswer].sort()) === JSON.stringify([...exerciseData.correctAnswer].sort());
        } else if (exerciseType === "cognitive-challenge") {
            isCorrect = JSON.stringify(userAnswer) === JSON.stringify(exerciseData.correctAnswer);
        }

        let earnedPoints = isCorrect ? exerciseData.points : 0;
        if (activePowerUps.includes("double_points") && isCorrect) {
            earnedPoints *= 2;
        }

        await childRef.update({
            "progress.points": FieldValue.increment(earnedPoints),
            "progress.exercisesCompleted": FieldValue.arrayUnion(exerciseId),
            "progress.activePowerUps": FieldValue.delete()
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

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {getQuiz, getDragAndDrop, getCognitiveChallenges, submitActivity};