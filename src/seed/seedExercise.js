const { db } = require("../firebaseConfig");

const exercises = [
  {
    type: "quiz",
    question: "What is the capital of the Philippines?",
    options: ["Manila", "Cebu", "Davao", "Baguio"],
    correctAnswer: "Manila",
    points: 10,
  },
  {
    type: "drag-and-drop",
    instruction: "Arrange the words to form a sentence",
    items: ["the", "dog", "brown", "jumps"],
    correctOrder: ["the", "brown", "dog", "jumps"],
    points: 15,
  },
  {
    type: "cognitive-challenge",
    instruction: "Match the shapes with their names",
    items: [
      { shape: "🔺", name: "Triangle" },
      { shape: "⚫", name: "Circle" },
    ],
    correctMatches: { "🔺": "Triangle", "⚫": "Circle" },
    points: 20,
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
