const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./router/router');
const app = new koa();
const session = require("koa-session2");
const Store = require("./redis/store.js");
const res_api = require('koa.res.api');
const server = require('http').Server(app.callback());
const io = require('socket.io')(server);
const user=[];
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
        console.log(data.username + 'join');
        socket.emit('add_online_people',user);
        io.sockets.emit('add_someone',data);
        user.push(data);
    });
    socket.on('change_face',(data)=>{
        sockets.broadcast.emit('someone_change_face',data);
    });
    socket.on('msg',(data)=>{
        let now = new Date();
        data.time = now.getMonth()+'月'+now.getDay()+'日'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
        io.sockets.emit('get_msg',data);
        console.log(data);
    });
    socket.on('disconnect',()=>{
        console.log(name+' disconnect');
        socket.broadcast.emit('del_someone',name);
        delete client;
    });
});
server.listen(3001);