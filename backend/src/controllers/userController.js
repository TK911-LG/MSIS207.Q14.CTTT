export const authMe = async (req,res) =>{
    try {
        //Get user from req
        const user = req.user;
        return res.status(200).json({message: 'User info', user});
    } catch (error) {
        console.error('Error in authMe controller',error);
        res.status(500).json({message: 'System error'});
    }
}