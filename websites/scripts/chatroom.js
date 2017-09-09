const socket = io('http://118.89.197.156:3001');
const [message_box,managerBox,name,message, warn_msg,user_face,user_list,file_btn,chat_font,fontBox,write_area,def,kai,song,font_size,sendFile,setFace,sub_btn,upload_file,upload_face]=
    ['#message_box','.managerBox','.name','#message','#alert','#user_face','.user_list','#file_btn','#chat_font','.fontBox','.write_area','#default','#kai','#song','#font_size','#sendFile','#setFace','.sub_btn','#upload_file','#upload_face'];
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
        '<li class="fn-clear" data-id="1" id=' +
        name+
        '><span><img src=' +
        face_url +
        ' width="30" height="30" alt=""/></span><em>' +
        name +
        '</em><small class="online" title="在线"></small></li>';
    $(user_list).append(htmlData);
}
function send_msg(username,face_url) {
    let msg = $(message).val();
    let data ={
        type:'msg',
        username:username,
        face_url:face_url,
        msg:msg,
        font:localStorage.getItem('font'),
        font_size:parseInt(localStorage.getItem('font_size'))
    };
    socket.emit('msg',data);
    $(message).val('');
}
function add_msg(data) {
    let style = `style="font-family:`+data.font+`;font-size:`+data.font_size+`px;"`;
    let html_data;
    if(data.type==='msg'){
        console.log(data.time.getSeconds);
        html_data ='<div class="msg_item fn-clear">'
            + '<div class="face"><img src=' +data.face_url
            + ' width="40" height="40"  alt=""/></div>'
            + '<div class="item_right">'
            + '<div class="msg own"' +style
            + '>' + data.msg + '</div>'
            + '<div class="name_time">' + data.username
            + ' · '+data.time
            + '</div></div></div>';
    }
    else{
        let src = `src="http://118.89.197.156:8000/`+data.msg;
        html_data ='<div class="msg_item fn-clear">'
            + '<div class="face"><img src=' +data.face_url
            + ' width="40" height="40"  alt=""/></div>'
            + '<div class="item_right">'
            + '<div class="msg own"'
            + '><a'+src+
            + '>' +data.msg+
            + '</a></div>'
            + '<div class="name_time">' + data.username
            + ' · '+data.time
            + '</div></div></div>';
    }
    $(message_box).append(html_data);
    $(message_box).scrollTop($(message_box)[0].scrollHeight + 20);
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
function upload(action, $upload_input, success_function, error_function, $progress_bar = undefined, async = true) {
    let formData = new FormData;
    for (let i = 0; i < $upload_input[0].files.length; i++)
        formData.append(`file`, $upload_input[0].files[i]);
    $.ajax(
        {
            xhrFields: {
                withCredentials: true
            },
            //url: 'http://127.0.0.1:3001/action='+action,
            url: 'http://118.89.197.156:3001/action='+action,
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
        if(parseInt($(font_size).val())>32){
            $(font_size).val('');
        }
        else{
            $(write_area).css('font-size',parseInt($(font_size).val()));
            localStorage.setItem('font_size',$(font_size).val());
        }
    });
    $(def).click(()=>{
        $(write_area).css('font-family','');
        localStorage.setItem('font','');
    });
    $(song).click(()=>{
        $(write_area).css('font-family','AR PL UMing CN','宋体');
        localStorage.setItem('font','\'AR PL UMing CN\',\'宋体\'');
    });
    $(kai).click(()=>{
        $(write_area).css('font-family','AR PL UKai CN','楷体');
        localStorage.setItem('font','\'AR PL UKai CN\',\'楷体\'');
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
    $(sub_btn).click(()=>{
        send_msg(localStorage.getItem('username'),localStorage.getItem('face_url'));
    });
    $(message).keydown((event)=>{
        let e = window.event || event;
        let k = e.keyCode || e.which || e.charCode;
        //按下ctrl+enter发送消息
        if((event.ctrlKey && (k === 13 || k === 10) )){
            send_msg(localStorage.getItem('username'),localStorage.getItem('face_url'));
        }
    });
    $(upload_file).click(()=>{
        upload('upload_file',$('#upload_input_file'),(response)=>{
            $(sendFile).modal('hide');
            let data={
                type:'file',
                msg:response.data.filename,
                username:localStorage.getItem('username'),
                face_url:localStorage.getItem('face_url')
            };
            socket.emit('msg',data);
        },()=>{

        },$('#upload_file_process'));
    });
    ajax('get_info', {}, (response)=>{
            if(response.status.code===1){
                $(user_face).css('src',response.data.face_url);
                $(name).html(response.data.username+'<i class="fontIco down"></i>\n' +
                    '                <ul class="managerBox">\n' +
                    '                    <li><a href="#"><i class="fontIco lock"></i>修改密码</a></li>\n' +
                    '                    <li><a href="#"><i class="fontIco logout"></i>退出登录</a></li>\n' +
                    '                </ul>');
                let data={
                    username:response.data.username,
                    face_url:response.data.face_url
                };
                localStorage.setItem('username',data.username);
                localStorage.setItem('face_url',data.face_url);
                socket.emit('join',data);
            }
            else{
                warning_msg(response.status.msg)
            }
        }, (response)=>{
            warning_msg(response.status.msg);
        });
});
socket.on('add_someone',(data)=>{
    add_someone(data.username,data.face_url);
});
socket.on('get_msg',(data)=>{
    add_msg(data);
});
socket.on('del_someone',(username)=>{
    $('#'+username).remove();
});
socket.on('add_online_people',(user)=>{
    for(let i of user){
        add_someone(i.username,i.face_url);
    }
});