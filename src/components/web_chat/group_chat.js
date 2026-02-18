var moreActionsuploadChat = "";
var chat_messages = "";
var chat_messagebar = "";
var userChatId_Globle = '';
var global_chat_page_show_typing = 0;
var global_send_msg_scroll = 0;
var userChatIdGlobal = '';
var URLAPI = 'https://vigyapn.com/app/admin/libraryPHP/';
var URLAPIWEB = 'https://vigyapn.com/app/webservice/';
var URLAPI_img_main = 'https://vigyapn.com/app/webservice/images/';



var URLAPI_img_200X200 = URLAPI_img_main + '200X200/';

console.log('URLAPI_img_200X200', URLAPI_img_200X200);


var error_img_books = "https://vigyapn.com/app/admin/assets/images/placeholder.png'";

var error_img_slider = "https://vigyapn.com/app/admin/assets/images/placeholder.png'";

var error_img_user = "other_profile_pic";

var error_img_image = "https://vigyapn.com/app/admin/assets/images/placeholder.png'";


var AppName = 'Vigyapn App';

var other_user_id_global = 0;

$(document).on('page:beforein', '.page[data-name="group_chat"]', function (e) {

  setcameraOpen();

  setChatRoomIdUpdateAndMsgCount(); // 1. set message count 0 and update chatRoomIdUpdate

  show_user_message_chat();

  send_messgae();

});









var scroll_flag = true;



var update_firebase_check = 0;











function btnStartChatClick() {



  console.log('btnStartChatClick group_id');





  // localStorage.removeItem("chat_other_user_id");

  var user_id = userProvider.getMe().user_id;

  var group_id = localStorage.getItem('group_id');

  console.log("group_id", group_id);



  console.log("FirebaseInboxJson", FirebaseInboxJson);



  var find_inbox_index = FirebaseInboxJson.findIndex(x => x.group_id == group_id);

  consoleProvider.log("find_inbox_index", find_inbox_index);

  if (find_inbox_index >= 0) {

    var group_data = FirebaseInboxJson[find_inbox_index];

    globle_group_joining_time = group_data.group_joining_time;





    $('#mCSB_1_container').html('');



    global_chat_page_show_typing = 1;



    $('.mCSB_1_container').on('scroll', function () {

      var scrollTop = $(this).scrollTop();

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

    });



    var userChatId = group_id;



    if (userChatId_Globle == '') {

      userChatId_Globle = userChatId;

    }



    //------------------------------------- chat open in both user ---------------

    var queryOff = firebase.database().ref('message/').child(userChatId_Globle);

    queryOff.off('child_added');

    userChatId_Globle = userChatId;



    var query = firebase.database().ref('message/' + userChatId).orderByChild("timestamp");

    var findAtTagStatus = '';

    var i = 0;

    var message_array = [];



    // alert('userChatId======'+userChatId);

    var image_index_me = 0;



    var image_index_other = 0;



    query.on('child_added', function (data) {



      console.log('message child_added chat all data', data.toJSON());



      // LoadingEnd();



      var msgKey = data.key;

      var message = data.val().message;

      var messageType = data.val().messageType;

      var senderId = data.val().senderId;

      var timestamp = data.val().timestamp;

      var messageDelete = data.val().messageDelete;

      var sender_name = data.val().name;

      var sender_image = data.val().image;

      var lastMsgTime = convertTimeAllFormat(timestamp, 'date_time_full');

      var messageDataShow = '';

      consoleProvider.log('senderId', senderId);

      consoleProvider.log('user_id', user_id);



      if (messageType == 'text') {



        message = message;



      } else if (messageType == 'image') {



        var message = URLAPI_img_200X200 + message;



        message = '<img src="' + message + '" onerror="this.src=' + error_img_slider + ';" class="chat_send_image" onclick="imageShowBig(this)">';



      }







      if (senderId == user_id) {



        var userImage = userProvider.getMe().image;



        console.log('userImage kA', userImage);



        console.log('URLAPI_img_200X200 kA', URLAPI_img_200X200);



        var user_image_get = URLAPI_img_200X200 + userImage;



        console.log('user_image_get', user_image_get);



        var htmlData = '<div class="send_msg_detail_01">' +

          '<div class="recei_01">' +

          '<div class="receivel_right_01">' +

          '<div class="receive_mesage_detail_01">' +

          '<div class="rseive_name_01">' +

          '<h6>' + lastMsgTime + '</h6>' +

          '<h4>You</h4>' +

          '</div>' +

          '<p><a href="" class="name10na">' + message + '</p>' +

          '</div>' +

          '</div>' +

          '<div class="receivel_left_01">' +

          '<img src="' + user_image_get + '" onerror="this.src=' + error_img_slider + ';">' +

          '</div>' +

          '</div>' +

          '</div>';



        $('#mCSB_1_container').append(htmlData);



      } else {



        var userImage = 'NA';



        var other_user_id = senderId;



        console.log('FirebaseUserJson', FirebaseUserJson);



        var user_data_other = FirebaseUserJson.findIndex(x => x.user_id == other_user_id);



        console.log("user_data_other", user_data_other);



        if (user_data_other != -1) {



          var userDataMe = FirebaseUserJson[user_data_other];



          var userImage = URLAPI_img_200X200 + userDataMe.image;



        }



        var htmlData = '<div class="receive_msg">' +

          '<a href="add_profile.php">' +

          '<div class="recei">' +

          '<div class="receivel_left">' +

          '<img src="' + userImage + '" onerror="this.src=' + error_img_slider + ';" >' +

          '</div>' +



          '<div class="receivel_right">' +

          '<div class="receive_mesage_detail">' +

          '<div class="rseive_name">' +

          '<h4>' + sender_name + ' </h4>' +

          '</div>' +

          '<p>' + message + '</p>' +

          '<h6>' + lastMsgTime + '</h6>' +

          '</div>' +

          '</div>' +

          '</div>' +

          '</a>' +

          '</div>';





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

    } else

      //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)

      if (i == key && obj[i] == val || i == key && val == '') { //

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



  consoleProvider.log("btnSendMessageChat");



  console.log("check other_user_id", other_user_id_global);



  if (userProvider.getMe() != null) {



    var user_id_me_n = userProvider.getMe().user_id;



    var other_user_id = other_user_id_global;



    var group_id = localStorage.getItem('group_id');

    console.log('group_id', group_id);

    return false;



    if (messageType == 'text') {



      var message = $.trim($('#' + inputId).val());



      if (message.length <= 0) {

        alert("Please Enter Message");

        // msgProvider.alert(msgTitle.msgTitleDefualt[language],msgText.emptyChatMsg[language]);

        return false;

      }



    }



    var messageIdME = group_id;



    var userName = userProvider.getMe().name;

    var senderId = userProvider.getMe().user_id;

    var messageJson = {

      message: message,

      messageType: messageType,

      senderId: senderId,

      name: userName,

      messageDelete: "no",

      timestamp: firebase.database.ServerValue.TIMESTAMP,

    }



    var user_id_me = userProvider.getMe().user_id;

    var chat_room_id = group_id;



    chatRoomIdUpdate(user_id_me, chat_room_id);



    SendUserMessageGroup(messageIdME, messageJson, messageType, '', message);



    var group_data = getJsonSearch(FirebaseGroupJson, 'group_id', group_id);

    if (group_data.length > 0) {

      var groupData = group_data[0];

      var members = groupData.members;

      player_id_other_group_arr = [];

      if (typeof members != "undefined") {

        $.each(members, function (key, userObject) {

          console.log('userObject', userObject);

          console.log('key', key);

          var user_id_member = members[key].user_id;

          var user_id_member_check = String(user_id_member);



          var user_data_me = FirebaseUserJson.findIndex(x => x.user_id == user_id_member);

          if (user_data_me != -1) {

            var chat_room_id = FirebaseUserJson[user_data_me].chat_room_id;

            if (user_id_me != user_id_member) {



              if (chat_room_id == "no" || chat_room_id != 'g_' + group_id) {

                var query = firebase.database().ref('users/').child('u_' + user_id_member).child('/myInbox/');

                query.once('value', (data) => {

                  var jsonData = data.toJSON();

                  //consolepro.consolelog("jsonData==---",jsonData);

                  var array_data = snapshotToArray(data);

                  //consolepro.consolelog("array_data",array_data);

                  var getCountData = getJsonSearch(array_data, 'group_id', group_id);



                  if (getCountData.length > 0) {

                    var countData = getCountData[0];

                    if (countData.count != undefined) {

                      var count_old = countData.count;

                    } else {

                      var count_old = 0;

                    }



                    var count_new = parseInt(count_old) + 1;



                    var messageJson = {

                      count: count_new,

                      lastMsg: message,

                      lastMsgType: messageType,

                      messageType: messageType,

                      lastMsgTime: firebase.database.ServerValue.TIMESTAMP,

                    }

                    UpdateUserInboxMe('u_' + user_id_member, group_id, messageJson);

                  }

                });

              } else {



                var messageJson = {

                  lastMsg: message,

                  lastMsgType: messageType,

                  messageType: messageType,

                  lastMsgTime: firebase.database.ServerValue.TIMESTAMP,

                }

                UpdateUserInboxMe('u_' + user_id_member, group_id, messageJson);

              }

            }

          }



        });

        var messageJson = {

          lastMsg: message,

          lastMsgType: messageType,

          messageType: messageType,

          lastMsgTime: firebase.database.ServerValue.TIMESTAMP,

        }

        UpdateUserInboxMe('u_' + user_id_me, group_id, messageJson);

        $.each(members, function (key, userObject) {

          //var my_muted_flag = keyValue.muted_flag;

          var keyValue = members[key]

          var my_muted_flag = keyValue.my_muted_flag;

          var delete_admin_flag = keyValue.delete_admin_flag;

          var user_id_member = keyValue.user_id;



          var user_id_member_check = String(user_id_member);



          var user_id_me_check = String(user_id_me_n);

          if (user_id_me_check != user_id_member_check) {

            var user_data_me = FirebaseUserJson.findIndex(x => x.user_id == user_id_member);



            if (user_data_me != -1) {

              var userDataMe = FirebaseUserJson[user_data_me];

              //consolepro.consolelog("userDataMe---",userDataMe);

              var player_id_other = FirebaseUserJson[user_data_me].player_id;

              var notification_flag = FirebaseUserJson[user_data_me].notification_flag;

              var chat_room_id = FirebaseUserJson[user_data_me].chat_room_id;





              if (player_id_other != 'NA' && player_id_other != 'no' && player_id_other != '123456' && player_id_other != '' || player_id_other != '12345') {



                var checkGroupChatId = group_id;



                if (chat_room_id == 'no' || chat_room_id != checkGroupChatId) {





                  var title = 'Helpee';

                  var message_send = message;

                  var SenderName = userProvider.getMe().name;

                  if (messageType != 'text') {

                    message_send = SenderName + ' sent: ' + messageType;

                  } else {

                    message_send = SenderName + ' says: ' + message_send;

                  }

                  var action_json = {

                    user_id: userProvider.getMe().user_id,

                    group_id: group_id,

                    action: 'group_chat',

                    SenderName: SenderName,

                  };

                  var message_noti = message_send;

                  sendNotificationSignle(title, message_noti, action_json, user_id_member);



                }



              }



            }

          }

        });



      }

    }



    global_send_msg_scroll = 1;



    //setTimeout(function(){



    // consoleProvider.log($("#himanshu_scroll")[0].scrollHeight);



    $("#mCSB_1_container").stop().animate({ scrollTop: $("#mCSB_1_container")[0].scrollHeight }, 1000);



    //},800);    



  }



}



function SendUserMessageGroup(messageId, messageJson, messageType, inputId, message1) {

  console.log("SendUserMessageGroup message1", message1);

  firebase.database().ref('message' + '/' + messageId).push().set(messageJson).then(() => {

    var count_new = 0;

    var query = firebase.database().ref('groups/' + messageId);

    query.once('value', (data) => {



      var count_old = data.val().count;

      count_new = parseInt(count_old) + 1;



      var messageJson = {

        lastMsg: message1,

        /*count: count_new,*/

        lastMsgType: messageType,

        messageType: messageType,

        lastMsgTime: firebase.database.ServerValue.TIMESTAMP

      }



      UpdateGroupData(messageId, messageJson);

    });



  }).catch(function (error) {



  });

}



function snapshotToArray(snapshot) {

  var returnArr = [];



  snapshot.forEach(function (childSnapshot) {

    consoleProvider.log("childSnapshot", childSnapshot);

    var item = childSnapshot.val();

    item.key = childSnapshot.key;



    returnArr.push(item);

  });



  return returnArr;

};



//chat room id



function chatRoomIdUpdate(user_id, other_user_id) {



  consoleProvider.log('chatRoomIdUpdate user_id', user_id);



  consoleProvider.log('chatRoomIdUpdate other_user_id', other_user_id);



  var id = 'u_' + user_id;



  var jsonUserDataMe = {



    chat_room_id: other_user_id,



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



    var find_inbox_index = FirebaseInboxJson.findIndex(x => x.user_id == other_user_id);



    consoleProvider.log('find_inbox_index chat', find_inbox_index);



    consoleProvider.log('other_user_id chat', other_user_id);



    if (find_inbox_index >= 0) {



      var jsonUserDataMe = {



        count: 0,



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







  var find_inbox_index = FirebaseInboxJson.findIndex(x => x.user_id == other_user_id);



  consoleProvider.log('find_inbox_index chat back', find_inbox_index);



  if (find_inbox_index >= 0) {



    var inbox_id_me = 'u_' + other_user_id;



    var user_id_send = 'u_' + user_id;



    var jsonUserDataMe = {



      count: 0,



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



    alert("Please select a valid image  in jpeg , jpg or png formate ");



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



    }



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



          label: true,



        },



        {



          text: 'Camera',



          onClick: ImageCameraFirebase,



        },



        {



          text: 'Gallery',



          onClick: ImageGalleryMultipleFirebase,



        },



      ],



      [



        {



          text: 'Cancel',



          bold: true,



          color: 'red'



        }



      ]



    ],



  });



}







//-------------------------------------- Open Camera -----------------------



function ImageCameraFirebase() {







  global_image = '';







  if (device_type == 'browser') {



    //------------------------- image camera test ----------------



    ImageCameraTestFirebase(base64_camera);



  } else {







    navigator.camera.getPicture(function (imageURI) {



      //-------------------- image preview --------------



      // $('#'+img_id).attr('src', "data:image/png;base64," + imageURI);



      //---------------------- image convert in blob type -----------------



      // alert('camera success');



      var get_image = "data:image/png;base64," + imageURI;



      global_image = dataURLToBlob(get_image);



      uploadChatFilesFirebase(global_image, 'image', '');



    }, function (error) {



      msgProvider.alert('Error Message', error);



      //return false;



    }, {
      quality: 50,



      cameraDirection: 1,



      //destinationType: Camera.DestinationType.FILE_URI,



      destinationType: Camera.DestinationType.DATA_URL,



      mediaType: navigator.camera.MediaType.SAVEDPHOTOALBUM,



      correctOrientation: true,



      allowEdit: true,



    });



  }



}







function ImageCameraTestFirebase(imageURI) {



  // consoleProvider.log(imageURI);



  //------------------- show file uri --------------------- 



  var get_image = "data:image/png;base64," + imageURI;



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







    navigator.camera.getPicture(function (imageURI) {



      //-------------------- image preview --------------



      // $('#'+img_id).attr('src', "data:image/png;base64," + imageURI);



      //---------------------- image convert in blob type -----------------



      var get_image = "data:image/png;base64," + imageURI;



      global_image = dataURLToBlob(get_image);



      uploadChatFilesFirebase(global_image, 'image', '');



    }, function (error) {



      //msgProvider.alert('Error Message',error);



      //return false;



    }, {
      quality: 50,



      //destinationType: Camera.DestinationType.FILE_URI,



      destinationType: Camera.DestinationType.DATA_URL,



      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,



      //mediaType: navigator.camera.MediaType.ALLMEDIA, 



      mediaType: navigator.camera.MediaType.SAVEDPHOTOALBUM,



      correctOrientation: true,



    });



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



      var list = [



        permissions.CAMERA,



        permissions.READ_EXTERNAL_STORAGE,



        permissions.WRITE_EXTERNAL_STORAGE,



      ];



      // alert('deviceVersion===3'+deviceVersion);



      permissions.hasPermission(list, function (status) {



        //consoleProvider.alert('status='+JSON.stringify(status));



        // alert('deviceVersion===4'+deviceVersion);



        if (status.hasPermission == false) {







          // alert("Yes :D ");



          permissions.requestPermissions(list, function (status) {



            //consoleProvider.alert('status='+JSON.stringify(status))



            //-------------------- code here --------------



            //$("#"+popup_id).popup( "close" );



            // alert('deviceVersion===5'+deviceVersion);



            var get_image = '';



            window.imagePicker.getPictures(function (results) {







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







            }, function (error) {



              msgProvider.alert('Error Message', error);



              //return false;



            }, {
              maximumImagesCount: 10 - global_length_var,



              width: 800,



            }



            );



            //-------------------- code here end --------------



          }, function (error) {



            //alert('error='+JSON.stringify(error))



          });



        }//if closed of checked false



      });//closed of permission



    }//if closed of version checked 



    else {



      // alert('deviceVersion===7'+deviceVersion);



      //---------------------------------- this for android below version 6 ------------



      //----------------------- code here  ---------------



      var get_image = '';



      window.imagePicker.getPictures(function (results) {



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



      }, function (error) {



        //msgProvider.alert('Error Message',error);



        //return false;



      }, {
        maximumImagesCount: 10 - global_length_var,



        width: 800,



      });



      //----------------------- code here end ---------------



      //---------------------------------- this for android below version 6 end ------------







    }



  }



  else if (device_type == 'ios') {



    // alert('deviceVersion===ios'+deviceVersion);



    //---------------------------- only for android above version 6 -----------------



    var permissions = cordova.plugins.permissions;



    var list = [



      //permissions.CAMERA,



      permissions.READ_EXTERNAL_STORAGE,



      permissions.WRITE_EXTERNAL_STORAGE,



    ];



    permissions.hasPermission(list, function (status) {



      //consoleProvider.alert('status='+JSON.stringify(status));



      if (status.hasPermission == true) {



        //consoleProvider.alert("Yes :D ");



        permissions.requestPermissions(list, function (status) {



          //consoleProvider.alert('status='+JSON.stringify(status))



          //-------------------- code here -------------



          //$("#"+popup_id).popup( "close" );



          var get_image = '';



          window.imagePicker.getPictures(function (results) {



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



          }, function (error) {



            //msgProvider.alert('Error Message',error);



            //return false;



          }, {
            maximumImagesCount: 10 - global_length_var,



            width: 800,



          }



          );



          //-------------------- code here end --------------



        }, function (error) {



          //consoleProvider.alert('error='+JSON.stringify(error))



        });



      }//if closed of checked false



    });//closed of permission



  }



  else {



    // alert('deviceVersion===10'+deviceVersion);



    //----------------------- code for browser/IOS only ---------------



    //$("#"+popup_id).popup( "close" );



    var get_image = '';



    window.imagePicker.getPictures(function (results) {



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



    }, function (error) {



      //msgProvider.alert('Error Message',error);



      //return false;



    }, {
      maximumImagesCount: 10 - global_length_var,



      width: 800,



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



      theme: 'dark',



    });







  } else {



    chatPhotoBrowserStandalone = app.photoBrowser.create({



      photos: image_arr,



      theme: 'dark',



      swiper: {



        initialSlide: parseInt(image_id),



      },



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



    }



    reader.readAsDataURL(xhr.response);



  };



  xhr.open('GET', url);



  xhr.responseType = 'blob';



  xhr.send();



  return def.promise();



}







//----------------------- upload on server -----------------



function uploadChatFilesFirebase(files, fileType, extension) {

  LoadingStart();

  // alert('files='+files);



  // console.log('files =>',files);



  // console.log('blob =>',dataURLToBlob(files));



  // alert('fileType='+fileType);



  // console.log('fileType =>',fileType);



  // alert('extension='+extension);



  var new_files = dataURLToBlob(files);



  var user_id_me = userProvider.getMe().user_id;



  if (fileType == 'image') {



    var link = URLAPIWEB + 'chat_file_upload.php';



    var formData = new FormData();



    formData.append('user_id', user_id_me);



    formData.append('file_type', fileType);



    formData.append('image', new_files, 'image.png');



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



    dataType: "json",



    success: function (obj) {



      consoleProvider.log('obj', obj);



      if (obj.success == 'true') {



        var message = obj.file;



        var messageType = fileType;



        btnSendMessageChat(messageType, 'chat_msg', message);



        uploadingClose();

        LoadingEnd();





      } else {



        var language = 0;



        alert(obj.msg[language]);



      }



    },



    error: function (xhr, ajaxOptions, thrownError) {







    }



  });



}



function dataURLToBlob(dataURL) {



  var BASE64_MARKER = ';base64,';



  if (dataURL.indexOf(BASE64_MARKER) == -1) {



    var parts = dataURL.split(',');



    var contentType = parts[0].split(':')[1];



    var raw = parts[1];

    return new Blob([raw], { type: contentType });



  }



  else {



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





//.....................................NotiFication Send Function ............................







function sendNotificationSignle(title, message, action_json, user_id_member) {



  consoleProvider.log('sendNotificationGroup action_json', action_json);



  consoleProvider.log('sendNotificationGroup message', message);



  consoleProvider.log('sendNotificationGroup user_id_member', user_id_member);





  consoleProvider.log('update delete_flag', user_id_member);



  consoleProvider.log("sendNotificationSignle FirebaseUserJson", FirebaseUserJson);



  var user_check_inbox = FirebaseUserJson.findIndex(x => x.user_id == user_id_member);



  consoleProvider.log("user_check_inbox subuser", user_check_inbox);



  if (user_check_inbox >= 0) {



    consoleProvider.log('FirebaseUserJson subuser', FirebaseUserJson[user_check_inbox]);



    var player_id_get = FirebaseUserJson[user_check_inbox].player_id;



    var chat_room_id_get = FirebaseUserJson[user_check_inbox].chat_room_id;



    var notification_status = FirebaseUserJson[user_check_inbox].notification_status;







    consoleProvider.log('chat_room_id_get', chat_room_id_get + '//' + chat_room_id_get);

    consoleProvider.log('player_id_get', user_id_member + '//' + player_id_get);

    consoleProvider.log('notification_status', notification_status);







    if (notification_status == 'on') {



      var user_id_me = userProvider.getMe().user_id;



      consoleProvider.log('chat_room_id_get', chat_room_id_get + '!=' + user_id_me);



      if (chat_room_id_get != user_id_me) {



        if (player_id_get != 'no' && player_id_get != '123456') {



          var player_id_arr = [];



          player_id_arr.push(player_id_get);



          consoleProvider.log('player_id_arr', player_id_arr);



          if (player_id_arr.length > 0) {



            oneSignalNotificationSend(title, message, action_json, player_id_arr);



          }



        }



      }



    }



  }



}

