const collegeModel = require('../models/collegeModel')
const internModel = require('../models/internModel')
const isValid = function (value) {

    if (typeof (value) == undefined || (value) == null ) {

        return false

    }

    if (typeof (value) == 'String' || 'Array' && value.length > 0)

        return true

}
const isValidRequestbody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

let createCollege = async function (req, res) {
    try {
        const requestBody = req.body
        if (!isValidRequestbody(requestBody)) { return res.status(400).send({ satus: false, message: "data is required" }) }
        const { name, fullName, logoLink } = requestBody
        if (!isValid(name)) { return res.status(400).send({ status: false, message: "name is required" }) }
        if (!isValid(fullName)) { return res.status(400).send({ status: false, message: "fullName is required" }) }
        if (!isValid(logoLink)) { return res.status(400).send({ status: false, message: "logoLink is required" }) }
        let duplicateName  = await collegeModel.findOne({name: requestBody.name})
        if(duplicateName){
            return res.status(400).send({ status:false, msg: 'name already exists'})
        }
        let collegeCreated = await collegeModel.create(requestBody)
        res.status(201).send({ status: true, msg: collegeCreated })
    }
    catch (error) { res.status(500).send({ status: false, error: error.message }) }
}
let collegeDetails=async function(req,res){
    try {
        let collegeName = req.query.collegeName;
        
        if (!collegeName) {
           return res.status(400).send({ status: false, msg: 'CollegeName is required' })
        }

        let collegeDetail = await collegeModel.findOne({ name: collegeName , isDeleted: false })

        
         if(!collegeDetail){return res.status(400).send({status:false,msg:"collegedetail not available"})}

         internDetail = await internModel.find({ collegeId: collegeDetail._id, isDeleted: false }).select({ _id: 1, name: 1, email: 1, mobile: 1 })

        let getAllInterns = {
            name: collegeDetail.name,
            fullName: collegeDetail.fullName,
            logoLink: collegeDetail.logoLink,
            interests: internDetail
        }
         
        if (internDetail.length === 0) {
            return res.status(200).send({ status: true, getAllInterns, msg: 'No such Intern' })
        }else{
            res.status(200).send({status: true, data: getAllInterns})
        }

        
    } 
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}




module.exports.createCollege = createCollege
module.exports.collegeDetails=collegeDetails