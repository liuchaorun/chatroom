const md5 = require('md5');
const router = require('koa-router')();
const koaBody = require('koa-body');
const model = require('../db/model');
const nodemailer = require('nodemailer');
const config = require('../db/config');
const Sequelize = require('sequelize');
const fs = require('fs');
const gm = require('gm');
const bluebird = require('bluebird');
const upDir = '/home/ubuntu/file/';
bluebird.promisifyAll(fs);
let user = model.user;
let sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 3000
    }
});
let transporter = nodemailer.createTransport({
    service: '126',
    auth: {
        user: 'pobooks@126.com',
        pass: 'pobooks126'
    }
});

router.post('/action=sign_up',async(ctx,next)=>{
    let msg,code;
    if(await user.count({where:{username:ctx.request.body.username}})===1){
        msg='该用户已存在';
        code=0;
    }
    else{
        code=1;
        msg='注册成功';
        await user.create({
            username:ctx.request.body.username,
            password:ctx.request.body.password,
            email:ctx.request.body.email
        });
    }
    ctx.api(200,{},{code:code,msg:msg});
    await next();
});

router.post('/action=login',async(ctx,next)=>{
    let code,msg;
    let user_num = await user.count({where: {username: ctx.request.body.username}});
    if (user_num === 0) {
        code= 0;
        msg='该用户不存在！'
    }
    else {
        if (ctx.cookies.get('user', {}) === undefined) {
            let user_person = await user.findOne({where: {username: ctx.request.body.username}});
            if (user_person.password === ctx.request.body.password) {
                ctx.session.custom_username = user_person.username;
                let md = md5(ctx.session.custom_username);
                if(ctx.request.body.remember_me===true) {
                    ctx.cookies.set(
                        'user',
                        md,
                        {
                            domain: '118.89.197.156',  // 写cookie所在的域名
                            path: '/',       // 写cookie所在的路径
                            maxAge: 60 * 60 * 24 * 30 * 1000, // cookie有效时长
                            httpOnly: true,  // 是否只用于http请求中获取
                            overwrite: true  // 是否允许重写
                        }
                    )
                }
                else{
                    ctx.cookies.set(
                        'user',
                        md,
                        {
                            domain: '118.89.197.156',  // 写cookie所在的域名
                            path: '/',       // 写cookie所在的路径
                            httpOnly: true,  // 是否只用于http请求中获取
                            overwrite: true  // 是否允许重写
                        }
                    )
                }
                code=1;
                msg='登录成功！';
            }
            else{
                code=0;
                msg='密码错误！';
            }
        }
        else {
            let user_person = await user.findOne({where: {username: ctx.session.custom_username}});
            code=1;
            msg= '自动登录成功！';
        }
    }
    ctx.api(200,{},{code:code,msg:msg});
    await next();
});

router.post('/action=get_info',async(ctx,next)=>{
    let user_person = await user.findOne({where:{username:ctx.session.custom_username}});
    let data={
      username:user_person.username,
      face_url:user_person.face_url
    };
    ctx.api(200,data,{code:1,msg:'获取信息成功！'});
    await next();
});

router.post('/action=upload_face', koaBody({
    multipart: true,
    formidable: {
        uploadDir: upDir+'faces/'
    }
}), async (ctx, next) => {
    let files = ctx.request.body.files;
    let fileFormat = (files.file.name).split(".");
    let file_name = ctx.session.custom_username+'-'+Date.now() + '.' + fileFormat[fileFormat.length - 1];
    let user_person = await user.findOne({where: {username: ctx.session.custom_username}});
    let p = gm(files.file.path).resize(200,200);
    await p.writeAsync(upDir+'faces/'+file_name);
    await user_person.update({face_url:'http://118.89.197.156:8000/faces/'+file_name});
    fs.unlinkSync(files.file.path);
    ctx.api(200, {face_url:user_person.face_url}, {code: 10000, msg: '上传成功'});
    await next();
});

router.post('/action=upload_file', koaBody({
    multipart: true,
    formidable: {
        uploadDir: upDir+'files/'
    }
}), async (ctx, next) => {
    let files = ctx.request.body.files;
    fs.rename(files.file.path, upDir+'files/' + files.file.name, (err) => {
        console.log(err);
    });
    ctx.api(200, {filename:files.file.name}, {code: 10000, msg: '上传成功'});
    await next();
});

module.exports = router;