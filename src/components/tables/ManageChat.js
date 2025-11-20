/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import './managechat.css';
import axios from 'axios';
import { IMAGE_PATH, placeholder } from '../../constant/constant';
// import placeholder from './placeholder.jpg';
import { PiPaperPlaneRightLight } from "react-icons/pi";


import { UserFunctionInFireBase, userProvider, timeSince, getFormattedTime } from '../web_chat/firebaseProvider';
import {
    getDatabase,
    ref,
    onChildAdded,
    onChildChanged,
    off,
    orderByChild,
    onValue,
    query,
    push,
    get,
    set,
    update
} from 'firebase/database';
import moment from 'moment';

const database = getDatabase();
//old code
const ManageChat = () => {
    const [userDetails, setUserDetails] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [FirebaseInboxJson, setFirebaseInboxJson] = useState([]);
    const inboxRefData = useRef([]);
    const messageEndRef = useRef(null); // Ref for auto-scroll
    const [textValue, setTextValue] = useState(''); // Current chat messages to show
    const [otherUserId, setOtherUserId] = useState(''); // Current chat messages to show
    const [emptyPage, setEmptyPage] = useState(false);
    const [model, setmodel] = useState(false);

    const [currentOtherUserId, setCurrentOtherUserId] = useState(null); // Currently active user
    const [messages, setMessages] = useState([]); // Current chat messages to show

    const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
    const [searchTerm, setSearchTerm] = useState('');
    const [sortedUsersData, setSortedUserData] = useState('');
    const [storeMessages, setStoreMessages] = useState([]);
    const [showmessage, setShowMessage] = useState(false);

    const fetchUsers = () => {

        const db = getDatabase();
        const usersRef = ref(db, "users");
        console.log('usersRef', usersRef);
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            console.log('data', data);

            if (data) {
                const users = Object.keys(data)
                    .map((key) => ({
                        id: key,
                        ...data[key],
                    }));


                setUsers(users);

                console.log('Filtered users with user_type 4', users);
            }
        });
    };



    useEffect(() => {
        fetchUsers();
        const cleanup = UserFunctionInFireBase.getAllUsers((data) => setUsers(data));
        return () => {
            cleanup && cleanup();
        };
    }, []);


    console.log('check user', users)
    // // Fetch logged-in user data
    useEffect(() => {
        const getUserDetails = async () => {
            const user = userProvider.getMe();
            if (user) {
                setCurrentUserId('u_' + user.user_id);
            }
        };
        getUserDetails();
    }, []);

    // // Listen for Firebase inbox updates
    useEffect(() => {
        if (currentUserId) {
            const inboxRef = ref(database, `users/${currentUserId}/myInbox/`);

            const handleChildAdded = (snapshot) => {
                const data = snapshot.val();
                console.log('snapshot child added', data);
                if (data) {
                    inboxRefData.current.push({ ...data, id: snapshot.key });
                    setFirebaseInboxJson([...inboxRefData.current]);
                }
            };

            const handleChildChanged = (snapshot) => {
                const updatedData = snapshot.val();
                console.log('snapshot child changed', updatedData);
                if (updatedData) {
                    inboxRefData.current = inboxRefData.current.map((item) => (item.id === snapshot.key ? { ...item, ...updatedData } : item));
                    setFirebaseInboxJson([...inboxRefData.current]);
                }
            };

            onChildAdded(inboxRef, handleChildAdded);
            onChildChanged(inboxRef, handleChildChanged);

            return () => off(inboxRef);
        }
    }, [currentUserId]);

    // // Map user details to inbox data
    const mapUserDetailsToInbox = useCallback(
        (inboxData) => {
            const mappedUsers = inboxData
                .filter((inbox) => inbox.id)
                .map((inbox) => {
                    console.log('inbox other user details:', inbox);

                    const matchedUser = users.find((user) => `u_${user.id}` == `u_${inbox.id}`);


                    return matchedUser
                        ? {
                            ...inbox,
                            name: matchedUser.name,
                            image_html: matchedUser.image || placeholder
                        }
                        : { ...inbox, name: 'Unknown User', image_html: placeholder };
                });
            var sortedUsers = mappedUsers.sort((a, b) => new Date(b.lastMsgTime) - new Date(a.lastMsgTime)); // Sort by timestamp in descending order;

            console.log('mappedUsers inbox details:', mappedUsers);
            setSortedUserData(sortedUsers);
            setUserDetails(sortedUsers);
            console.log('userDetails:', sortedUsers);
        },
        [users, setUserDetails]
    );

    useEffect(() => {
        mapUserDetailsToInbox(FirebaseInboxJson);

    }, [FirebaseInboxJson, mapUserDetailsToInbox]);

    // //show chat message
    const btnStartChatClick = (other_user_id) => {
        setCurrentOtherUserId(other_user_id);


        const user_id = userProvider.getMe().user_id;
        const userChatId = `u_${user_id}__u_${other_user_id}`;
        console.log('userChatId', userChatId);

        CountUpdated(user_id, other_user_id); // function call for count update 0;

        // Query reference using orderByChild and query
        const messagesRef = ref(database, `message/${userChatId}`);
        const messagesQuery = query(messagesRef, orderByChild('timestamp'));

        // Set up real-time listener
        const unsubscribe = onValue(messagesQuery, (snapshot) => {
            const messages = snapshot.val();
            if (messages) {
                const messagesArray = Object.values(messages);
                setMessages(messagesArray);
                console.log('Fetched messages:', messagesArray);
            }
        });

        // if (showmessage) {
        // setMessages(storeMessages);
        // setShowMessage(false);
        // }

        // Cleanup when component unmounts or clicking another chat
        return () => {
            unsubscribe();
        };
    };

    // Count update in database

    const CountUpdated = (user_id_me, other_user_id) => {
        const user_id = `u_${user_id_me}`;
        const inboxId = `u_${other_user_id}`;
        console.log('Updating count to 0 for', user_id, inboxId);

        // Firebase path to the specific user's inbox count
        const countRef = ref(database, `users/${user_id}/myInbox/${inboxId}/count`);

        // Update the count to 0
        set(countRef, 0)
            .then(() => {
                console.log('Count reset to 0 successfully.');
            })
            .catch((error) => {
                console.error('Failed to reset count: ', error.message);
                alert('Error resetting count: ' + error.message);
            });
    };

    //  message store in database
    function SendUserMessage(messageId, messageJson, messageType) {
        console.log('SendUserMessage messageId', messageId);

        // Store the message in the database
        const messageRef = ref(database, 'message/' + messageId);
        push(messageRef, messageJson)
            .then(() => {
                console.log('SendUserMessage succeeded.');
            })
            .catch((error) => {
                console.error('SendUserMessage failed: ', error.message);
                alert('Error sending message: ' + error.message);
            });

        // Clear the input field for text messages
        if (messageType === 'text') {
            setTextValue('');
        }
    }

    // admin inbox update when admin send user message
    const UpdateAdminInbox = (currentUserId, otherUserId, properties) => {
        if (!currentUserId || !otherUserId) {
            console.error('Invalid user IDs provided.');
            alert('Error: Invalid user IDs.');
            return;
        }

        const userIdPath = `u_${currentUserId}`;
        const inboxIdPath = `u_${otherUserId}`;

        // Firebase path to the specific user's inbox
        const messageRef = ref(database, `users/${userIdPath}/myInbox/${inboxIdPath}`);

        // Update or set the properties
        update(messageRef, properties)
            .then(() => {
                console.log('Message properties set successfully.');
            })
            .catch((error) => {
                console.error('Failed to set message properties:', error.message);
                alert('Error setting message properties: ' + error.message);
            });
    };

    // Function to get and format the current date and time

    const btnSendMessageChat = (messageType, textValue, otherUserId) => {
        const currentUser = userProvider.getMe();
        console.log('textValue', textValue);
        if (!currentUser) {
            alert('User not logged in. Please log in to send a message.');
            return;
        }
        console.log('current User', currentUser);

        const userId = currentUser.user_id;

        if (messageType === 'text') {
            const message = textValue?.trim();

            if (!message) {
                alert('Please enter a message.');
                return;
            }

            // const user_id_send = 'u_' + userId;
            // const other_user_id_send = 'u_' + otherUserId;

            const messageIdME = 'u_' + userId + '__u_' + otherUserId;
            const messageIdOther = 'u_' + otherUserId + '__u_' + userId;

            const timestamp = getFormattedTime(); // Use ISO format for timestamp

            //update for message
            const messageJson = {
                message: message,
                messageType: messageType,
                senderId: userId,
                timestamp: timestamp,
                msg_time: timestamp,
                user_type: 0, // Adjust user_type value if necessary
                last_seen: 'no'
            };

            //update for admin inbox by user id
            const adminInboxMessageJson = {
                // block_status: 'no',
                // count: 0,
                lastMessageType: messageType,
                lastMsg: message,
                lastMsgTime: timestamp,
                // last_seen: 'no',
                // match_status: 'yes',
                msg_time: timestamp
                // typing_status: 'no'
            };

            // Simulated block status logic
            let block_status_get = 'no';

            const user_data_other_id_new = users.find((user) => user.user_id === otherUserId);

            if (user_data_other_id_new) {
                const jsonDataInbox = Array.isArray(user_data_other_id_new.myInbox) ? user_data_other_id_new.myInbox : [];

                const other_user_data = jsonDataInbox.filter((entry) => entry.other_user_id === userId);

                if (other_user_data.length > 0) {
                    block_status_get = other_user_data[0].block_status;
                }
            }

            // Send message based on block status
            if (block_status_get === 'no' || block_status_get === undefined) {
                SendUserMessage(messageIdME, messageJson, messageType);
                SendUserMessage(messageIdOther, messageJson, messageType);
                UpdateAdminInbox(userId, otherUserId, adminInboxMessageJson);
            } else {
                console.warn('Message blocked due to block status:', block_status_get);
                SendUserMessage(messageIdME, messageJson, messageType);
                UpdateAdminInbox(userId, otherUserId, adminInboxMessageJson);
            }
        }
    };

    // Auto-scroll to the latest message
    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom(); // Scroll when messages update
    }, [messages]);

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase().trim();
        if (term) {
            setSearchTerm(term);

            const filteredList = userDetails.filter((user) => user.name.toLowerCase().trim().includes(term));
            setFilteredUsers(filteredList);
            setUserDetails(filteredUsers);
        } else {
            setUserDetails(sortedUsersData);
        }
    };


    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-4">
                    <div className="left">
                        <div className="left-chat">
                            <h2>Message</h2>
                            <div className="search-container">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="search-input"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>


                            <ul className="nav">
                                {userDetails.map((user, index) => (
                                    <li
                                        key={user.user_id}
                                        onClick={() => {
                                            btnStartChatClick(user.user_id);
                                            setOtherUserId(user.user_id);
                                            setTextValue('');
                                            setEmptyPage(true);
                                            //  setShowMessage(true);
                                        }}
                                        aria-hidden="true"
                                    >
                                        <div className="d-flex">
                                            <div className={`image ${user.count > 0 ? 'avatar avatar-online' : ''}`}>

                                                <img
                                                    src={user.user_image ? `${IMAGE_PATH}${user.user_image}` : `${placeholder}`}
                                                    className="img-fluid"
                                                    alt="image"
                                                    title="image"
                                                />
                                            </div>
                                            <div className="d-flex justify-content-between w-100">
                                                <div>
                                                    <h5>{user.name}  {user.user_image}</h5>
                                                    <div className="msg">{user.lastMsg || ''}</div>
                                                </div>
                                                <div>
                                                    <div className="msg">{timeSince(user.lastMsgTime)}</div>
                                                    {/* {user.count > 0 ? <div className="badge badge-success rounded-pill">{user.count || ''}</div> : ''} */}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right side chatbox */}

                <div className="col-lg-8">
                    <div className="right">
                        <div className="right-chat">
                            <div className="msg-box">
                                {currentOtherUserId ? (
                                    <>
                                        {/* Dynamic Chat Header */}
                                        <div className="chat-header">
                                            <div className="notify-block d-flex">
                                                <div className="media-img-wrap flex-shrink-0">
                                                    <div className="avatar">
                                                        {/* <div className="avatar avatar-online"> */}
                                                        <img src={placeholder} alt="User Image" className="avatar-img rounded-circle" />
                                                    </div>
                                                </div>
                                                <div className="ms-2 media-body flex-grow-1">
                                                    <div className="user-name d-inline me-2" style={{ fontWeight: '600', color: '#000' }}>
                                                        {userDetails.find((u) => u.user_id === currentOtherUserId)?.name}
                                                    </div>
                                                    {/* <div className="user-status">online</div> */}
                                                </div>
                                            </div>
                                        </div>

                                        {/* <div className="col-lg-12">
                                            {messages.length > 0 ? (
                                                messages.map((msg) => (
                                                    <>
                                                        <div className={`${userProvider.getMe().user_id == msg.senderId ? 'float-right' : 'float-left'}  mb-2`}>

                                                            <div className={`${userProvider.getMe().user_id == msg.senderId ? 'comment-own' : 'comment'}  mb-2`} key={msg.id}>
                                                                <div className="avtar-img">
                                                                    <img src={placeholder} alt="User" className="avatar-img rounded-circle" />
                                                                </div>
                                                                <div className="media-body flex-grow-1">
                                                                    <div className="msg-box new-msg">
                                                                        <div className="box">
                                                                            <p>{msg.message}</p>
                                                                            <ul className="chat-msg-info">
                                                                                <li>
                                                                                    <div className="chat-time">
                                                                                        <span>{moment(msg.msg_time).format("DD MMM YYYY HH:MM A")}</span>
                                                                                    </div>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                ))
                                            ) : (
                                                <div className="no-chat">Select a user to view the conversation.</div>
                                            )}
                                            <div ref={messageEndRef} />
                                        </div>
 */}
                                        <div className="col-lg-12 chat-messages-container">
                                            {messages.length > 0 ? (
                                                messages.map((msg) => (
                                                    <div key={msg.id} className={`message-wrapper ${userProvider.getMe().user_id == msg.senderId ? 'sent' : 'received'}`}>
                                                        <div className="message-content">
                                                            <div className="avatar-container">
                                                                <img src={user_image} alt="User" className="message-avatar" />
                                                            </div>
                                                            <div className="message-bubble">
                                                                <p className="message-text">{msg.message}</p>
                                                                <div className="message-time">
                                                                    <span>{moment(msg.msg_time).format("DD MMM YYYY HH:mm A")}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="no-chat">Select a user to view the conversation.</div>
                                            )}
                                            <div ref={messageEndRef} />
                                        </div>






                                    </>
                                ) : (
                                    <div className="no-chat">Select a user to view the conversation.</div>
                                )}
                            </div>
                            {emptyPage && (
                                <div className="col-12 d-flex">
                                    <div className="btn-file" style={{ padding: '10px', position: 'relative' }}>
                                        {/* <i className="fa fa-paperclip" style={{ fontSize: '24px' }}></i> */}
                                        {/* <input type="file" className="file" /> */}
                                    </div>
                                    <input
                                        className="form-control message-user"
                                        id="comments"
                                        placeholder="Type your message..."
                                        value={textValue}
                                        type="text"
                                        onChange={(e) => setTextValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') btnSendMessageChat('text', textValue, otherUserId);
                                        }}
                                    />
                                    <button type="button" onClick={() => btnSendMessageChat('text', textValue, otherUserId)} className="msg-send-btn ms-2">
                                        {/* <i className="fab fa-telegram-plane"></i> */}
                                        <PiPaperPlaneRightLight />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageChat;




