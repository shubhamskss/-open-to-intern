const internModel = require('../models/internModel')
const collegeModel = require("../models/collegeModel")
const mongoose = require('mongoose')

const isValid = function (value) {
    if (typeof (value) == 'undefined' || typeof (value) == 'null') {
        return false
    }
    if (typeof (value) == 'String' || 'Array' && value.length > 0)
        return true
}

const isValidRequestBody = function (requestBody) {
    if (Object.keys(requestBody).length > 0)
        return true
}
const isvalidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
const createIntern = async function (req, res) {
    try {
        let requestBody = req.body
        let collegeid=requestBody.collegeId
        if(!isvalidObjectId(collegeid)){return res.status(400).send({satus:false,msg:"incorrect collegeid "})}

        const { name, email, mobile } = requestBody
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, msg: 'data is required' })
        }
        if (!isValid(name)) {
            return res.status(400).send({ status: false, msg: 'name is required' })
        }
        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: 'email is required' })
        }
        

        const isemailAlreadyUsed = await internModel.findOne({ email })
        if (isemailAlreadyUsed) { return res.status(400).send({ status: false, message: 'email is already registred' }) }

        var validateEmail = function (email) {
            var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return re.test(email)
        };
        if (!validateEmail) { return res.status(400).send({ msg: "invalid email" }) }
        if (!isValid(mobile)) {
            return res.status(400).send({ status: false, message: 'mobile number is required' })
        }
        
        if (!(/^([+]\d{2})?\d{10}$/.test(requestBody.mobile))) {
            return res.status(400).send({ status: false, msg: 'please provide a valid moblie Number' })
        }
        let duplicateMobile  = await internModel.findOne({mobile:requestBody.mobile})

        if(duplicateMobile){
            return res.status(400).send({ status:false, msg: 'mobile already exists'})
        }
        let college = await collegeModel.findById(collegeid)
        console.log(college)
        if (!college) { return res.status(400).send({ status: false, msg: "college not found" }) }
    
        
    
        let internCreated = await internModel.create(requestBody)
        res.status(201).send({ status: true, output: internCreated })
    }

    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}
module.exports.createIntern = createIntern