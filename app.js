const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./router/router');
const app = new koa();
const session = require("koa-session2");
const Store = require("./redis/store.js");
const res_api = require('koa.res.api');
const user_socket={};
// support socket.io
const server = require('http').Server(app.callback());
const io = require('socket.io')(server);
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
    socket.on('join',(username)=>{
        user_socket[username] = socket;
        console.log(username + 'join');
        socket.broadcast.emit('add_someone',{username:username});
    });
    socket.on('msg',(data)=>{
        socket.broadcast.emit('get_msg',data);
    });
    socket.on('disconnect',()=>{
        console.log('someone disconnect');
        delete client;
    });
});
server.listen(3000);