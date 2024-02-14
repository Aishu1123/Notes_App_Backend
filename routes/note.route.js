const express = require("express");
const { NoteModel } = require("../model/note.model");
const {auth} = require("../middleware/auth.middleware")

const noteRouter = express.Router()

// Add Notes
noteRouter.post("/", auth, async (req, res) => {
    try {
      const note = new NoteModel(req.body);
      await note.save();
      res.status(200).send({ msg: "New Note Added." });
    } catch (err) {
      console.log("Error:", err);
      res.status(400).send({ msg: "Bad Request." });
    }
  });

//   GET the notes opd logged in user can read his/her notes only 
noteRouter.get("/",auth,async(req,res)=>{
    try{
    //  userid in notes===userid who is making the request
        const notes =await NoteModel.find({userID:req.body.userID})
        res.status(200).send({notes})
    }catch(err){
        res.status(400).send({"error":err})
    }
})


// Update notes
noteRouter.patch("/:noteID" ,auth,async(req,res)=>{
    const{noteID}=req.params
    try{
      const note=await NoteModel.findOne({ _id:noteID })
      if(note.userID === req.body.userID){
        await NoteModel.findByIdAndUpdate({_id:noteID},req.body)
        res.status(200).send({"msg":`The note with ID:${noteID} has been updated.`})
      }else{
        res.status(400).send({"msg":"You are not authorised."})
      }
    }catch(err){
        res.status(400).send({"error":err})
    }
})


// Delete notes
noteRouter.delete("/:noteID" ,auth,async(req,res)=>{
    const{noteID}=req.params
    try{
      const note=await NoteModel.findOne({_id:noteID})
      if(note.userID === req.body.userID){
        await NoteModel.findByIdAndDelete({_id:noteID})
        res.status(200).send({"msg":`The note with ID:${noteID} has been deleted.`})
      }else{
        res.status(400).send({"msg":"You are not authorised."})
      }
    }catch(err){
        res.status(400).send({"error":err})
    }
})
module.exports={
    noteRouter
}