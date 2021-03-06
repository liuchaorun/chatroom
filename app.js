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
const online_user={};
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
            console.log(name + 'join');
            socket.emit('add_online_people',user);
            io.sockets.emit('add_someone',data);
            user.name=data;
            online_user.name = socket;
        }
        else{
            online_user.name.emit('other_login',{});
            online_user.name = socket;
            user.name = data;
            console.log(name + 'rejoin');
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
        delete user.name;
        delete online_user.name;
        delete client;
    });
});
server.listen(3001);