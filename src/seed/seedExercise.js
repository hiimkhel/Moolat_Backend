const { db } = require("../firebaseConfig");

const exercises = [
  {
    type: "quiz",
    question: "Which word is a noun?",
    options: ["Jump", "Dog", "Quickly", "Soft"],
    correctAnswer: "Dog", // Simple word identification
    points: 10,
  },
  {
    type: "quiz",
    question: "What sound does 'C' make in 'Cat'?",
    options: ["S", "K", "M", "T"],
    correctAnswer: "K", // Phonetic learning
    points: 10,
  },
  {
    type: "drag-and-drop",
    instruction: "Arrange the words to form a correct sentence",
    items: ["I", "see", "a", "dog"],
    correctAnswer: ["I", "see", "a", "dog"], // Consistent field name for checking logic
    points: 15,
  },
  {
    type: "drag-and-drop",
    instruction: "Arrange the words to form a complete sentence",
    items: ["The", "sun", "is", "bright"],
    correctAnswer: ["The", "sun", "is", "bright"], // Proper sentence formation
    points: 15,
  },
  {
    type: "cognitive-challenge",
    instruction: "Match the words with their pictures",
    items: [
      { word: "Apple", image: "🍎" },
      { word: "Sun", image: "☀️" },
    ],
    correctAnswer: { "🍎": "Apple", "☀️": "Sun" }, // Easier structure for matching
    points: 20,
  },
  {
    type: "cognitive-challenge",
    instruction: "Match the uppercase letter to its lowercase",
    items: [
      { upper: "A", lower: "a" },
      { upper: "B", lower: "b" },
    ],
    correctAnswer: { "A": "a", "B": "b" }, // Clear direct matching
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
