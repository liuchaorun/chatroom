const [EMAIL_REG, PASSWORD_REG,] =
    [
        /^[A-z0-9]+@([A-z0-9]+\.[a-z]+)+$/,
        /^[A-z0-9_]{1,16}$/,
    ];
const [warn_msg,btn,email,verify_code,password,rePassword]=['#alert','#btn','#email','#verify_code','#password','#repassword'];
function warning_msg(msg) {
    $(warn_msg)[0].innerText=msg;
    $(warn_msg).css('top','50%');
    setTimeout(
        ()=>{
            $(warn_msg).css('top','-50%');
        },
        1000
    );
}
function ajax(action,data,success_function,fail_function) {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        timeout: 2000,
        dataType: 'json',
        //url: 'http://127.0.0.1:3001/action='+action,
        url: 'http://118.89.197.156:3001/action='+action,
        method: 'post',
        data: JSON.stringify(data),
        success: success_function,
        error: fail_function,
    });
}
$(()=>{
    $(btn).click(()=>{
        if($(btn).val()==='获取验证码'){
            let data={};
            data.email = $(email).val();
            if(EMAIL_REG.test(data.email)===true){
                ajax('get_verify',data,(response)=>{
                    if(response.status.code===1) {
                        warning_msg(response.status.msg);
                        $(btn).val('确认修改');
                    }
                    else{
                        warning_msg(response.status.msg);
                    }
                },(response)=>{
                    warning_msg(response.status.msg);
                });
            }
            else{
                warning_msg('邮箱格式错误');
            }
        }
        else{
            if(PASSWORD_REG.test($(password).val())===true){
                if($(password).val()===$(rePassword).val()){
                    let data={
                        email:$(email).val(),
                        verify_code:$(verify_code).val(),
                        password:$(password).val()
                    };
                    ajax('change_password',data,(response)=>{
                        if(response.status.code===1){
                            location.href='../index.html';
                            warning_msg(response.status.msg);
                        }
                    },(response)=>{
                        warning_msg(response.status.msg);
                    });
                }
                else{
                    warning_msg('两次密码输入不一致！');
                }
            }
            else{
                warning_msg('密码格式错误！');
            }
        }
    });
});