const {db} = require("../firebaseConfig");

const updateChildrenData = async () =>{
    try{
        const childrenSnapshot = await db.collection("children").get();

        const batch = db.batch();

        childrenSnapshot.forEach((doc) => {
            const childData = doc.data();
            const progress = childData.progress || {};

            if (typeof progress.exercisesCompleted === "number") {
                batch.update(doc.ref, {
                    "progress.exercisesCompleted": []
                });
            }
        });

        await batch.commit();
        console.log("Success");


    }catch(err){
        console.log("Palpak", err);
    }

}
updateChildrenData();