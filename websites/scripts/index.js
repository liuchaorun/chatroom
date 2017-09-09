const [USERNAME_REG, EMAIL_REG, PASSWORD_REG,] =
    [
        /^[A-z0-9]{1,16}$/,
        /^[A-z0-9]+@([A-z0-9]+\.[a-z]+)+$/,
        /^[A-z0-9_]{1,16}$/,
    ];
function ajax(action,data,success_function,fail_function) {
    $.ajax({
    xhrFields: {
        withCredentials: true
    },
    contentType: 'application/json',
    timeout: 2000,
    dataType: 'json',
        //url: 'http://127.0.0.1:6666/action='+action,
        url: 'http://118.89.197.156:6666/action='+action,
    method: 'post',
    data: JSON.stringify(data),
    success: success_function,
    error: fail_function,
    });
}
$(()=> {
    const signUp = '#signUpBtn';
    const login = '#loginBtn';
    $(signUp).click((event)=>{
        let username = '#username';
        let email = '#email';
        let password = '#password';
        let rePassword = '#rePassword';
        let flag = 0;
        if(USERNAME_REG.test($(username).val())===false){
            alert('用户名错误！请输入1到16位数字或字母');
            flag=1;
        }
        if(EMAIL_REG.test($(email).val())===false){
            alert('邮箱错误！请输入正确的邮箱！');
            flag=1;
        }
        if(PASSWORD_REG.test($(password).val())===false){
            alert('请输入1到16位字母或数字！');
            flag=1;
        }
        if($(password).val()!==$(rePassword).val()){
            alert('两次输入密码不一致！');
            flag=1;
        }
        if(flag===0){
            let data={
                username:$(username).val(),
                email:$(email).val(),
                password:$(password).val()
            };
            ajax(
                'sign_up',
                data,
                (response)=>{
                    if(response.status.code===1){
                        alert('注册成功！');
                    }
                    else{
                        alert(response.status.msg);
                    }
                },
                (response)=>{
                    alert(response.status.msg);
                }
            )
        }
    });
    $(login).click((event)=>{
        let [username,password,remember_me,flag] = ['#login_username','#login_password','#login_brand',0];
        if(USERNAME_REG.test($(username).val())===false){
            alert('用户名错误！请输入1到16位数字或字母');
            flag=1;
        }
        if(PASSWORD_REG.test($(password).val())===false){
            alert('请输入1到16位字母或数字！');
            flag=1;
        }
        if(flag===0){
            let data = {
              username:$(username).val(),
              password:$(password).val(),
              remember_me:$(remember_me)[0].checked
            };
            ajax(
                'login',
                data,
                (response)=>{
                    if(response.status.code===1){
                        location.href='./html/chatroom.html';
                    }
                    else{
                        alert(response.status.msg);
                    }
                },
                (response)=>{
                    alert(response.status.msg);
                }
            )
        }
    });
});