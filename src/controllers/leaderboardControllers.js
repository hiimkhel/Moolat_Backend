const {db} = require("../firebaseConfig");

const getLeaderboard = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;

    try {
        const childrenSnapshot = await db.collection("children")
            .orderBy("progress.points", "desc")
            .limit(limit)
            .get();

        const leaderboard = childrenSnapshot.docs.map(doc => ({
            name: doc.data().name,
            points: doc.data().progress.points || 0
        }));

        res.status(200).json(leaderboard);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getLeaderboard };