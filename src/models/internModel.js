const mongoose=require('mongoose')
let internSchema=new mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,

            
            
            
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    mobile:{
        type:String,
        unique:true,
        required:true,
        pattern : "1?\W*([2-9][0-8][0-9])\W*([2-9][0-9]{2})\W*([0-9]{4})(\se?x?t?(\d*))?",
    },
    collegeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Group54College",
        
    },
    isDeleted:{
        type:Boolean,
        default:false
    }

})
module.exports=mongoose.model('Group54Intern',internSchema)