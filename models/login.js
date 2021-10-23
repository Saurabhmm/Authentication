const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mongoosePaginate = require('mongoose-paginate-v2')  //
const userSchema = new Schema({
  
    person :{
        type : String},
    nickName : {
        type : String,
        primaryKey: true, },
    userName : {
        type : String },
    email : {
        type : String},
    phone : {
        type : String },
    password : {
        type : String },
    message : {
        type : String },
    isUserLogin :{
        type : Boolean },
    isAdminLogin :{
        type : Boolean},
    isOwnerLogin :{
        type : Boolean},
    secretCode : {
        type : String}
},{timestamps : true})

userSchema.plugin(mongoosePaginate)  //
const Login = mongoose.model('Login',userSchema)
module.exports = Login