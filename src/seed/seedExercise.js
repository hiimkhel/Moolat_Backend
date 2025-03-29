const { db } = require("../firebaseConfig");

const exercises = [
  {
    type: "drag-and-drop",
    instruction: "Spell the animal in the image",
    items:["O", "G", "D"],
    correctAnswer: ["D", "O", "G"],
    points: 5
  },
  {
    type: "drag-and-drop",
    instruction: "Spell the animal in the image",
    items:["A", "C", "T"],
    correctAnswer: ["C", "A", "T"],
    points: 5
  },
  {
    type: "cognitive-challenge",
    instruction: "Expression Match",
    items: ["Walk Away", "Tell an Adult"],
    correctAnswer: "Tell an Adult",
    points: 5
  },
  {
    type: "cognitive-challenge",
    instruction: "Expression Match",
    items: ["Walk Away", "Tell an Adult"],
    correctAnswer: "Tell an Adult",
    points: 5
  },
  {
    type: "quiz",
    instruction: "What is a noun",
    items: ["run", "elephant", "talk", "quickly"],
    correctAnswer: "elephant",
    points: 5
  }, 
  {
    type: "quiz",
    instruction: "What is a noun",
    items: ["think", "beautiful", "tree", "loud"],
    correctAnswer: "tree",
    points: 5
  },
  {
    type: "quiz",
    instruction: "What is a noun",
    items: ["jump", "apple", "quickly", "bright"],
    correctAnswer: "apple",
    points: 5
  },
  {
    type: "quiz",
    instruction: "What is a noun",
    items: ["walking", "chair", "happy", "soft"],
    correctAnswer: "chair",
    points: 5
  },
  {
    type: "cognitive-challenge",
    instruction: "What is the correct punctuation mark?",
    items: [".", ",", "!", "?"],
    correctAnswer: "!",
    points: 5
  },
  
];

const seedDatabase = async () => {
  try {
    const batch = db.batch();
    exercises.forEach((exercise) => {
      const docRef = db.collection("exercises").doc();
      batch.set(docRef, exercise);
    });
    await batch.commit();
    console.log("Exercises seeded successfully!");
  } catch (error) {
    console.error("Error seeding exercises:", error);
  }
};

seedDatabase();
