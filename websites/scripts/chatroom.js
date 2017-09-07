const [message_box,managerBox,name,message,warn_msg,user_face,user_list]=['#message_box','.managerBox','.name','#message','#alert','#user_face','.user_list'];
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
        url: 'http://127.0.0.1:3000/action='+action,
        method: 'post',
        data: JSON.stringify(data),
        success: success_function,
        error: fail_function,
    });
}
$(document).ready(()=>{
    $(message_box).scrollTop($(message_box)[0].scrollHeight + 20);
    $(name).hover(
        function(){
            $(managerBox).stop(true, true).slideDown(100);
        },
        function(){
            $(managerBox).stop(true, true).slideUp(100);
        }
    );
    ajax(
        'get_info',
        {},
        (response)=>{
            if(response.status.code===0){
                $(user_face).css('src',response.data.user_face_url);

            }
            else{
                warning_msg(response.status.msg)
            }
        },
        (response)=>{
            warning_msg(response.status.msg);
        }
    )
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