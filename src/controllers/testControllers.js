const {db, collection} = require("../firebaseConfig");


const submitTest = async (req, res) =>{
    const {childId, answers} = req.body;  //`answers` is an array of {exerciseId, userAnswer}

    try{
        let totalScore = 0;
        let results = [];

        for(const{exerciseId, userAnswer} of answers){
            const exerciseDoc = await db.collection("exercises").doc(exerciseId).get();

            if(!exerciseDoc){
                res.status(401).json({message: `Exercise ${exerciseId} is not found`});
            }
            const exerciseData = exerciseDoc.data();
            const isCorrect = exerciseData.correctAnswer === userAnswer;
            const earnedPoints = isCorrect ? exerciseData.points : 0;
            
            totalScore += earnedPoints;
            results.push({
                exerciseId,
                userAnswer,
                correctAnswer: exerciseData.correctAnswer,
                isCorrect,
                earnedPoints
            });

        }

           
            const testResultsRef = await db.collection("test_assessments").doc();
            await testResultsRef.set({
                childId,
                results,
                totalScore,
                timestamp: new Date()
            });
            res.status(201).json({message: "Exercise Submitted Successfully", totalScore, results});
        
    }catch(err){
        res.status(400).json({error: err.message});
    }
}


const getTest = async (req, res) =>{

    const { childId } = req.params;

    try {
        const childDoc = await db.collection("children").doc(childId).get();

        if (!childDoc.exists) {
            return res.status(404).json({ message: "Child not found" });
        }

        const childData = childDoc.data();
        const completedExercises = Array.isArray(childData.progress.exercisesCompleted) ? childData.progress.exercisesCompleted : [];

        if (completedExercises.length < 5) {
            return res.status(400).json({ message: "Not enough completed exercises for an assessment" });
        }
        // Get the last 5 completed exercise IDs
        const lastFiveExercises = completedExercises.slice(-5);

         let questions = [];
        for (const exerciseId of lastFiveExercises) {
            const exerciseDoc = await db.collection("exercises").doc(exerciseId.toString()).get();
            if (exerciseDoc.exists) {
                const exercise = exerciseDoc.data();
                questions.push({
                    exerciseId,
                    question: exercise.question,
                    options: exercise.options || null,
                    points: exercise.points,
                });
            }
        } 
       
        //hardcode (temporary because i dont know how yet)
        /* const questions = [
            {
                exerciseId: "1",
                question: "Which word is a noun?",
                options: ["Jump", "Dog", "Quickly", "Soft"],
                correctAnswer: "Dog",
                points: 10
            },
            {
                exerciseId: "2",
                question: "What sound does 'C' make in 'Cat'?",
                options: ["S", "K", "M", "T"],
                correctAnswer: "K",
                points: 10
            },
            {
                exerciseId: "3",
                instruction: "Arrange the words to form a correct sentence",
                items: ["I", "see", "a", "dog"],
                correctAnswer: ["I", "see", "a", "dog"],
                points: 15
            },
            {
                exerciseId: "4",
                instruction: "Match the words with their pictures",
                items: [
                    { word: "Apple", image: "🍎" },
                    { word: "Sun", image: "☀️" }
                ],
                correctAnswer: { "🍎": "Apple", "☀️": "Sun" },
                points: 20
            },
            {
                exerciseId: "5",
                instruction: "Match the uppercase letter to its lowercase",
                items: [
                    { upper: "A", lower: "a" },
                    { upper: "B", lower: "b" }
                ],
                correctAnswer: { "A": "a", "B": "b" },
                points: 20
            }
        ]; */
        
        return res.status(200).json({
            message: "Test assessment compiled successfully",
            questions
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getChildTestResults = async (req,res )=>{
    const {childId} = req.params;

    try{
        const testsSnapshot = await db.collection("test_assessments")
        .where("childId", "==", childId)
        .orderBy("timestamp", "desc")
        .get();

        if(testsSnapshot.empty){
            return res.status(404).json({messsage: "No test results found for this user"});
        }

        let totalTests = 0;
        let totalScore = 0;
        let latestTest = null;

        const testResults = testsSnapshot.docs.map((doc) =>{
            const testData = doc.data();
            totalTests += 1;
            totalScore += testData.totalScore;

            if(!latestTest){
                latestTest = {testId: doc.id, ...testData};
            }

            return{
                testId: doc.id,
                totalScore: testData.totalScore,
                totalQuestions: testData.totalQuestions,
                correctAnswer: testData.correctAnswer,
                wrongAnswer: testData.totalQuestions - testData.correctAnswer,
                dateTaken: testData.dateTaken.toDate(),
                answers: testData.answers,
            };
        });

        const averageScore = totalScore / totalTests;

        return res.status(200).json({
            childId,
            totalTestTaken: totalTests,
            latestTest,
            averageScore,
            allTestResults: testResults
        });
    }catch(err){
        return res.status(500).json({error: err.message});
    }
}

module.exports = {submitTest, getChildTestResults, getTest};