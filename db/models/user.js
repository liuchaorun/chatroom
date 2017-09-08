const database = require("../database");
const Sequelize = require('sequelize');
module.exports=database.defineModel('user',{
    id: {
        type: Sequelize.BIGINT,
        primaryKey:true,
        autoIncrement:true
    },
    username: {
        type:Sequelize.STRING(255)
    },
    email: {
        type:Sequelize.STRING(255)
    },
    password: {
        type:Sequelize.STRING(32)
    },
    face_url:Sequelize.STRING(255)
});
