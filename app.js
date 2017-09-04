const Koa = require('koa');
const app = new Koa();
app.use(()=>{
    console.log(process.env.npm_package_config_port);
});
app.listen(process.env.npm_package_config_port);