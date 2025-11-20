import { database } from './firebaseConfig'; // Adjust the path as needed
import { ref, update, onDisconnect, onChildAdded, onChildChanged, onChildRemoved } from 'firebase/database';
// import { getDatabase, ref, } from 'firebase/database';
// Initialize Firebase

// export const db = getFirestore(app);
 
export const userProvider = {
    getMe: () => {
        const user = localStorage.getItem('user_arr_data');
        // console.log('users', user);

        return JSON.parse(user);
    },
    setMe: (user) => {
        localStorage.setItem('user_arr_data', JSON.stringify(user));
    },
    removeMe: () => {
        localStorage.removeItem('user_arr_data');
    },
    clearMe: () => {
        localStorage.clear();
    }
};
// let FirebaseUserJson = [];
export const UserFunctionInFireBase = {
    firebaseUserCreate: () => {
        console.log('enter in firebase user');
        var user_arr = userProvider.getMe();
        var user_id = user_arr.user_id;
        var name = user_arr.name;
        var notification_status = 1;
        var user_type = user_arr.user_type;
        var email = user_arr.email;
        // var player_id = localStorage.getItem('player_id');
        var player_id = 123456;
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
    },

    getAllUsers: (setUsers) => {
        consoleProvider.log('getAllUsers');

        const queryUsers = ref(database, 'users');
        // console.log('testing', queryUsers);

        // // Remove any previous listeners to avoid duplication
        // queryUsers.off('child_added');
        // queryUsers.off('child_changed');
        // queryUsers.off('child_removed');

        // Add listener for new users added
        onChildAdded(queryUsers, (data) => {
            try {
                // console.log('users child_added', data.val());
                const newUser = data.val();
                setUsers((prevUsers) => {
                    // Avoid duplicates
                    if (!prevUsers.find((user) => user.user_id === newUser.user_id)) {
                        return [...prevUsers, newUser];
                    }
                    return prevUsers;
                });
            } catch (error) {
                console.error('Error on child_added:', error);
            }
        });

        // Handle user data changes
        onChildChanged(queryUsers, (data) => {
            try {
                console.log('users child_changed', data.val());
                const updatedUser = data.val();
                setUsers((prevUsers) => prevUsers.map((user) => (user.user_id === updatedUser.user_id ? { ...user, ...updatedUser } : user)));
            } catch (error) {
                console.error('Error on child_changed:', error);
            }
        });

        // Handle user removal
        onChildRemoved(queryUsers, (data) => {
            try {
                console.log('users child_removed', data.val());
                const userIdToRemove = data.val().user_id;
                setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== userIdToRemove));
            } catch (error) {
                console.error('Error on child_removed:', error);
            }
        });
    },
    getMyInboxAllData: () => {
        consoleProvider.log('getMyInboxAllDatadffdfgtrrt');
        if (userProvider.getMe() != null) {
            var id = 'u_' + userProvider.getMe().user_id;
        }



    }
};

//---------------------------- console log provider --------------
var consoleProvider = {
    log: function (title, msg) {
        if (msg == null) {
            console.log(title);
        } else {
            console.log(title, msg);
        }
        //console.clear();
    },
    clear: function (title, msg) {
        console.log(title, msg);

        console.clear();
    }
};

export var scroll_flag = true;
export var update_firebase_check = 0;

export const CreateUser = (id, jsonUserData) => {
    if (!id || !jsonUserData) {
        console.error('Invalid input: id and jsonUserData are required.');
        return;
    }

    const userRef = ref(database, `users/${id}`);
    update(userRef, jsonUserData)
        .then(() => {
            console.log('CreateUser success:', id);

            // Handle disconnection
            const onlineStatusRef = ref(database, `users/${id}/onlineStatus`);
            onDisconnect(onlineStatusRef).set('false');
        })
        .catch((error) => {
            console.error('CreateUser error:', error.message);
        });
};

export const CreateOrders = (id, jsonUserData) => {
    consoleProvider.log('id', id);
    consoleProvider.log('CreateOrders', jsonUserData);
    firebase
        .database()
        .ref('orders/' + id)
        .update(jsonUserData)
        .then(function () {
            consoleProvider.log('CreateOrders success.');
        })
        .catch(function (error) {
            consoleProvider.log('CreateOrders error: ' + error.message);
            //msgProvider.alert('Error CreateUser',error.message);
        });
};

export const CreateGroup = (id, jsonUserData, jsonUserDataMe, group_id) => {
    consoleProvider.log('CreateGroup', jsonUserData);
    firebase
        .database()
        .ref('groups/' + id)
        .update(jsonUserData)
        .then(function () {
            consoleProvider.log('Update inbox succeeded.');
            //-------------------- code for add in my inbox this group---------------
            var jsonUserDataInboxMe = {};
            var user_id_me = 'u_' + userProvider.getMe().user_id;
            jsonUserDataInboxMe[id] = {
                group_id: group_id,
                count: 0
            };
            CreateUserInbox(user_id_me, jsonUserDataInboxMe);
            //-------------------- code for add in all user inbox this group---------------
            var jsonUserDataInboxMe = {};
            $.each(jsonUserDataMe, function (index_ass, value_ass) {
                var user_id_new = 'u_' + value_ass.user_id;
                jsonUserDataInboxMe[id] = {
                    group_id: group_id,
                    count: 0
                };
                CreateUserInbox(user_id_new, jsonUserDataInboxMe);
            });
        })
        .catch(function (error) {
            consoleProvider.log('Update Inbox failed: ' + error.message);
            msgProvider.alert('Error CreateGroup', error.message);
        });
};
export const CreateGroupRequest = (id, jsonUserData, jsonUserDataMe, group_id) => {
    consoleProvider.log('CreateGroup', jsonUserData);
    firebase
        .database()
        .ref('groups_request/' + id)
        .update(jsonUserData)
        .then(function () {
            consoleProvider.log('Update inbox succeeded.');
            //-------------------- code for add in my inbox this group---------------
            var jsonUserDataInboxMe = {};
            var user_id_me = 'u_' + group_id;
            jsonUserDataInboxMe[id] = {
                group_id: group_id,
                count: 0
            };
            CreateUserInbox(user_id_me, jsonUserDataInboxMe);
            //-------------------- code for add in all user inbox this group---------------
            var jsonUserDataInboxMe = {};
            $.each(jsonUserDataMe, function (index_ass, value_ass) {
                if (value_ass.accountant_short_name == 'AD' || value_ass.accountant_short_name == 'CA') {
                    var user_id_new = 'u_' + value_ass.user_id;
                    jsonUserDataInboxMe[id] = {
                        group_id: group_id,
                        count: 0
                    };
                    CreateUserInbox(user_id_new, jsonUserDataInboxMe);
                }
            });
        })
        .catch(function (error) {
            consoleProvider.log('Update Inbox failed: ' + error.message);
            msgProvider.alert('Error CreateGroup', error.message);
        });
};
export const CreateUserOther = (id, jsonUserData) => {
    consoleProvider.log('CreateUserOther', jsonUserData);
    firebase
        .database()
        .ref('users/' + id)
        .update(jsonUserData)
        .then(function () {
            consoleProvider.log('Update inbox succeeded.');
        })
        .catch(function (error) {
            consoleProvider.log('Update Inbox failed: ' + error.message);
            msgProvider.alert('Error CreateUserOther', error.message);
        });
};
export const CreateUserInbox = (id, jsonUserData) => {
    if (!id || !jsonUserData) {
        console.error('Invalid input: id and jsonUserData are required.');
        return;
    }
    const userInboxRef = ref(database, 'users/' + id + '/myInbox/');

    update(userInboxRef, jsonUserData)
        .then(() => {
            console.log('Update inbox succeeded.');
        })
        .catch((error) => {
            console.error('Update Inbox failed: ' + error.message);
            alert('Error CreateUserInbox', error.message);
        });
};
export const CreateUserInboxOther = (id, jsonUserData) => {
    consoleProvider.log('CreateUserInboxOther', jsonUserData);
    firebase
        .database()
        .ref()
        .child('users/' + id + '/myInbox/')
        .update(jsonUserData)
        .then(function () {
            consoleProvider.log('Update inbox succeeded.');
        })
        .catch(function (error) {
            consoleProvider.log('Update Inbox failed: ' + error.message);
            msgProvider.alert('Error CreateUserInboxOther', error.message);
        });
};
export const UpdateUserInboxMe = (id, otherId, jsonUserData) => {
    consoleProvider.log('jsonUserData', jsonUserData);
    firebase
        .database()
        .ref('users/' + id + '/myInbox/' + otherId)
        .update(jsonUserData)
        .then(function () {
            consoleProvider.log('Update inbox succeeded.');
        })
        .catch(function (error) {
            consoleProvider.log('Update Inbox failed: ' + error.message);
            msgProvider.alert('Error UpdateUserInboxMe', error.message);
        });
};
export const UpdateUserInboxMeGroup = (id, jsonUserData) => {
    //consoleProvider.log('jsonUserData',jsonUserData);
    firebase
        .database()
        .ref('groups/' + id)
        .update(jsonUserData)
        .then(function () {
            consoleProvider.log('Update inbox succeeded.');
        })
        .catch(function (error) {
            consoleProvider.log('Update Inbox failed: ' + error.message);
            msgProvider.alert('Error UpdateUserInboxMeGroup', error.message);
        });
};
export const UpdateUserInboxMeGroupRequest = (id, jsonUserData) => {
    //consoleProvider.log('jsonUserData',jsonUserData);
    firebase
        .database()
        .ref('groups_request/' + id)
        .update(jsonUserData)
        .then(function () {
            consoleProvider.log('Update inbox succeeded.');
        })
        .catch(function (error) {
            consoleProvider.log('Update Inbox failed: ' + error.message);
            msgProvider.alert('Error UpdateUserInboxMeGroupRequest', error.message);
        });
};
export const UpdateUserInboxOther = (id, otherId, jsonUserData2) => {
    //consoleProvider.log('jsonUserData',jsonUserData2);
    firebase
        .database()
        .ref('users/' + id + '/myInbox/' + otherId)
        .update(jsonUserData2)
        .then(function () {
            consoleProvider.log('Update inbox succeeded.');
        })
        .catch(function (error) {
            consoleProvider.log('Update Inbox failed: ' + error.message);
            msgProvider.alert('Error UpdateUserInboxOther', error.message);
        });
};
export const CreateGroupMembers = (id, jsonUserData) => {
    consoleProvider.log('CreateGroup', jsonUserData);
    firebase
        .database()
        .ref('groups/' + id + '/members/')
        .update(jsonUserData)
        .then(function () {
            consoleProvider.log('Update inbox succeeded.');
        })
        .catch(function (error) {
            consoleProvider.log('Update Inbox failed: ' + error.message);
            msgProvider.alert('Error CreateGroupMembers', error.message);
        });
};
export const UpdateGroupData = (id, jsonUserData) => {
    firebase
        .database()
        .ref('groups/' + id)
        .update(jsonUserData)
        .then(function () { })
        .catch(function (error) {
            console.log('Update Inbox failed: ' + error.message);
        });
};
export const CreateGroupMembersRequest = (id, jsonUserData) => {
    consoleProvider.log('CreateGroup', jsonUserData);
    firebase
        .database()
        .ref('groups_request/' + id + '/members/')
        .update(jsonUserData)
        .then(function () {
            consoleProvider.log('Update inbox succeeded.');
        })
        .catch(function (error) {
            consoleProvider.log('Update Inbox failed: ' + error.message);
            msgProvider.alert('Error CreateGroupMembers', error.message);
        });
};
export const GetUserInbox = (id) => {
    return new Promise((resolve, reject) => {
        const query = firebase.database().ref('users/' + id);
        query.on(
            'value',
            (snapshot) => {
                if (snapshot.exists()) {
                    resolve(snapshot.val()); // Resolve with the fetched data
                } else {
                    reject(new Error('No data available for the given ID.'));
                }
            },
            (error) => {
                reject(error); // Reject in case of an error
            }
        );
    });
};

export const getFormattedTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


// export const  GetUserInbox=(id)=> {
//   //consoleProvider.log('getInbox',id);
//   var query = firebase.database().ref('users/' + id);
//   query.on('value', function (snapshot) {});
// }
// var id='u_56';
// GetUserInbox(id);
export const SendUserMessage = (messageId, messageJson, messageType, inputId) => {
    consoleProvider.log('SendUserMessage messageId', messageId);
    firebase
        .database()
        .ref('message' + '/' + messageId)
        .push()
        .set(messageJson)
        .then(function () {
            consoleProvider.log('SendUserMessage succeeded.');
        })
        .catch(function (error) {
            consoleProvider.log('Update Inbox failed: ' + error.message);
            msgProvider.alert('Error SendUserMessage', error.message);
        });

    if (messageType == 'text') {
        $('#' + inputId).val('');
        $('#' + inputId).focus();
    }
};
export const SendUserMessageGroup = (messageId, messageJson, messageType, inputId) => {
    firebase
        .database()
        .ref('message' + '/' + messageId)
        .push()
        .set(messageJson)
        .then(function () {
            consoleProvider.log('Update inbox succeeded.');
        })
        .catch(function (error) {
            consoleProvider.log('Update Inbox failed: ' + error.message);
            msgProvider.alert('Error SendUserMessageGroup', error.message);
        });

    if (messageType == 'text') {
        $('#' + inputId).val('');
        $('#' + inputId).focus();
    }
};
//----------------------- all Child_added, child_chnaged functions here ------------
//------------------------------- get all users ------------------
var FirebaseUserJson = [];
// export const getAllUsers = () => {
//   consoleProvider.log('getAllUsers');
//   FirebaseUserJson = [];
//   //------------------------------ firbase code get user inbox ---------------
//   var queryUsers = firebase.database().ref('users');
//   // var queryOffLoginUsers = firebase.database().ref('users');
//   // queryOffLoginUsers.off('users');
//   queryUsers.on('child_added', function (data) {
//     consoleProvider.log('users child_added', data.toJSON());
//     FirebaseUserJson.push(data.toJSON());
//     //alert('FirebaseUserJson 1 time='+FirebaseUserJson.length);
//   });
//   //consoleProvider.log('FirebaseUserJson child_added',FirebaseUserJson);
//   //consoleProvider.log('FirebaseUserContactsJson child_added',FirebaseUserContactsJson);
//   queryUsers.on('child_changed', function (data) {
//     consoleProvider.log('users child_changed', data.toJSON());
//     //FirebaseGroupJson.push(data.toJSON());
//     //consoleProvider.log('FirebaseUserJson len',FirebaseUserJson.length);
//     var user_id = data.val().user_id;
//     var name = data.val().name;
//     var email = data.val().email;
//     var images = data.val().images;
//     var onlineStatus = data.val().onlineStatus;
//     var player_id_get = data.val().player_id;
//     var chat_room_id = data.val().chat_room_id;
//     var user_type = data.val().user_type;
//     var myInbox = data.val().myInbox;

//     for (var i = 0; i < FirebaseUserJson.length; i++) {
//       if (FirebaseUserJson[i].user_id == user_id) {
//         FirebaseUserJson[i].name = name;
//         FirebaseUserJson[i].email = email;
//         FirebaseUserJson[i].images = images;
//         FirebaseUserJson[i].myInbox = myInbox;
//         FirebaseUserJson[i].onlineStatus = onlineStatus;
//         FirebaseUserJson[i].player_id = player_id_get;
//         FirebaseUserJson[i].chat_room_id = chat_room_id;
//         FirebaseUserJson[i].user_type = user_type;
//         return false;
//       }
//     }
//     //consoleProvider.log('FirebaseUserJson child_changed',FirebaseUserJson);
//   });
//   //--------------------------------- remove data in inbox --------------
//   //var queryUpdate = firebase.database().ref('users/'+id+'/myInbox/');
//   queryUsers.on('child_removed', function (data) {
//     //consoleProvider.log('inbox update removed',data.toJSON());
//     //consoleProvider.log('inbox update removed user_id',data.val().user_id);
//     //consoleProvider.log('FirebaseUserJson check',FirebaseUserJson);
//     var user_id = data.val().user_id;
//     for (var i = 0; i < FirebaseUserJson.length; i++) {
//       if (FirebaseUserJson[i].user_id === user_id) {
//         FirebaseUserJson.splice(i, 1);
//         //consoleProvider.log('FirebaseUserJson check removed',FirebaseUserJson);
//         return false;
//       }
//     }
//   });
// };
//getAllUsers();
//--------------------------- get all groups -------------------
var FirebaseGroupJson = [];
export const getAllGroups = () => {
    consoleProvider.log('getAllGroups');
    FirebaseGroupJson = [];
    //------------------------------ firbase code get user inbox ---------------
    var id = 'u_' + userProvider.getMe().user_id;
    if (id != null) {
        var queryOffLoginGroup = firebase.database().ref('groups');
        queryOffLoginGroup.off('child_added');
        var queryGroup = firebase.database().ref('groups');
        queryGroup.on('child_added', function (data) {
            consoleProvider.log('group child_added', data.toJSON());
            FirebaseGroupJson.push(data.toJSON());
            consoleProvider.log('FirebaseGroupJson child_added', FirebaseGroupJson);
        });

        queryGroup.on('child_changed', function (data) {
            consoleProvider.log('group child_changed', data.toJSON());
            //FirebaseGroupJson.push(data.toJSON());
            consoleProvider.log('FirebaseGroupJson len', FirebaseGroupJson.length);

            var group_id = data.val().group_id;
            var name = data.val().name;
            var document_name = data.val().document_name;
            var accountant_type_short_name = data.val().accountant_type_short_name;
            var description = data.val().description;
            var images = data.val().images;
            var image = data.val().image;
            var active_flag = data.val().active_flag;
            var group_type = data.val().group_type;
            var count = data.val().count;
            var lastMsgType = data.val().lastMsgType;
            var lastMsg = data.val().lastMsg;
            var lastMsgTime = data.val().lastMsgTime;
            var members = data.val().members;
            var user_id = data.val().user_id;
            var create_admin_user_id = data.val().create_admin_user_id;

            var user_id_me = userProvider.getMe().user_id;

            //----------------- check this group me or not ---------------
            consoleProvider.log('FirebaseGroupJsonFirebaseGroupJson', FirebaseGroupJson);
            var get_index = FirebaseGroupJson.findIndex((x) => x.group_id == group_id);
            consoleProvider.log('get_index', get_index);
            if (get_index >= 0) {
                consoleProvider.log('FirebaseGroupJson', FirebaseGroupJson[get_index]);
                for (var i = 0; i < FirebaseGroupJson.length; i++) {
                    if (FirebaseGroupJson[i].group_id === group_id) {
                        FirebaseGroupJson[i].name = name;
                        FirebaseGroupJson[i].document_name = document_name;
                        FirebaseGroupJson[i].accountant_type_short_name = accountant_type_short_name;
                        FirebaseGroupJson[i].description = description;
                        FirebaseGroupJson[i].images = images;
                        FirebaseGroupJson[i].active_flag = active_flag;
                        FirebaseGroupJson[i].group_type = group_type;
                        FirebaseGroupJson[i].count = count;
                        FirebaseGroupJson[i].lastMsgType = lastMsgType;
                        FirebaseGroupJson[i].lastMsg = lastMsg;
                        FirebaseGroupJson[i].lastMsgTime = lastMsgTime;
                        FirebaseGroupJson[i].members = members;
                        FirebaseGroupJson[i].user_id = user_id;
                        FirebaseGroupJson[i].create_admin_user_id = create_admin_user_id;
                    }
                }
            }
        });
        consoleProvider.log('FirebaseGroupJson child_changed', FirebaseGroupJson);
        //--------------------------------- remove data in inbox --------------
        //var queryUpdate = firebase.database().ref('users/'+id+'/myInbox/');
        queryGroup.on('child_removed', function (data) {
            consoleProvider.log('inbox update removed', data.toJSON());
            consoleProvider.log('inbox update removed group_id', data.val().group_id);

            consoleProvider.log('FirebaseGroupJson check', FirebaseGroupJson);
            var group_id = data.val().group_id;
            for (var i = 0; i < FirebaseGroupJson.length; i++) {
                if (FirebaseGroupJson[i].group_id === group_id) {
                    FirebaseGroupJson.splice(i, 1);
                    consoleProvider.log('currentPage', currentPage);
                    if (currentPage == 'group_show') {
                        $('#group_id_' + group_id).hide();
                        $('#group_id_' + group_id).remove();
                    } else if (currentPage == 'inbox') {
                        $('.inbox_' + group_id).hide();
                        $('.inbox_' + group_id).remove();
                    }

                    consoleProvider.log('FirebaseGroupJson check removed', FirebaseGroupJson);
                    return false;
                }
            }
        });
    }
};
//getAllGroups();
//------------------------------ get inbox page code ------------------
var currentPage = '';
var FirebaseInboxJson = [];
//--------------------------- get all groups -------------------

export const getMyInboxAllData = () => {
    consoleProvider.log('getMyInboxAllDatadffdfgtrrt');

    //------------------------------ firbase code get user inbox ---------------
    if (userProvider.getMe() != null) {
        // alert("himanshu");
        var id = 'u_' + userProvider.getMe().user_id;
        // alert(id);
        var queryOffLogin = firebase.database().ref('users/').child(id).child('/myInbox/');
        queryOffLogin.off('child_added');

        //---------------------------- inbox get first time all ---------------
        console.log('id', id);
        var query = firebase.database().ref('users/' + id + '/myInbox/');
        query.on('child_added', function (data) {
            consoleProvider.log('nielsh');
            //consoleProvider.log('data',data);

            FirebaseInboxJson.push(data.toJSON());
            console.log('FirebaseInboxJson-1', FirebaseInboxJson);
        });
        //--------------------------------- update code --------------
        var queryUpdate = firebase.database().ref('users/' + id + '/myInbox/');
        queryUpdate.on('child_changed', function (data) {
            consoleProvider.log('inbox update child_changed', data.toJSON());
            var inboxKeyName = data.key.charAt(0);
            consoleProvider.log('inboxKeyName', inboxKeyName);

            var count = data.val().count;
            var lastMsg = data.val().lastMsg;
            var lastMsgTime = data.val().lastMsgTime;
            var lastMessageType = data.val().lastMessageType;
            var user_id = data.val().user_id;
            var order_id = data.val().order_id;
            var order_number = data.val().order_number;
            var chat_type = data.val().chat_type;
            for (var i = 0; i < FirebaseInboxJson.length; i++) {
                if (FirebaseInboxJson[i].other_user_id == user_id) {
                    FirebaseInboxJson[i].count = count;
                    FirebaseInboxJson[i].lastMsg = lastMsg;
                    FirebaseInboxJson[i].lastMsgTime = lastMsgTime;
                    FirebaseInboxJson[i].lastMessageType = lastMessageType;
                    // FirebaseInboxJson[i].order_number = order_number;
                }
            }
            //----------------- check current page is chat page show update inbox ----------
            //--------------------- this code  run only index page curremt page -------------
            var user_id_me = userProvider.getMe().user_id;
            var other_user_id = user_id;
            consoleProvider.log('other_user_id', other_user_id);
            var user_check_inbox_count = FirebaseUserJson.findIndex((x) => x.user_id == other_user_id);
            consoleProvider.log('user_check_inbox_count', user_check_inbox_count);
            if (user_check_inbox_count >= 0) {
                consoleProvider.log('FirebaseUserJson', FirebaseUserJson[user_check_inbox_count]);
                var userData = FirebaseUserJson[user_check_inbox_count];
                consoleProvider.log('userDataMeuserDataMe', userData);

                var userImage = URLAPI_img_200X200 + userData.image;

                var userName = userData.name;
                var userEmail = userData.email;
                var onlineStatus = userData.onlineStatus;
                var chat_room_id_other = userData.chat_room_id;

                var onlineStatusHtml = '';
                if (onlineStatus == 'true') {
                    onlineStatusHtml = '<span class="msg-status"></span>';
                }

                var lastMsgShow = '';
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

                if (lastMsgTime != '') {
                    var lastMsgTimeShow = convertTimeAllFormat(lastMsgTime, 'date_time');

                    var countHtml = '';
                    if (count > 0) {
                        countHtml = '<div class="n_count">' + '<span>' + count + '</span>' + '</div>';
                    }
                    consoleProvider.log('lastMsgShowlastMsgShow', lastMsgShow);
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
                        ';">' +
                        '</div>' +
                        '<div class="message_section">' +
                        '<div class="name_time">' +
                        '<h3>' +
                        userName +
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
                    $('#chat_list_' + other_user_id).hide();
                    $('#chat_list_' + other_user_id).remove();
                    $('#chat_meassage_inbox_list').append(htmlData);
                    $('#chat_meassage_inbox_list li').sort(sortInboxAll).appendTo('#chat_meassage_inbox_list');
                }
            }
        });
    }
};
//getMyInboxAllData();
//----------------------- all Child_added, child_chnaged functions here end ------------
//----------------------- all other functions -------------
//----------------------------------- inbox sorting code -------------------
export const sortInboxAll = (a, b) => {
    return $(b).data('position') < $(a).data('position') ? -1 : 1;
};

export const timeSince = (datetime) => {
    const now = new Date();
    const inputDate = new Date(datetime);
    const diffInSeconds = Math.floor((now - inputDate) / 1000);

    if (diffInSeconds < 60) {
        return `just now`;
        // return `${diffInSeconds}s ago`; // Seconds
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} min ago`; // Minutes
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}h ago`; // Hours
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days}d ago`; // Days
    } else if (diffInSeconds < 31536000) {
        const months = Math.floor(diffInSeconds / 2592000);
        return `${months} month${months > 1 ? 's' : ''} ago`; // Months
    } else {
        const years = Math.floor(diffInSeconds / 31536000);
        return `${years} year${years > 1 ? 's' : ''} ago`; // Years
    }
};

export const getPageName = (url) => {
    //var filename = document.location.href.match(/[^\/]+$/)[0];
    var index = url.lastIndexOf('/') + 1;
    var filenameWithExtension = url.substr(index);
    var filename = filenameWithExtension.split('.')[0]; // <-- added this line
    return filename; // <-- added this line
};

export const convertTimeAllFormat = (time11, format) => {
    time11 = parseInt(time11);

    var date1 = new Date(time11);
    var curr_day = date1.getDay();
    var curr_date = date1.getDate();
    var curr_month = date1.getMonth(); //Months are zero based
    var curr_year = date1.getFullYear();
    var hours = date1.getHours();
    var minutes = date1.getMinutes();

    // consoleProvider.log('hours',hours);
    // consoleProvider.log('minutes',minutes);
    var ampm;
    var strTime;
    var strTimeAll;
    if (format == 12) {
        ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        strTime = hours + ':' + minutes + ' ' + ampm;
    } else if (format == 24) {
        ampm = hours >= 12 ? 'PM' : 'AM';
        //hours = hours < 10 ? '0'+hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        strTime = hours + ':' + minutes;
    } else if (format == 'other') {
        ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        strTimeAll = hours + ':' + minutes + ' ' + ampm;
        strTime = curr_date + '. ' + m_names_sort[curr_month] + ' ' + curr_year + ' ' + strTimeAll;
    } else if (format == 'ago') {
        strTime = timeSince(new Date(time11));
        //consoleProvider.log(new Date(time11));
    } else if (format == 'date_time') {
        var date = new Date(time11);
        var seconds = Math.floor((new Date() - date) / 1000);
        var interval = Math.floor(seconds / 3600);
        if (interval <= 24) {
            ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            strTime = hours + ':' + minutes + ' ' + ampm;
        } else {
            curr_month = date1.getMonth() + 1; //Months are zero based
            curr_year = date1.getFullYear();
            var curr_year_small = String(curr_year);
            consoleProvider.log('curr_year_small', curr_year_small);
            curr_year_small = curr_year_small.substring(2, 4);
            consoleProvider.log('curr_year_small', curr_year_small);
            strTime = curr_month + '/' + curr_date + '/' + curr_year_small;
        }
    } else if (format == 'date_time_full') {
        date = new Date(time11);
        seconds = Math.floor((new Date() - date) / 1000);
        interval = Math.floor(seconds / 3600);
        if (interval <= 24) {
            ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            strTime = hours + ':' + minutes + ' ' + ampm;
        } else {
            curr_month = date1.getMonth() + 1; //Months are zero based
            curr_year = date1.getFullYear();
            curr_year_small = String(curr_year);
            consoleProvider.log('curr_year_small', curr_year_small);
            curr_year_small = curr_year_small.substring(2, 4);
            consoleProvider.log('curr_year_small', curr_year_small);
            ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            strTimeAll = hours + ':' + minutes + ' ' + ampm;
            strTime = curr_month + '-' + curr_date + '-' + curr_year_small + ' ' + strTimeAll;
        }
    }

    return strTime;
}
