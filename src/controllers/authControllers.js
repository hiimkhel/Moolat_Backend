const { auth, db } = require("../firebaseConfig");

const signUpParent = async(req, res) =>{
    const {email, password, fullName} = req.body;

    try{

        const userExist = await auth.getUserByEmail(email).catch(() => null);

        if(userExist){
            return res.status(401).json({error: "Email already in use"})
        }
        const userRecord = await auth.createUser({
            email,
            password
        });

        await db.collection("parents").doc(userRecord.uid).set({
            fullName,
            email,
            role: "parent",
            createdAt: new Date()
        });
        res.status(201).json({message: `User is created successfully`, user: userRecord});
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

const logoutUser = async (req, res) =>{
    const {uid} = req.body;

    try{
        await auth.revokeRefreshTokens(uid);
        res.status(200).json({message: "Logout successfully"});
    }catch(err){
        res.status(400).json({error: err.message})
    }
};

module.exports = {signUpParent, logoutUser};