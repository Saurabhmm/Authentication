const { response } = require('express')
const Employee = require('../models/Employee')

// Show the list of Employees
const index = (req,res,next) =>{
    // Employee.find()
    // .then(response =>{
    //     res.json({
    //         response
    //     })
    // })
    // .catch(error =>{
    //     res.json({
    //         message : 'An error Occured!'
    //     })
    // })

    // {pagination} : 
    Employee.paginate({},{page : req.query.page, limit: req.query.limit})
    .then(data=>{
        res.status(200).json({
            data
        })
    })
    .catch(error =>{
        // res.json({
        //     message : "An error Occured: "+error
        // })
        res.status(400).json({
            error
        })
    })
}

// show single employee according to employee id that we will get from the request body
const show = (req,res,next) =>{
        let employeeID = req.body.employeeID
        Employee.findById(employeeID)
        .then(response=>{
            res.json({
                response
            })
        })
        .catch(error =>{
            res.json({
                message : 'An error Occured!'
            })
        })
}

// now we will make a function that will add a employee to our database
const store = (req,res,next)=>{
    let employee = new Employee({
        name : req.body.name,
        designation : req.body.designation,
        email : req.body.email,
        phone : req.body.phone,
        age : req.body.age
    })
    employee.save()
    .then(response=>{
        res.json({
            message : 'Employee Added Successfully!'
        })
    })
    .catch(error=>{
        res.json({
            message : 'An Error Occured!'
        })
    })
}

// now we will create a function to update an employee by using its employee id
const update = (req,res,next) =>{
    let employeeID = req.body.employeeID

    let updatedData = {
        name : req.body.name,
        designation : req.body.designation,
        email : req.body.email,
        phone : req.body.phone,
        age : req.body.age
    }
    Employee.findByIdAndUpdate(employeeID,{$set : updatedData})
    .then(()=>{
        res.json({
            message : 'Employee updated successfully!'
        })
    })
    .catch(error =>{
        res.json({
            message : 'An error Occured!'
        })
    })
}

// now we will make a function to delete an amployee
const destroy = (req,res,next) =>{
    let employeeID = req.body.employeeID
    Employee.findByIdAndRemove(employeeID)
    .then(()=>{
        res.json({
            message : 'Employee deleted successfully!'
        })
    })
    .catch(error=>{
        res.json({
            message : 'An error Occured!'
        })
    })
}

module.exports = {
    index,show,store,update,destroy
}