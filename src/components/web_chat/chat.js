var moreActionsuploadChat = '';

var chat_messages = '';

var chat_messagebar = '';

var global_chat_page_show_typing = 0;

var global_send_msg_scroll = 0;

var userChatIdGlobal = '';

var URLAPIChat = 'https://vigyapn.com/app/admin/libraryPHP/';

var URLAPIBack = 'https://vigyapn.com/app/admin/libraryPHP/';

var URLAPIWEB = 'https://vigyapn.com/app/admin/libraryPHP/';

var URLAPI_img_main = 'https://dn6u5zzah0qd8.cloudfront.net';

var URLAPI_img_200X200 = URLAPI_img_main + '/';

// console.log('URLAPI_img_200X200',URLAPI_img_200X200);

var error_img_books = "'https://vigyapn.com/app/admin/assets/images/placeholder.png'";

var error_img_slider = "'https://vigyapn.com/app/admin/assets/images/placeholder.png'";
var pdf_img_slider = "'https://vigyapn.com/app/admin/assets/images/pdf.png'";
var audio_img_slider = "'https://vigyapn.com/app/admin/assets/images/audio_img.jpg'";

var error_img_user = "'https://vigyapn.com/app/admin/assets/images/placeholder.png'";

var error_img_image = "'https://vigyapn.com/app/admin/assets/images/placeholder.png'";

var AppName = 'Vigyapn App';

var other_user_id_global = 0;

$(document).on('page:beforein', '.page[data-name="chat"]', function (e) {
    // $('#noHideKeyboard').removeClass("keyboardopen");

    $$('.ac-2').on('click', function () {
        ac2.open();
    });

    ac2 = app.actions.create({
        buttons: [
            {
                text: 'Clear Chat',

                bold: true,

                onClick: clearChatSingle
            },

            {
                text: 'Report User',

                onClick: function () {
                    reportUser();
                }
            },

            {
                text: 'Cancel',

                color: 'red'
            }
        ]
    });

    var other_user_id = app.view.main.router.currentRoute.params.other_user_id;

    var order_number = app.view.main.router.currentRoute.params.order_number;

    var inbox_count = FirebaseUserJson.findIndex((x) => x.user_id == other_user_id);

    consoleProvider.log('chat name inbox count before', inbox_count);

    if (inbox_count >= 0) {
        consoleProvider.log('chat name inbox count', inbox_count);

        var jsonData = FirebaseUserJson[inbox_count];

        consoleProvider.log('jsonData', jsonData);

        if (jsonData.name != 'NA') {
            $('#chat_name').html('').html(jsonData.name);
        } else {
            $('#chat_name').html('chat');
        }
    } else {
        $('#chat_name').html('chat');
    }

    setcameraOpen();

    setChatRoomIdUpdateAndMsgCount(); // 1. set message count 0 and update chatRoomIdUpdate

    show_user_message_chat();

    send_messgae();
});

//create or update user at firebase

function firebaseUserCreate() {
    consoleProvider.log('firebaseUserCreate');

    var user_arr = userProvider.getMe();

    var user_id = user_arr.user_id;

    var name = user_arr.name;

    var notification_status = user_arr.notification_status;

    var user_type = user_arr.user_type;

    var email = user_arr.email;

    var player_id = localStorage.getItem('player_id');

    console.log('player_id', player_id);

    var image = user_arr.image;

    var id = 'u_' + user_id;

    var jsonUserDataMe = {
        name: name,

        email: email,

        image: image,

        onlineStatus: 'true',

        player_id: player_id,

        user_id: Number(user_id),

        user_type: user_type,

        notification_status: notification_status,

        chat_room_id: 'no'
    };

    CreateUser(id, jsonUserDataMe);
}

//show chat message

function btnSearchUserChat(event) {
    console.log('btnSearchUserChat');

    var name = $(event).val();

    console.log('name', name);

    var user_type_me = userProvider.getMe().user_type;

    if (name != '') {
        $('#msg_list_search_user').html('');

        console.log('FirebaseUserJson', FirebaseUserJson);

        if (FirebaseUserJson.length > 0) {
            $.each(FirebaseUserJson, function (index, keyValue) {
                if (keyValue.name.search(new RegExp(name, 'i')) != -1) {
                    console.log('keyValue', keyValue);

                    $('#msg_list_search').show();

                    $('#msg_list_inbox').hide();

                    var user_type = keyValue.user_type;

                    var user_id = keyValue.user_id;

                    var onlineStatus = keyValue.onlineStatus;

                    var onlineStatusHtml = '';

                    if (onlineStatus == 'true') {
                        onlineStatusHtml = '<span class="msg-status"></span>';
                    }

                    if (user_id != undefined) {
                        if (user_type_me == 1) {
                            if (user_type == 3) {
                                var htmlData =
                                    '<li class="" onclick="btnStartChatClick(' +
                                    user_id +
                                    ')">' +
                                    '<div class="usr-msg-details">' +
                                    '<div class="usr-ms-img">' +
                                    '<img src="' +
                                    URLAPI_img_200X200 +
                                    keyValue.image +
                                    '" onerror="this.src=' +
                                    error_img_user +
                                    ';" >' +
                                    onlineStatusHtml +
                                    '</div>' +
                                    '<div class="usr-mg-info">' +
                                    '<h3>' +
                                    keyValue.name +
                                    '</h3>' +
                                    '<p>' +
                                    keyValue.email +
                                    '</p>' +
                                    '</div>' +
                                    '</div>' +
                                    '</li>';

                                $('#msg_list_search_user').append(htmlData);
                            }
                        } else if (user_type_me == 3) {
                            if (user_type == 1) {
                                var htmlData =
                                    '<li class="" onclick="btnStartChatClick(' +
                                    user_id +
                                    ')">' +
                                    '<div class="usr-msg-details">' +
                                    '<div class="usr-ms-img">' +
                                    '<img src="' +
                                    URLAPI_img_200X200 +
                                    keyValue.image +
                                    '" onerror="this.src=' +
                                    error_img_user +
                                    ';" >' +
                                    onlineStatusHtml +
                                    '</div>' +
                                    '<div class="usr-mg-info">' +
                                    '<h3>' +
                                    keyValue.name +
                                    '</h3>' +
                                    '<p>' +
                                    keyValue.email +
                                    '</p>' +
                                    '</div>' +
                                    '</div>' +
                                    '</li>';

                                $('#msg_list_search_user').append(htmlData);
                            }
                        }
                    }
                }
            });
        }
    } else {
        $('#msg_list_search').hide();

        $('#msg_list_inbox').show();
    }
}

var scroll_flag = true;

var update_firebase_check = 0;

function btnStartChatClick(other_user_id) {
    console.log('btnStartChatClick', other_user_id);

    // localStorage.removeItem("chat_other_user_id");

    other_user_id_global = other_user_id;

    var user_data_other_id = FirebaseInboxJson.findIndex((x) => x.user_id == other_user_id);

    if (user_data_other_id >= 0) {
        var jsonDataInbox = FirebaseInboxJson[user_data_other_id];

        consoleProvider.log('jsonDataInbox', jsonDataInbox);

        if (jsonDataInbox.block_status == 'yes') {
            $('#chat_box_div').hide();

            $('#chat_box_div_block').show();
        } else {
            $('#chat_box_div').show();

            $('#chat_box_div_block').hide();
        }
    } else {
        $('#chat_box_div').show();

        $('#chat_box_div_block').hide();
    }

    $('.chat_header_my').css('visibility', 'unset');

    var inbox_count = FirebaseUserJson.findIndex((x) => x.user_id == other_user_id);

    consoleProvider.log('chat name inbox count before', inbox_count);

    if (inbox_count >= 0) {
        // $('#side_div_show').show();

        $('#side_div_show').css('display', 'block');

        consoleProvider.log('chat name inbox count', inbox_count);

        var jsonData = FirebaseUserJson[inbox_count];

        consoleProvider.log('jsonData', jsonData);

        $('#chat_image').attr('src', URLAPI_img_200X200 + jsonData.image);

        $('#chat_name').text(jsonData.name);

        $('#chat_email').text(jsonData.email);

        var onlineStatus = jsonData.onlineStatus;

        if (onlineStatus == 'true') {
            $('#chat_online').text('Online');
        } else {
            $('#chat_online').text('Offline');
        }

        global_chat_page_show_typing = 1;

        $('.mCSB_1_container').on('scroll', function () {
            //alert("helo scroll");

            var scrollTop = $(this).scrollTop();

            consoleProvider.log('scrollTop', scrollTop);

            consoleProvider.log('scrollHeight', this.scrollHeight);

            //end scroll in chat

            if (scrollTop + $(this).innerHeight() >= this.scrollHeight) {
                //consoleProvider.log('end reached');

                scroll_flag = true;
            } else if (scrollTop <= 0) {
                scroll_flag = false;

                //consoleProvider.log('Top reached');
            } else {
                scroll_flag = false;

                //consoleProvider.log('scrolling');
            }

            consoleProvider.log('scroll_flag', scroll_flag);
        });

        chatBackBtnOnclick();

        $('#div_chat_inbox_room').show();

        var user_id = userProvider.getMe().user_id;

        var userChatId = 'u_' + user_id + '__u_' + other_user_id;

        if (userChatIdGlobal == '') {
            userChatIdGlobal = userChatId;
        }

        consoleProvider.log('userChatIdGlobal', userChatIdGlobal);

        consoleProvider.log('userChatIdGlobal', userChatIdGlobal);

        //------------------------------------- chat open in both user ---------------

        var queryOff = firebase.database().ref('message/').child(userChatIdGlobal);

        queryOff.off('child_added');

        queryOff.off('child_changed');

        // alert('userChatId======'+userChatId);

        var image_index_me = 0;

        var image_index_other = 0;

        userChatIdGlobal = userChatId;

        $('#mCSB_1_container').html('');

        var query = firebase
            .database()
            .ref('message/' + userChatId)
            .orderByChild('timestamp');

        query.on('child_added', function (data) {
            console.log('message child_added chat all data', data.toJSON());

            // LoadingEnd();

            var msgKey = data.key;

            var message = data.val().message;

            var messageType = data.val().messageType;

            var senderId = data.val().senderId;

            var timestamp = data.val().timestamp;

            var lastMsgTime = convertTimeAllFormat(timestamp, 'date_time_full');

            var messageDataShow = '';

            consoleProvider.log('senderId', senderId);

            consoleProvider.log('user_id', user_id);

            if (messageType == 'text') {
                message = message;
            } else if (messageType == 'image') {
                var message = URLAPI_img_200X200 + message;

                message =
                    '<img src="' +
                    message +
                    '" onerror="this.src=' +
                    error_img_slider +
                    ';" class="chat_send_image" onclick="imageShowBig(this)" style="width:200px;height:150px;">';
            } else if (messageType == 'file') {
                var message = URLAPI_img_200X200 + message;

                message =
                    '<a href="' + message + '" target="_blank;"><img src=' + pdf_img_slider + ' class="chat_send_image" style="width: 57px;"></a>';
            } else if (messageType == 'audiofile') {
                var message = URLAPI_img_200X200 + message;

                message =
                    '<a href="' + message + '" target="_blank;"><img src=' + audio_img_slider + ' class="chat_send_image" style="width: 57px;"></a>';
            } else if (messageType == 'statrtTicket') {
                $('#resolved_btn').show();
                $('#input_hide').show();
                message =
                    '<p class="mb-0" style=" font-size: 15px; font-weight: 500; color: #337ab7;margin-bottom:0px!important;">' + message + '</p>';
                var htmlData =
                    '<li  class="other_p" style="align-items: center;">' +
                    '<div class="message" style=" background: aliceblue;">' +
                    '<span class="message_contaner">' +
                    message +
                    '</span>' +
                    '</div>' +
                    '</li>';
            } else if (messageType == 'endTicket') {
                message = '';
                $('#resolved_btn').hide();
                $('#input_hide').hide();
                var htmlData = '';
            }

            if (senderId == user_id) {
                if (messageType != 'statrtTicket' && messageType != 'endTicket') {
                    var userImage = userProvider.getMe().image;

                    console.log('userImage kA', userImage);

                    console.log('URLAPI_img_200X200 kA', URLAPI_img_200X200);

                    var user_image_get = URLAPI_img_200X200 + userImage;

                    console.log('user_image_get', user_image_get);

                    var htmlData =
                        '<li  class="other">' +
                        '<div class="message">' +
                        '<span class="message_contaner">' +
                        message +
                        '</span>' +
                        '<span class="time_gap"></span>' +
                        '<time>' +
                        lastMsgTime +
                        '</time>' +
                        '</div>' +
                        '</li>';
                }

                $('#mCSB_1_container').append(htmlData);
            } else {
                var userImage = 'NA';

                var other_user_id = senderId;

                console.log('FirebaseUserJson', FirebaseUserJson);

                var user_data_other = FirebaseUserJson.findIndex((x) => x.user_id == other_user_id);

                console.log('user_data_other', user_data_other);

                if (user_data_other != -1) {
                    var userDataMe = FirebaseUserJson[user_data_other];

                    var userImage = URLAPI_img_200X200 + userDataMe.image;
                }
                if (messageType != 'statrtTicket' && messageType != 'endTicket') {
                    var htmlData =
                        '<li  class="me">' +
                        '<div class="message">' +
                        '<span class="message_contaner">' +
                        message +
                        '</span>' +
                        '<span class="time_gap"></span>' +
                        '<time>' +
                        lastMsgTime +
                        '</time>' +
                        '</div>' +
                        '</li>';
                }

                $('#mCSB_1_container').append(htmlData);
            }
        });

        setTimeout(function () {
            // $(".mCSB_1_container").stop().animate({ scrollTop: $(".mCustomScrollbar")[0].scrollHeight}, 1000);

            var message = $('.mCustomScrollbar').html();

            $('.mCSB_1_container').scrollTop($('.mCSB_1_container')[0].scrollHeight);
        }, 800);
    }

    LoadingEnd();
}

function getJsonSearch(obj, key, val) {
    //val = Number(val);

    // consoleProvider.log('obj',obj);

    // consoleProvider.log('getJsonSearch data='+obj+'//'+key+'//'+val);

    //obj=FirebaseGroupJson;

    // key=JSON.stringify(key);

    // consoleProvider.log('keykey',key);

    // var objects= obj.findIndex(x => x.create_user_id==val);

    var objects = [];

    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;

        if (typeof obj[i] == 'object') {
            objects = objects.concat(getJsonSearch(obj[i], key, val));
        }

        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        else if ((i == key && obj[i] == val) || (i == key && val == '')) {
            //

            objects.push(obj);
        } else if (obj[i] == val && key == '') {
            //only add if the object is not already in the array

            if (objects.lastIndexOf(obj) == -1) {
                objects.push(obj);
            }
        }
    }

    return objects;
}

//message send and inbox create

function btnSendMessageChat(messageType, inputId, message) {
    consoleProvider.log('btnSendMessageChat');

    console.log('check other_user_id', other_user_id_global);

    if (userProvider.getMe() != null) {
        var user_id = userProvider.getMe().user_id;

        var other_user_id = other_user_id_global;

        if (messageType == 'text') {
            var message = $.trim($('#' + inputId).val());

            if (message.length <= 0) {
                alert('Please Enter Message');

                // msgProvider.alert(msgTitle.msgTitleDefualt[language],msgText.emptyChatMsg[language]);

                return false;
            }
        }

        var user_id_send = 'u_' + user_id;

        var other_user_id_send = 'u_' + other_user_id;

        var inbox_id_me = 'u_' + other_user_id;

        var inbox_id_other = 'u_' + user_id;

        var block_status_get = 'no';

        var user_data_other_id_new = FirebaseUserJson.findIndex((x) => x.user_id == other_user_id);

        if (user_data_other_id_new >= 0) {
            consoleProvider.log('chat name user_data_other', user_data_other_id_new);

            var jsonDataInbox = FirebaseUserJson[user_data_other_id_new];

            consoleProvider.log('jsonDataInbox', jsonDataInbox);

            var blockUser = [];

            blockUser.push(jsonDataInbox.myInbox);

            consoleProvider.log('other_user_data blockUser', blockUser);

            if (jsonDataInbox.myInbox != undefined) {
                var other_user_data = getJsonSearch(blockUser, 'other_user_id', user_id);

                if (other_user_data.length > 0) {
                    block_status_get = other_user_data[0].block_status;
                }
            }
        }

        //---------------------- this code for create inbox in first time -----------

        consoleProvider.log('FirebaseInboxJsonChck', FirebaseInboxJson);

        var find_inbox_index = FirebaseInboxJson.findIndex((x) => x.user_id == other_user_id);

        consoleProvider.log('find_inbox_index chat', find_inbox_index);

        consoleProvider.log('other_user_id chat', other_user_id);

        if (find_inbox_index == -1) {
            var jsonUserDataMe = {
                count: 0,

                lastMessageType: '',

                lastMsg: '',

                user_id: other_user_id,

                // other_user_id : other_user_id,

                typing_status: 'no',

                block_status: 'no',

                lastMsgTime: firebase.database.ServerValue.TIMESTAMP
            };

            var jsonUserDataother = {
                count: 0,

                lastMessageType: '',

                lastMsg: '',

                user_id: user_id,

                // other_user_id : user_id,

                typing_status: 'no',

                block_status: 'no',

                lastMsgTime: firebase.database.ServerValue.TIMESTAMP
            };

            if (block_status_get == 'no' || block_status_get == undefined) {
                UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);

                UpdateUserInboxOther(other_user_id_send, inbox_id_other, jsonUserDataother);
            } else {
                UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);
            }

            consoleProvider.log('FirebaseUserJson', FirebaseUserJson);
        }

        //---------------------- this code for create inbox in first time end -----------

        //---------------------- this code for send message to both -----------

        var messageIdME = 'u_' + user_id + '__u_' + other_user_id;

        var messageIdOther = 'u_' + other_user_id + '__u_' + user_id;

        var senderId = user_id;

        var timestamp = new Date().getTime();

        var messageJson = {
            message: message,

            messageType: messageType,

            senderId: senderId,

            timestamp: timestamp
        };

        if (block_status_get == 'no' || block_status_get == undefined) {
            SendUserMessage(messageIdME, messageJson, messageType, inputId);

            SendUserMessage(messageIdOther, messageJson, messageType, inputId);
        } else {
            SendUserMessage(messageIdME, messageJson, messageType, inputId);
        }

        //---------------------- this code for send message to both end -----------

        //----------------update user inbox----------------------------

        var jsonUserDataMe = {
            count: 0,

            lastMessageType: messageType,

            lastMsg: message,

            lastMsgTime: firebase.database.ServerValue.TIMESTAMP
        };

        UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);

        var user_id_me = userProvider.getMe().user_id;

        // var image=userProvider.getMe().image;

        var chat_room_id = other_user_id;

        //chatRoomIdUpdate(user_id_me, chat_room_id);

        //------------------------- get other user inbox -------------------

        consoleProvider.log('other_user_id_send', other_user_id_send);

        consoleProvider.log('user_id_send', user_id_send);

        var count_new = 0;

        var query = firebase.database().ref('users/' + other_user_id_send + '/myInbox/' + inbox_id_other);

        query.once('value', function (data) {
            console.log('chat_data', data.toJSON());

            console.log('user inbox data', data.val().count);

            var count_old = data.val().count;

            console.log('count_old_check', count_old);

            count_new = parseInt(count_old) + 1;

            var jsonUserDataOther = {
                count: count_new,

                lastMessageType: messageType,

                lastMsg: message,

                lastMsgTime: firebase.database.ServerValue.TIMESTAMP
            };

            // alert("dddd");

            console.log('jsonUserDataOther', jsonUserDataOther);

            UpdateUserInboxOther(other_user_id_send, inbox_id_other, jsonUserDataOther);

            //---------------------- send message notifications ----------------

            var title = AppName;

            var message_send = message;

            var SenderName = userProvider.getMe().name;

            if (messageType != 'text') {
                message_send = SenderName + ' sent: ' + messageType;
            } else {
                message_send = SenderName + ' says: ' + message_send;
            }

            var other_user_id = chat_room_id;

            var image = userProvider.getMe().image;

            consoleProvider.log('other_user_id_noti', other_user_id);

            consoleProvider.log('image shoe', image);

            var message_noti = message_send;

            var chat_data_not = { action_id: user_id_me, SenderName: SenderName, image: image };

            var action_json = {
                user_id: user_id_me,

                other_user_id: other_user_id,

                action: 'chat_single',

                action_id: user_id_me,

                SenderName: SenderName,

                image: image,

                chat_data_not: chat_data_not
            };

            // alert(user_id_me);

            if (block_status_get == 'no' || block_status_get == undefined) {
                sendNotificationSignle(title, message_noti, action_json, other_user_id);
            }

            //---------------------- send message notifications end----------------
        });

        global_send_msg_scroll = 1;

        //setTimeout(function(){

        // consoleProvider.log($("#himanshu_scroll")[0].scrollHeight);

        $('#mCSB_1_container')
            .stop()
            .animate({ scrollTop: $('#mCSB_1_container')[0].scrollHeight }, 1000);

        //},800);
    }
}

function btnSendMessageChatFirstTime(messageType, message, other_user_id) {
    consoleProvider.log('btnSendMessageChatFirstTime other_user_id', other_user_id);

    if (userProvider.getMe() != null) {
        var user_id = userProvider.getMe().user_id;

        var user_id_send = 'u_' + user_id;

        var other_user_id_send = 'u_' + other_user_id;

        var inbox_id_me = 'u_' + other_user_id;

        var inbox_id_other = 'u_' + user_id;

        //---------------------- this code for create inbox in first time -----------

        var jsonUserDataMe = {
            count: 0,

            lastMessageType: '',

            lastMsg: '',

            user_id: other_user_id,

            typing_status: 'no',

            block_status: 'no',

            lastMsgTime: firebase.database.ServerValue.TIMESTAMP
        };

        var jsonUserDataother = {
            count: 0,

            lastMessageType: '',

            lastMsg: '',

            user_id: user_id,

            typing_status: 'no',

            block_status: 'no',

            lastMsgTime: firebase.database.ServerValue.TIMESTAMP
        };

        UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);

        UpdateUserInboxOther(other_user_id_send, inbox_id_other, jsonUserDataother);

        consoleProvider.log('FirebaseUserJson', FirebaseUserJson);

        //---------------------- this code for create inbox in first time end -----------

        //---------------------- this code for send message to both -----------

        var messageIdME = 'u_' + user_id + '__u_' + other_user_id;

        var messageIdOther = 'u_' + other_user_id + '__u_' + user_id;

        var senderId = user_id;

        var timestamp = new Date().getTime();

        var messageJson = {
            message: message,

            messageType: messageType,

            senderId: senderId,

            timestamp: timestamp
        };

        var inputId = '';

        SendUserMessage(messageIdME, messageJson, messageType, inputId);

        SendUserMessage(messageIdOther, messageJson, messageType, inputId);

        //---------------------- this code for send message to both end -----------

        //----------------update user inbox----------------------------

        var jsonUserDataMe = {
            count: 0,

            lastMessageType: messageType,

            lastMsg: message,

            lastMsgTime: firebase.database.ServerValue.TIMESTAMP
        };

        UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);

        var user_id_me = userProvider.getMe().user_id;

        var chat_room_id = 'no';

        //chatRoomIdUpdate(user_id_me, chat_room_id);

        //------------------------- get other user inbox -------------------

        consoleProvider.log('other_user_id_send', other_user_id_send);

        consoleProvider.log('user_id_send', user_id_send);

        var count_new = 0;

        var query = firebase.database().ref('users/' + other_user_id_send + '/myInbox/' + inbox_id_other);

        query.once('value', function (data) {
            console.log('chat_data', data.toJSON());

            console.log('user inbox data', data.val().count);

            var count_old = data.val().count;

            console.log('count_old_check', count_old);

            count_new = parseInt(count_old) + 1;

            var jsonUserDataOther = {
                count: count_new,

                lastMessageType: messageType,

                lastMsg: message,

                lastMsgTime: firebase.database.ServerValue.TIMESTAMP
            };

            // alert("dddd");

            console.log('jsonUserDataOther', jsonUserDataOther);

            UpdateUserInboxOther(other_user_id_send, inbox_id_other, jsonUserDataOther);

            //---------------------- send message notifications ----------------

            var title = AppName;

            var message_send = message;

            var SenderName = userProvider.getMe().name;

            // var image=userProvider.getMe().image;

            if (messageType != 'text') {
                message_send = SenderName + ' sent: ' + messageType;
            } else {
                message_send = SenderName + ' says: ' + message_send;
            }

            var other_user_id = chat_room_id;

            consoleProvider.log('other_user_id_noti', other_user_id);

            var message_noti = message_send;

            var action_json = {
                user_id: user_id_me,

                other_user_id: other_user_id,

                action: 'chat_single',

                action_id: user_id_me,

                SenderName: SenderName,

                image: images
            };

            // alert(user_id_me);

            sendNotificationSignle(title, message_noti, action_json, other_user_id);

            //---------------------- send message notifications end----------------
        });
    }
}

//chat room id

function chatRoomIdUpdate(user_id, other_user_id) {
    consoleProvider.log('chatRoomIdUpdate user_id', user_id);

    consoleProvider.log('chatRoomIdUpdate other_user_id', other_user_id);

    var id = 'u_' + user_id;

    var jsonUserDataMe = {
        chat_room_id: other_user_id
    };

    CreateUser(id, jsonUserDataMe);
}

//1.set message count 0 and update chatRoomIdUpdate

function setChatRoomIdUpdateAndMsgCount() {
    if (userProvider.getMe() != null) {
        var user_id = userProvider.getMe().user_id;

        var other_user_id = app.view.main.router.currentRoute.params.other_user_id;

        var chat_type = app.view.main.router.currentRoute.params.chat_type;

        var inbox_id_me = 'u_' + other_user_id;

        var inbox_id_other = 'u_' + user_id;

        var user_id_send = 'u_' + user_id;

        var other_user_id_send = 'u_' + other_user_id;

        var report_type = "'chat'";

        // $$('.chat_report').attr('onclick',"reportSubmitBtn("+other_user_id+","+report_type+");");

        // $$('.clear_chat').attr('onclick',"firebaseClearChatMySide("+user_id+","+other_user_id+");");

        //==================update inbox count=======================

        var find_inbox_index = FirebaseInboxJson.findIndex((x) => x.user_id == other_user_id);

        consoleProvider.log('find_inbox_index chat', find_inbox_index);

        consoleProvider.log('other_user_id chat', other_user_id);

        if (find_inbox_index >= 0) {
            var jsonUserDataMe = {
                count: 0
            };

            UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);
        }

        //==================update chat room id=======================

        var user_id_me = userProvider.getMe().user_id;

        chatRoomIdUpdate(user_id_me, other_user_id);
    }
}

function chatBackBtnOnclick() {
    var user_id = userProvider.getMe().user_id;

    var other_user_id = other_user_id_global;

    var find_inbox_index = FirebaseInboxJson.findIndex((x) => x.user_id == other_user_id);

    consoleProvider.log('find_inbox_index chat back', find_inbox_index);

    if (find_inbox_index >= 0) {
        var inbox_id_me = 'u_' + other_user_id;

        var user_id_send = 'u_' + user_id;

        var jsonUserDataMe = {
            count: 0
        };

        UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);
    }

    var user_id_me = userProvider.getMe().user_id;

    var other_user_id = 'no';

    chatRoomIdUpdate(user_id_me, other_user_id);

    setTimeout(function () {
        // mainView.router.navigate({url: '/inbox/', ignoreCache:true, reloadCurrent:false,animate:false});
    }, 800);
}

//=======================================================================================================

function chatImageSend(event) {
    console.log('chatImageSend');

    var fileExtension = ['jpeg', 'jpg', 'png'];

    if ($.inArray($(event).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
        // alert("Only '.jpeg','.jpg' formats are allowed.");

        $('#chat_msg_file').val('');

        alert('Please select a valid image  in jpeg , jpg or png formate ');
    } else {
        console.log('send image');

        var chat_image = $(event).val();

        readURL(event);
    }
}

function readURL(input) {
    console.log('readURL', input);

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            console.log('e.target.result', e.target.result);

            var get_image = e.target.result;

            var global_image = dataURLToBlob(get_image);

            uploadChatFilesFirebase(global_image, 'image', '');
        };

        reader.readAsDataURL(input.files[0]);
    }
}

//camera code

function setcameraOpen() {
    //camera-gallery-actions-click

    $$('.camera-galleryClick').on('click', function () {
        moreActionsuploadChat.open();
    });

    //camera-gallery-actions

    moreActionsuploadChat = app.actions.create({
        buttons: [
            [
                {
                    text: 'Upload Image',

                    label: true
                },

                {
                    text: 'Camera',

                    onClick: ImageCameraFirebase
                },

                {
                    text: 'Gallery',

                    onClick: ImageGalleryMultipleFirebase
                }
            ],

            [
                {
                    text: 'Cancel',

                    bold: true,

                    color: 'red'
                }
            ]
        ]
    });
}

//-------------------------------------- Open Camera -----------------------

function ImageCameraFirebase() {
    global_image = '';

    if (device_type == 'browser') {
        //------------------------- image camera test ----------------

        ImageCameraTestFirebase(base64_camera);
    } else {
        navigator.camera.getPicture(
            function (imageURI) {
                //-------------------- image preview --------------

                // $('#'+img_id).attr('src', "data:image/png;base64," + imageURI);

                //---------------------- image convert in blob type -----------------

                // alert('camera success');

                var get_image = 'data:image/png;base64,' + imageURI;

                global_image = dataURLToBlob(get_image);

                uploadChatFilesFirebase(global_image, 'image', '');
            },
            function (error) {
                msgProvider.alert('Error Message', error);

                //return false;
            },
            {
                quality: 50,

                cameraDirection: 1,

                //destinationType: Camera.DestinationType.FILE_URI,

                destinationType: Camera.DestinationType.DATA_URL,

                mediaType: navigator.camera.MediaType.SAVEDPHOTOALBUM,

                correctOrientation: true,

                allowEdit: true
            }
        );
    }
}

function ImageCameraTestFirebase(imageURI) {
    // consoleProvider.log(imageURI);

    //------------------- show file uri ---------------------

    var get_image = 'data:image/png;base64,' + imageURI;

    global_image = dataURLToBlob(get_image);

    uploadChatFilesFirebase(global_image, 'image', '');
}

//------------------------------------ Open Camera  Closed Here -----------------

//------------------------------------- open gallery ------------------------

var imgVideoExtensionArrFirebase = ['png', 'jpg', 'jpeg', 'mp4', 'mov', 'mkv'];

function ImageGalleryFirebase() {
    global_image = '';

    if (device_type == 'browser') {
        //------------------------- image camera test ----------------

        ImageCameraTestFirebase(base64_camera);
    } else {
        navigator.camera.getPicture(
            function (imageURI) {
                //-------------------- image preview --------------

                // $('#'+img_id).attr('src', "data:image/png;base64," + imageURI);

                //---------------------- image convert in blob type -----------------

                var get_image = 'data:image/png;base64,' + imageURI;

                global_image = dataURLToBlob(get_image);

                uploadChatFilesFirebase(global_image, 'image', '');
            },
            function (error) {
                //msgProvider.alert('Error Message',error);
                //return false;
            },
            {
                quality: 50,

                //destinationType: Camera.DestinationType.FILE_URI,

                destinationType: Camera.DestinationType.DATA_URL,

                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,

                //mediaType: navigator.camera.MediaType.ALLMEDIA,

                mediaType: navigator.camera.MediaType.SAVEDPHOTOALBUM,

                correctOrientation: true
            }
        );
    }
}

//------------------------------------ open gallery -----------------

var global_length_var = 0;

function ImageGalleryMultipleFirebase() {
    // alert('ImageGalleryMultipleFirebase');

    global_length_var = 0;

    if (device_type == 'android') {
        // alert('deviceVersion===1'+deviceVersion);

        if (parseFloat(deviceVersion) >= 6) {
            // alert('deviceVersion===2'+deviceVersion);

            //---------------------------- only for android above version 6 -----------------

            var permissions = cordova.plugins.permissions;

            var list = [permissions.CAMERA, permissions.READ_EXTERNAL_STORAGE, permissions.WRITE_EXTERNAL_STORAGE];

            // alert('deviceVersion===3'+deviceVersion);

            permissions.hasPermission(list, function (status) {
                //consoleProvider.alert('status='+JSON.stringify(status));

                // alert('deviceVersion===4'+deviceVersion);

                if (status.hasPermission == false) {
                    // alert("Yes :D ");

                    permissions.requestPermissions(
                        list,
                        function (status) {
                            //consoleProvider.alert('status='+JSON.stringify(status))

                            //-------------------- code here --------------

                            //$("#"+popup_id).popup( "close" );

                            // alert('deviceVersion===5'+deviceVersion);

                            var get_image = '';

                            window.imagePicker.getPictures(
                                function (results) {
                                    // alert('deviceVersion===6'+deviceVersion);

                                    if (results.length > 0) {
                                        global_length_var = global_length_var + results.length;

                                        //consoleProvider.alert('length of global_length_var',global_length_var);

                                        for (var i = 0; i < results.length; i++) {
                                            //consoleProvider.alert('results.length--------'+results.length);

                                            var imageURI = results[i];

                                            if (imageURI != '' && imageURI.length > 0) {
                                                get_image = 'data:image/png;base64,' + imageURI;

                                                //global_image_arr.push(get_image);

                                                var convertFunction = convertFileToDataURLviaFileReadertryChat(results[i]);
                                            }
                                        }
                                    }
                                },
                                function (error) {
                                    msgProvider.alert('Error Message', error);

                                    //return false;
                                },
                                {
                                    maximumImagesCount: 10 - global_length_var,

                                    width: 800
                                }
                            );

                            //-------------------- code here end --------------
                        },
                        function (error) {
                            //alert('error='+JSON.stringify(error))
                        }
                    );
                } //if closed of checked false
            }); //closed of permission
        } //if closed of version checked
        else {
            // alert('deviceVersion===7'+deviceVersion);

            //---------------------------------- this for android below version 6 ------------

            //----------------------- code here  ---------------

            var get_image = '';

            window.imagePicker.getPictures(
                function (results) {
                    // alert('deviceVersion===8'+deviceVersion);

                    if (results.length > 0) {
                        global_length_var = global_length_var + results.length;

                        //consoleProvider.alert('length of global_length_var',global_length_var);

                        for (var i = 0; i < results.length; i++) {
                            //consoleProvider.alert('results.length--------'+results.length);

                            var imageURI = results[i];

                            if (imageURI != '' && imageURI.length > 0) {
                                get_image = 'data:image/png;base64,' + imageURI;

                                //global_image_arr.push(get_image);

                                var convertFunction = convertFileToDataURLviaFileReadertryChat(results[i]);
                            }
                        }
                    }
                },
                function (error) {
                    //msgProvider.alert('Error Message',error);
                    //return false;
                },
                {
                    maximumImagesCount: 10 - global_length_var,

                    width: 800
                }
            );

            //----------------------- code here end ---------------

            //---------------------------------- this for android below version 6 end ------------
        }
    } else if (device_type == 'ios') {
        // alert('deviceVersion===ios'+deviceVersion);

        //---------------------------- only for android above version 6 -----------------

        var permissions = cordova.plugins.permissions;

        var list = [
            //permissions.CAMERA,

            permissions.READ_EXTERNAL_STORAGE,

            permissions.WRITE_EXTERNAL_STORAGE
        ];

        permissions.hasPermission(list, function (status) {
            //consoleProvider.alert('status='+JSON.stringify(status));

            if (status.hasPermission == true) {
                //consoleProvider.alert("Yes :D ");

                permissions.requestPermissions(
                    list,
                    function (status) {
                        //consoleProvider.alert('status='+JSON.stringify(status))

                        //-------------------- code here -------------

                        //$("#"+popup_id).popup( "close" );

                        var get_image = '';

                        window.imagePicker.getPictures(
                            function (results) {
                                if (results.length > 0) {
                                    global_length_var = global_length_var + results.length;

                                    //consoleProvider.alert('length of global_length_var',global_length_var);

                                    for (var i = 0; i < results.length; i++) {
                                        //consoleProvider.alert('results.length--------'+results.length);

                                        var imageURI = results[i];

                                        if (imageURI != '' && imageURI.length > 0) {
                                            get_image = 'data:image/png;base64,' + imageURI;

                                            //global_image_arr.push(get_image);

                                            var convertFunction = convertFileToDataURLviaFileReadertryChat(results[i]);
                                        }
                                    }
                                }
                            },
                            function (error) {
                                //msgProvider.alert('Error Message',error);
                                //return false;
                            },
                            {
                                maximumImagesCount: 10 - global_length_var,

                                width: 800
                            }
                        );

                        //-------------------- code here end --------------
                    },
                    function (error) {
                        //consoleProvider.alert('error='+JSON.stringify(error))
                    }
                );
            } //if closed of checked false
        }); //closed of permission
    } else {
        // alert('deviceVersion===10'+deviceVersion);

        //----------------------- code for browser/IOS only ---------------

        //$("#"+popup_id).popup( "close" );

        var get_image = '';

        window.imagePicker.getPictures(
            function (results) {
                // alert('deviceVersion===11'+deviceVersion);

                if (results.length > 0) {
                    global_length_var = global_length_var + results.length;

                    //consoleProvider.alert('length of global_length_var',global_length_var);

                    for (var i = 0; i < results.length; i++) {
                        //consoleProvider.alert('results.length--------'+results.length);

                        var imageURI = results[i];

                        if (imageURI != '' && imageURI.length > 0) {
                            get_image = 'data:image/png;base64,' + imageURI;

                            //global_image_arr.push(get_image);

                            var convertFunction = convertFileToDataURLviaFileReadertryChat(results[i]);
                        }
                    }
                }
            },
            function (error) {
                //msgProvider.alert('Error Message',error);
                //return false;
            },
            {
                maximumImagesCount: 10 - global_length_var,

                width: 800
            }
        );

        //----------------------- code for browser/IOS only end ---------------
    }

    //------------------------------------ permissions code here end -------------------
}

function openPOPuPChat(event, classname) {
    var image_id = $(event).attr('id');

    consoleProvider.log('image_id', image_id);

    consoleProvider.log('classname', classname);

    var image_arr = [];

    $('.' + classname).each(function () {
        consoleProvider.log('this', this);

        var image_src = $(this).attr('src');

        image_arr.push(image_src);

        consoleProvider.log('image_src', image_src);
    });

    /*=== Default standalone ===*/

    consoleProvider.log('image_arr.length', image_arr.length);

    if (image_arr.length == 1) {
        chatPhotoBrowserStandalone = app.photoBrowser.create({
            photos: image_arr,

            theme: 'dark'
        });
    } else {
        chatPhotoBrowserStandalone = app.photoBrowser.create({
            photos: image_arr,

            theme: 'dark',

            swiper: {
                initialSlide: parseInt(image_id)
            }
        });
    }

    chatPhotoBrowserStandalone.open();
}

function convertFileToDataURLviaFileReadertryChat(url) {
    //alert('convertFileToDataURLviaFileReadertryChat');

    var def = new $.Deferred();

    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        var reader = new FileReader();

        reader.onloadend = function () {
            var result = reader.result;

            console.log('result', result);

            //global_image_arr.push(dataURLToBlob(result));

            var global_image_chat = dataURLToBlob(result);

            //alert('ifff');

            uploadChatFilesFirebase(global_image_chat, 'image', '');

            //return def.resolve(result);
        };

        reader.readAsDataURL(xhr.response);
    };

    xhr.open('GET', url);

    xhr.responseType = 'blob';

    xhr.send();

    return def.promise();
}

//----------------------- upload on server -----------------

function uploadChatFilesFirebase(files, fileType) {
    LoadingStart();
    var URLAPIChat = 'https://vigyapn.com/app/admin/libraryPHP/';
    var new_files = dataURLToBlob(files);
    var user_id_me = userProvider.getMe().user_id;
    if (fileType == 'image') {
        var link = URLAPIChat + 'chat_file_upload.php';
        var formData = new FormData();
        formData.append('user_id', user_id_me);
        formData.append('file_type', fileType);
        formData.append('image', new_files, 'image.png');
    }
    if (fileType == 'file') {
        var link = URLAPIChat + 'chat_file_upload.php';
        var formData = new FormData();
        formData.append('user_id', user_id_me);
        formData.append('file_type', fileType);
        formData.append('image', new_files, 'application.pdf');
    }

    $.ajax({
        url: link,
        type: 'POST',
        data: formData,
        crossDomain: true,
        cache: false,
        contentType: false,
        processData: false,
        //contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (obj) {
            consoleProvider.log('obj', obj);
            // LoadingEnd();
            // return false;
            if (obj.success == true) {
                var message = obj.file;
                var messageType = fileType;
                btnSendMessageChat(messageType, 'chat_msg', message);
                $('#onclickImageSend').removeAttr('onclick');
                uploadingClose();
                LoadingEnd();
            } else {
                var language = 0;
                alert(obj.msg[language]);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) { }
    });
}

function reportUser(event) {
    consoleProvider.log('this', event);

    // return false;

    var other_user_id = other_user_id_global;

    var reason = event;

    consoleProvider.log('reason', reason);

    var user_id = userProvider.getMe().user_id;

    //------------------------- call webservice -----------------------

    var link = URLAPIBack + 'chat_report.php';

    var dataPost = {
        other_user_id: other_user_id,

        user_id: user_id,

        reason: reason
    };

    consoleProvider.log('dataPost', dataPost);

    $.ajax({
        url: link,

        type: 'GET',

        data: dataPost,

        cache: false,

        dataType: 'json',

        success: function (obj) {
            consoleProvider.log('obj', obj);

            if (obj.success == 'true') {
                var language = 0;

                return obj;
            } else {
                var language = 0;

                alert(obj.msg[language]);
            }
        },

        error: function (xhr, ajaxOptions, thrownError) { }
    });

    //------------------------- call webservice end -----------------------
}

function dataURLToBlob(dataURL) {
    var BASE64_MARKER = ';base64,';

    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');

        var contentType = parts[0].split(':')[1];

        var raw = parts[1];

        return new Blob([raw], { type: contentType });
    } else {
        var parts = dataURL.split(BASE64_MARKER);

        var contentType = parts[0].split(':')[1];

        var raw = window.atob(parts[1]);

        var rawLength = raw.length;

        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], { type: contentType });
    }
}

// var chatPhotoBrowserStandalone = app.photoBrowser.create({

//   theme: 'dark',

// });

// function reportSubmitBtn(other_user_id,report_type){

//  if(userProvider.getMe() != null){

//    var user_id = userProvider.getMe().user_id;

//    //------------------------- call webservice -----------------------

//    var link = URLAPI+'report_submit.php';

//    var dataPost={

//        user_id:user_id,

//        other_user_id:other_user_id,

//        report_type:report_type,

//    }

//    consoleProvider.log('dataPost',dataPost);

//    webService.get(link, dataPost).then(function(response){

//        consoleProvider.log('response_report',response);

//        var obj = response;

//        if(obj.success == 'true'){

//            msgProvider.alert(msgTitle.msgTitleDefualt[language],obj.msg[language]);

//            return false;

//        }else{

//            msgProvider.alert(msgTitle.msgTitleDefualt[language],obj.msg[language]);

//            //-------------------- check account deactivate status ---------------

//            var account_active_status=obj.account_active_status;

//            checkActivateDeactivateStatus(account_active_status);

//            //-------------------- check account deactivate status end ---------------

//            return false;

//        }

//     },function(err){

//        //console.log('err new',err);

//        if(err == 'noNetwork'){

//            webServiceError.noNetworkAvailable();

//        }else{

//            webServiceError.serverNotResponce();

//        }

//    });

//    //------------------------- call webservice end -----------------------

//  }

// }

//================chat inbox code start=================================

$(document).on('page:beforein', '.page[data-name="inbox"]', function (e) {
    var user_id_me = userProvider.getMe().user_id;

    var user_type = userProvider.getMe().user_type;

    if (user_type == 'user') {
        $('#inbox_footer_hide_show').css('display', 'block');

        $$('#chat_inbox_back').attr('href', '/home/');
    } else {
        $('#inbox_footer_hide_show').css('display', 'none');

        $$('#chat_inbox_back').attr('href', '/Chef_home/');
    }

    var other_user_id = 'no';

    // chatRoomIdUpdate(user_id_me,other_user_id);

    showUserInbox();

    var user_id_me = userProvider.getMe().user_id;

    console.log('inboxinboxinboxinboxinbox');

    chatRoomIdUpdate(user_id_me, 'no');
});

function showUserInbox() {
    console.log('showUserInbox');

    var user_id_me = userProvider.getMe().user_id;

    consoleProvider.log('FirebaseInboxJson get in-box121', FirebaseInboxJson);

    var len = FirebaseInboxJson.length;

    consoleProvider.log('FirebaseInboxJson len', len);

    //$('#showConversationsCount').text(len);

    if (len > 0) {
        $('#chat_meassage_inbox_list').html('');

        $('#no_data_home').hide();

        console.log('FirebaseInboxJson', FirebaseInboxJson);

        $.each(FirebaseInboxJson, function (index, keyValue) {
            console.log('message user_id', keyValue.user_id);

            setOtherUserId(keyValue.user_id);

            var other_user_id = keyValue.user_id;
            var other_user_id = keyValue.user_id;
            var booking_id = keyValue.booking_id;

            console.log('FirebaseUserJson', FirebaseUserJson);

            var user_data_other = FirebaseUserJson.findIndex((x) => x.user_id == other_user_id);

            console.log('user_data_other', user_data_other);

            if (user_data_other != -1) {
                var userDataMe = FirebaseUserJson[user_data_other];

                var count = keyValue.count;

                var lastMessageType = keyValue.messageType;

                var lastMsg = keyValue.lastMsg;

                var lastMsgTime = keyValue.lastMsgTime;

                consoleProvider.log('messageType', lastMessageType);

                var userId = userDataMe.user_id;

                var userImage = URLAPI_img_200X200 + userDataMe.image;

                var userName = userDataMe.name;

                var userType = userDataMe.user_type;

                if (userType == 0) {
                    var userTypeText = 'Merchant';
                } else {
                    var userTypeText = 'Customer';
                }

                var userEmail = userDataMe.email;

                var onlineStatus = userDataMe.onlineStatus;

                var onlineStatusHtml = '';

                if (onlineStatus == 'true') {
                    onlineStatusHtml = '<span class="msg-status"></span>';
                }

                var lastMsgShow = '';
                console.log('lastMessageType', lastMessageType);

                if (lastMessageType == 'text') {
                    lastMsgShow = lastMsg;
                }
                if (lastMessageType == 'pdf') {
                    lastMsgShow = 'PDF';
                } else if (lastMessageType == 'image') {
                    lastMsgShow = 'Photo';
                } else if (lastMessageType == 'video') {
                    lastMsgShow = 'Video';
                } else if (lastMessageType == 'audio') {
                    lastMsgShow = 'Audio';
                }
                var imgOnline = '';

                if (onlineStatus == 'true') {
                    var imgOnline = 'online';
                }

                var countHtml = '';

                consoleProvider.log('lastMsgTime', lastMsgTime);

                if (lastMsgTime != '') {
                    lastMsgTimeShow = convertTimeAllFormat(lastMsgTime, 'date_time');

                    countHtml = '';
                } else {
                    lastMsgTimeShow = '';
                }

                if (count > 0) {
                    countHtml = '<div class="n_count">' + '<span>' + count + '</span>' + '</div>';
                }

                consoleProvider.log('lastMsgShowlastMsgShow', lastMsgShow);

                consoleProvider.log('Himanshu count', count);

                if (other_user_id != undefined) {
                    if (booking_id == undefined) {
                        var htmlData =
                            '<li href="javascript:void(0);" class="media" id="chat_list_' +
                            other_user_id +
                            '" data-position="' +
                            lastMsgTime +
                            '" onclick="btnStartChatClick(' +
                            other_user_id +
                            ')">' +
                            '<a class="new_message ' +
                            imgOnline +
                            '">' +
                            '<div class="other_profile_pic">' +
                            '<img src="' +
                            userImage +
                            '" onerror="this.src=' +
                            error_img_user +
                            '">' +
                            '</div>' +
                            '<div class="message_section">' +
                            '<div class="name_time">' +
                            '<h3>' +
                            userName +
                            '(' +
                            userTypeText +
                            ')' +
                            '</h3>' +
                            '<time>' +
                            lastMsgTimeShow +
                            '</time>' +
                            '</div>' +
                            '<div class="last_message_n_count">' +
                            '<div class="last_message">' +
                            '<span>' +
                            lastMsgShow +
                            '</span>' +
                            '</div>' +
                            countHtml +
                            '</div>' +
                            '</div>' +
                            '<svg class="chatNow" id="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 21" width="10" height="21"><path  d="M1 15.75l5.2-5.2L1 5.35l1.5-1.5 6.5 6.7-6.6 6.6-1.4-1.4z"></path></svg>' +
                            '</a>' +
                            '</li>';
                    }
                }

                $('#chat_meassage_inbox_list').append(htmlData);

                $('#chat_meassage_inbox_list li').sort(sortInboxAll).appendTo('#chat_meassage_inbox_list');
            }
        });

        var length = $('#chat_meassage_inbox_list li').length;

        var length2 = $('#chat_meassage_inbox_list_service li').length;

        if (length == 0) {
            $('#no_data_home_order').show();
        } else {
            $('#no_data_home_order').hide();
        }

        if (length2 == 0) {
            $('#no_data_home_service').show();
        } else {
            $('#no_data_home_service').hide();
        }
    } else {
        consoleProvider.log('flase', len);

        $('#no_data_home_order').show();

        $('#no_data_home_service').show();
    }

    LoadingEnd();
}

//.....................................NotiFication Send Function ............................

function sendNotificationSignle(title, message, action_json, user_id_member) {
    consoleProvider.log('sendNotificationGroup action_json', action_json);

    consoleProvider.log('sendNotificationGroup message', message);

    consoleProvider.log('sendNotificationGroup user_id_member', user_id_member);

    consoleProvider.log('update delete_flag', user_id_member);

    consoleProvider.log('sendNotificationSignle FirebaseUserJson', FirebaseUserJson);

    var user_check_inbox = FirebaseUserJson.findIndex((x) => x.user_id == user_id_member);

    consoleProvider.log('user_check_inbox subuser', user_check_inbox);

    if (user_check_inbox >= 0) {
        consoleProvider.log('FirebaseUserJson subuser', FirebaseUserJson[user_check_inbox]);

        var player_id_get = FirebaseUserJson[user_check_inbox].player_id;

        var chat_room_id_get = FirebaseUserJson[user_check_inbox].chat_room_id;

        var notification_status = FirebaseUserJson[user_check_inbox].notification_stauts;

        var user_type_status = FirebaseUserJson[user_check_inbox].user_type;

        consoleProvider.log('chat_room_id_get', chat_room_id_get + '//' + chat_room_id_get);

        consoleProvider.log('player_id_get', user_id_member + '//' + player_id_get);

        consoleProvider.log('notification_status', notification_status);

        if (notification_status == 1) {
            var user_id_me = userProvider.getMe().user_id;

            //consoleProvider.log('chat_room_id_get',chat_room_id_get+'!='+user_id_me);

            //if(chat_room_id_get != user_id_me){

            if (player_id_get != 'no' && player_id_get != '123456') {
                var player_id_arr = [];

                player_id_arr.push(player_id_get);

                consoleProvider.log('player_id_arr', player_id_arr);

                if (player_id_arr.length > 0) {
                    var user_type_status = FirebaseUserJson[user_check_inbox].user_type;
                    consoleProvider.log('user_type_status', user_type_status);

                    oneSignalNotificationSend(title, message, action_json, player_id_arr, user_type_status);
                }
            }

            // }
        }
    }
}

function clearChatSingle() {
    var r = confirm('Are you sure you want to clear chat ?');

    if (r == true) {
        var user_id = userProvider.getMe().user_id;

        var other_user_id = other_user_id_global;

        var messageIdME = 'u_' + user_id + '__u_' + other_user_id;

        var id = 'u_' + user_id;

        var otherid = 'u_' + other_user_id;

        jsonUsesadsssfrData = {};

        firebase
            .database()
            .ref()
            .child('message' + '/' + messageIdME + '/')
            .remove();

        $('#mCSB_1_container').html('');

        jsonUserData = {};

        var jsonUserDataMe = {
            count: 0,

            lastMessageType: 'text',

            lastMsg: 'Chat cleared',

            lastMsgTime: firebase.database.ServerValue.TIMESTAMP,

            user_id: other_user_id
        };

        var user_id_send = 'u_' + user_id;

        var other_user_id_send = 'u_' + other_user_id;

        UpdateUserInboxMe(user_id_send, other_user_id_send, jsonUserDataMe);
    }
}

function chatUserSearch(value) {
    console.log('chatUserSearch', value);

    $('#chat_meassage_inbox_list a').filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
}

function setOtherUserId(other_user_id) {
    console.log('setOtherUserId other_user_id', other_user_id);

    localStorage.setItem('chat_other_user_id', other_user_id);
}

function oneSignalNotificationSend(title, message, jsonData, player_id_arr, user_type_status) {
    console.log(user_type_status);

    if (user_type_status == 1) {
        var oneSignalAppId = '59f3ccb0-654c-4e4e-ac2b-c303ed8bf0fa';

        var oneSignalAuthorization = 'ZjAxNGE1YTktN2Y1MS00YzAwLTk2MjAtMzI5MGMzOWFiMDU5';
    } else {
        var oneSignalAppId = 'd824c74d-7866-437a-8e87-074cbf01537c';

        var oneSignalAuthorization = 'ODU4MTMyM2EtMWZmMy00YzNiLTg5NmMtNWE0ZTNjM2EwNDFk';
    }

    console.log('NotificationSend');
    var collapse_id = jsonData.action_id;
    var data_1 = { action_json: jsonData };
    var dataPost = {
        app_id: oneSignalAppId,
        contents: { en: message },
        headings: { en: title },
        //"included_segments":["All"],
        include_player_ids: player_id_arr,
        // "data":{"action_json": jsonData},
        data: { p2p_notification: data_1 },
        ios_badgeType: 'Increase',
        ios_badgeCount: 1,
        priority: 10,
        collapse_id: collapse_id
    };
    console.log('dataPost', dataPost);

    $.ajax({
        url: 'https://onesignal.com/api/v1/notifications',
        headers: {
            Authorization: 'Basic ' + oneSignalAuthorization,
            'Content-Type': 'application/json'
        },
        type: 'POST',
        data: JSON.stringify(dataPost),
        dataType: 'json',
        success: function (data) {
            console.log('success', data);
        },

        error: function (xhr, ajaxOptions, thrownError) {
            console.log('Request failed: xhr' + JSON.stringify(xhr));
            console.log('Request failed: ajaxOptions' + ajaxOptions);
            console.log('Request failed: thrownError' + thrownError);
        }
    });
}

function btnSendMessageChatResolved(messageType, inputId, message) {
    consoleProvider.log('btnSendMessageChat');

    console.log('check other_user_id', other_user_id_global);

    if (userProvider.getMe() != null) {
        var user_id = userProvider.getMe().user_id;

        var other_user_id = other_user_id_global;

        if (messageType == 'text') {
            var message = $.trim($('#' + inputId).val());

            if (message.length <= 0) {
                alert('Please Enter Message');

                // msgProvider.alert(msgTitle.msgTitleDefualt[language],msgText.emptyChatMsg[language]);

                return false;
            }
        }

        var user_id_send = 'u_' + user_id;

        var other_user_id_send = 'u_' + other_user_id;

        var inbox_id_me = 'u_' + other_user_id;

        var inbox_id_other = 'u_' + user_id;

        var block_status_get = 'no';

        var user_data_other_id_new = FirebaseUserJson.findIndex((x) => x.user_id == other_user_id);

        if (user_data_other_id_new >= 0) {
            consoleProvider.log('chat name user_data_other', user_data_other_id_new);

            var jsonDataInbox = FirebaseUserJson[user_data_other_id_new];

            consoleProvider.log('jsonDataInbox', jsonDataInbox);

            var blockUser = [];

            blockUser.push(jsonDataInbox.myInbox);

            consoleProvider.log('other_user_data blockUser', blockUser);

            if (jsonDataInbox.myInbox != undefined) {
                var other_user_data = getJsonSearch(blockUser, 'other_user_id', user_id);

                if (other_user_data.length > 0) {
                    block_status_get = other_user_data[0].block_status;
                }
            }
        }

        //---------------------- this code for create inbox in first time -----------

        consoleProvider.log('FirebaseInboxJsonChck', FirebaseInboxJson);

        var find_inbox_index = FirebaseInboxJson.findIndex((x) => x.user_id == other_user_id);

        consoleProvider.log('find_inbox_index chat', find_inbox_index);

        consoleProvider.log('other_user_id chat', other_user_id);

        if (find_inbox_index == -1) {
            var jsonUserDataMe = {
                count: 0,

                lastMessageType: '',

                lastMsg: '',

                user_id: other_user_id,

                // other_user_id : other_user_id,

                typing_status: 'no',

                block_status: 'no',

                lastMsgTime: firebase.database.ServerValue.TIMESTAMP
            };

            var jsonUserDataother = {
                count: 0,

                lastMessageType: '',

                lastMsg: '',

                user_id: user_id,

                // other_user_id : user_id,

                typing_status: 'no',

                block_status: 'no',

                lastMsgTime: firebase.database.ServerValue.TIMESTAMP
            };

            if (block_status_get == 'no' || block_status_get == undefined) {
                UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);

                UpdateUserInboxOther(other_user_id_send, inbox_id_other, jsonUserDataother);
            } else {
                UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);
            }

            consoleProvider.log('FirebaseUserJson', FirebaseUserJson);
        }

        //---------------------- this code for create inbox in first time end -----------

        //---------------------- this code for send message to both -----------

        var messageIdME = 'u_' + user_id + '__u_' + other_user_id;

        var messageIdOther = 'u_' + other_user_id + '__u_' + user_id;

        var senderId = user_id;

        var timestamp = new Date().getTime();

        var messageJson = {
            message: message,

            messageType: messageType,

            senderId: senderId,

            timestamp: timestamp
        };

        if (block_status_get == 'no' || block_status_get == undefined) {
            SendUserMessage(messageIdME, messageJson, messageType, inputId);

            SendUserMessage(messageIdOther, messageJson, messageType, inputId);
        } else {
            SendUserMessage(messageIdME, messageJson, messageType, inputId);
        }

        //---------------------- this code for send message to both end -----------

        //----------------update user inbox----------------------------

        var jsonUserDataMe = {
            count: 0,

            lastMessageType: messageType,

            lastMsg: message,

            lastMsgTime: firebase.database.ServerValue.TIMESTAMP
        };

        UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);

        var user_id_me = userProvider.getMe().user_id;

        // var image=userProvider.getMe().image;

        var chat_room_id = other_user_id;

        //chatRoomIdUpdate(user_id_me, chat_room_id);

        //------------------------- get other user inbox -------------------

        consoleProvider.log('other_user_id_send', other_user_id_send);

        consoleProvider.log('user_id_send', user_id_send);

        var count_new = 0;

        var query = firebase.database().ref('users/' + other_user_id_send + '/myInbox/' + inbox_id_other);

        query.once('value', function (data) {
            console.log('chat_data', data.toJSON());

            console.log('user inbox data', data.val().count);

            var count_old = data.val().count;

            console.log('count_old_check', count_old);

            count_new = parseInt(count_old) + 1;

            var jsonUserDataOther = {
                count: count_new,

                lastMessageType: messageType,

                lastMsg: message,

                lastMsgTime: firebase.database.ServerValue.TIMESTAMP
            };

            // alert("dddd");

            console.log('jsonUserDataOther', jsonUserDataOther);

            UpdateUserInboxOther(other_user_id_send, inbox_id_other, jsonUserDataOther);

            //---------------------- send message notifications ----------------

            var title = AppName;

            var message_send = message;

            var SenderName = userProvider.getMe().name;

            if (messageType != 'text') {
                message_send = SenderName + ' sent: ' + messageType;
            } else {
                message_send = SenderName + ' says: ' + message_send;
            }

            var other_user_id = chat_room_id;

            var image = userProvider.getMe().image;

            consoleProvider.log('other_user_id_noti', other_user_id);

            consoleProvider.log('image shoe', image);

            var message_noti = message_send;

            var chat_data_not = { action_id: user_id_me, SenderName: SenderName, image: image };

            var action_json = {
                user_id: user_id_me,

                other_user_id: other_user_id,

                action: 'chat_single',

                action_id: user_id_me,

                SenderName: SenderName,

                image: image,

                chat_data_not: chat_data_not
            };

            // alert(user_id_me);

            if (block_status_get == 'no' || block_status_get == undefined) {
                sendNotificationSignle(title, message_noti, action_json, other_user_id);
            }

            //---------------------- send message notifications end----------------
        });

        global_send_msg_scroll = 1;

        //setTimeout(function(){

        // consoleProvider.log($("#himanshu_scroll")[0].scrollHeight);

        $('#mCSB_1_container')
            .stop()
            .animate({ scrollTop: $('#mCSB_1_container')[0].scrollHeight }, 1000);

        //},800);
    }
}
