const socket = io('http://118.89.197.156');
const [message_box,managerBox,name,message, warn_msg,user_face,user_list,file_btn,choose_file,chat_font,fontBox,write_area,def,kai,song,font_size,sendFile,setFace]=
    ['#message_box','.managerBox','.name','#message','#alert','#user_face','.user_list','#file_btn','#choose_file','#chat_font','.fontBox','.write_area','#default','#kai','#song','#font_size','#sendFile','#setFace'];
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
function add_someone(name,face_url) {
    let htmlData=
        '<li class="fn-clear" data-id="1"><span><img src=' +
        face_url +
        ' width="30" height="30" alt=""/></span><em>' +
        name +
        '</em><small class="online" title="在线"></small></li>';
    $(user_list).append(htmlData);
}
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
function upload_file(action, $upload_input, success_function, error_function, $progress_bar = undefined, async = true) {
    let formData = new FormData;
    for (let i = 0; i < $upload_input[0].files.length; i++)
        formData.append(`file`, $upload_input[0].files[i]);
    $.ajax(
        {
            xhrFields: {
                withCredentials: true
            },
            //url: 'http://127.0.0.1:6666/action='+action,
            url: 'http://118.89.197.156:6666/action='+action,
            method: 'post',
            data: formData,
            processData: false,
            contentType: false,
            async: async,
            success: success_function,
            error: error_function,
            xhr: function ()
            {
                //获取ajaxSettings中的xhr对象，为它的upload属性绑定progress事件的处理函数
                let myXhr = $.ajaxSettings.xhr();
                if ($progress_bar)
                {
                    if (myXhr.upload)
                    { //检查upload属性是否存在
                        myXhr.upload.addEventListener('progress', function (event)//绑定progress事件的回调函数
                        {
                            if (event.lengthComputable)
                            {
                                let percent = event.loaded / event.total * 100;
                                $progress_bar.css('width', percent + '%');
                            }
                        }, false);
                    }
                }
                return myXhr; //xhr对象返回给jQuery使用
            }
        });
}
function prevent(e) {
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
}
function digitInput(e) {
    let c = e.charCode || e.keyCode; //FF、Chrome IE下获取键盘码
    if ((c != 8 && c != 46 && // 8 - Backspace, 46 - Delete
            (c < 37 || c > 40) && // 37 (38) (39) (40) - Left (Up) (Right) (Down) Arrow
            (c < 48 || c > 57) && // 48~57 - 主键盘上的0~9
            (c < 96 || c > 105)) // 96~105 - 小键盘的0~9
        || e.shiftKey) { // Shift键，对应的code为16
        prevent(e); // 阻止事件传播到keypress
    }
}
$(function () {
    $(name).hover(()=>{
            $(managerBox).stop(true, true).slideDown(100);
        }, ()=>{
            $(managerBox).stop(true, true).slideUp(100);
        });
    $(font_size).keydown((e)=> {
        digitInput(e);
    });
    $(font_size).blur(()=>{
        $(write_area).css('font-size',parseInt($(font_size).val()));
    });
    $(def).click(()=>{
        $(write_area).css('font-family','');
    });
    $(song).click(()=>{
        $(write_area).css('font-family','AR PL UMing CN','宋体');
    });
    $(kai).click(()=>{
        $(write_area).css('font-family','AR PL UKai CN','楷体');
    });
    $(message_box).scrollTop($(message_box)[0].scrollHeight + 20);
    $(chat_font).hover(()=>{
            $(fontBox).css('top',$(chat_font).offset().top-90);
            $(fontBox).stop(true, true).slideDown(-100);
        }, ()=>{
            $(fontBox).css('top',$(chat_font).offset().top-90);
            $(fontBox).stop(true, true).slideUp(-100);
        });
    $(file_btn).click(()=>{
        $(sendFile).modal('show');
    });
    $(user_face).click(()=>{
        $(setFace).modal('show');
    });
    $(message).click(()=>{

    });
    ajax('get_info', {}, (response)=>{
            if(response.status.code===1){
                $(user_face).css('src',response.data.face_url);
                $(name).html(response.data.username+'<i class="fontIco down"></i>\n' +
                    '                <ul class="managerBox">\n' +
                    '                    <li><a href="#"><i class="fontIco lock"></i>修改密码</a></li>\n' +
                    '                    <li><a href="#"><i class="fontIco logout"></i>退出登录</a></li>\n' +
                    '                </ul>');
                socket.emit('join',response.data.username);
            }
            else{
                warning_msg(response.status.msg)
            }
        }, (response)=>{
            warning_msg(response.status.msg);
        });

});
// $(document).ready(function(e) {
//     $('#message_box').scrollTop($("#message_box")[0].scrollHeight + 20);
//
//     let fromName = $('#fromName').val();
//     let to_uid   = 0; // 默认为0,表示发送给所有用户
//     let to_name = '';
//     $('.user_list > li').dblclick(function(){
//         to_name = $(this).find('em').text();
//         to_uid   = $(this).attr('data-id');
//         if(to_name === fromName){
//             alert('您不能和自己聊天!');
//             return false;
//         }
//         if(to_name === '所有用户'){
//             $("#toname").val('');
//             $('#chat_type').text('群聊');
//         }else{
//             $("#toname").val(to_uid);
//             $('#chat_type').text('您正和 ' + to_name + ' 聊天');
//         }
//         $(this).addClass('selected').siblings().removeClass('selected');
//         $('#message').focus().attr("placeholder", "您对"+to_name+"说：");
//     });
//
//     $('.sub_but').click(function(event){
//         sendMessage(event, fromName, to_uid, to_name);
//     });
//
//     /*按下按钮或键盘按键*/
//     $("#message").keydown(function(event){
//         var e = window.event || event;
//         var k = e.keyCode || e.which || e.charCode;
//         //按下ctrl+enter发送消息
//         if((event.ctrlKey && (k == 13 || k == 10) )){
//             sendMessage(event, fromName, to_uid, to_name);
//         }
//     });
// });
// function sendMessage(event, from_name, to_uid, to_name){
//     let msg = $("#message").val();
//     if(to_name != ''){
//         msg = '您对 ' + to_name + ' 说： ' + msg;
//     }
//     let time = new Date();
//     let htmlData ='<div class="msg_item fn-clear">'
//         + '<div class="face"><img src="../images/default.png" width="40" height="40"  alt=""/></div>'
//         + '<div class="item_right">'
//         + '<div class="msg own">' + msg + '</div>'
//         + '<div class="name_time">' + from_name + ' · '+time.getMonth()+'</div>'
//         + '</div>'
//         + '</div>';
//     $("#message_box").append(htmlData);
//     $('#message_box').scrollTop($("#message_box")[0].scrollHeight + 20);
//     $("#message").val('');
// }