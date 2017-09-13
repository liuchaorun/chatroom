const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./router/router');
const app = new koa();
const session = require("koa-session2");
const Store = require("./redis/store.js");
const res_api = require('koa.res.api');
const server = require('http').Server(app.callback());
const io = require('socket.io')(server);
const user={};
app.use(bodyParser());
app.use(res_api());
app.use(session({
    store: new Store()
}));
app.use(require('koa-static')(__dirname + '/websites'));
app
    .use(router.routes())
    .use(router.allowedMethods());
io.on('connection',(socket)=>{
    let name;
    socket.on('join',(data)=>{
        name=data.username;
        if(user.name===undefined){
            data.usocket = socket;
            console.log(data.username + 'join');
            socket.emit('add_online_people',user);
            io.sockets.emit('add_someone',data);
            user[data.username]=data;
        }
        else{
            user[name].socket.emit('other_login',{});
            data.usocket = socket;
            user[data.username]=data;
            console.log(data.username + 'rejoin');
            socket.emit('add_online_people',user);
        }
    });
    socket.on('change_face',(data)=>{
        socket.broadcast.emit('someone_change_face',data);
    });
    socket.on('msg',(data)=>{
        let now = new Date();
        data.time = (now.getMonth()+1)+'月'+now.getDate()+'日'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
        io.sockets.emit('get_msg',data);
        console.log(data);
    });
    socket.on('disconnect',()=>{
        console.log(name+' disconnect');
        io.sockets.emit('del_someone',name);
        delete user[name];
        delete client;
    });
});
server.listen(3001);