import React, { useState } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Divider,
    Paper,
    InputBase,
    IconButton,
    Badge
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export default function ManageChats() {
    // Sample chat data
    const [chats, setChats] = useState([
        {
            id: 1,
            userName: 'John Doe',
            userId: 'user101',
            userAvatar: 'JD',
            ownerName: 'Brian Maxwell',
            ownerId: 'owner201',
            ownerAvatar: 'BM',
            messages: [
                { id: 1, sender: 'user', text: 'Hi, is the boat available for the weekend', time: '10:30 AM' },
                { id: 2, sender: 'owner', text: 'Sure, which date are you looking for?', time: '10:32 AM' },
                { id: 3, sender: 'user', text: 'This Saturday from 9 AM to 5 PM', time: '10:35 AM' },
            ],
            unread: 0,
            active: true
        },
        {
            id: 2,
            userName: 'Glenn Maxwell',
            userId: 'user102',
            userAvatar: 'GM',
            ownerName: 'Samuel Smith',
            ownerId: 'owner202',
            ownerAvatar: 'SS',
            messages: [
                { id: 1, sender: 'user', text: 'Is equipment included?', time: 'Yesterday' },
                { id: 2, sender: 'owner', text: 'Yes, all basic equipment is included', time: 'Yesterday' },
            ],
            unread: 1,
            active: false
        },
        {
            id: 3,
            userName: 'Mitchel Johnson',
            userId: 'user103',
            userAvatar: 'MJ',
            ownerName: 'Micheal Jackson',
            ownerId: 'owner203',
            ownerAvatar: 'MJ',
            messages: [
                { id: 1, sender: 'owner', text: 'Your booking is confirmed for next week', time: '2 days ago' },
                { id: 2, sender: 'user', text: 'Great! Looking forward to it', time: '2 days ago' },
            ],
            unread: 0,
            active: false
        },
        {
            id: 4,
            userName: 'Devon Conwoy',
            userId: 'user104',
            userAvatar: 'DC',
            ownerName: 'Andrew Smith',
            ownerId: 'owner204',
            ownerAvatar: 'AS',
            messages: [
                { id: 1, sender: 'user', text: 'Do you have any discounts for group bookings?', time: '1 week ago' },
                { id: 2, sender: 'owner', text: 'Yes', time: '1 week ago' },
                { id: 3, sender: 'user', text: 'Perfect, I\'ll get back to you with details', time: '1 week ago' },
            ],
            unread: 0,
            active: false
        }
    ]);

    const [selectedChat, setSelectedChat] = useState(0);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const updatedChats = [...chats];
        updatedChats[selectedChat].messages.push({
            id: updatedChats[selectedChat].messages.length + 1,
            sender: 'admin',
            text: newMessage,
            time: 'Just now'
        });

        setChats(updatedChats);
        setNewMessage('');
    };

    return (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
            {/* Chat list sidebar */}
            <Box sx={{ width: '350px', borderRight: '1px solid #e0e0e0', overflowY: 'auto' }}>
                <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
                    All Chats
                </Typography>
                <List>
                    {chats.map((chat, index) => (
                        <React.Fragment key={chat.id}>
                            <ListItem
                                button
                                onClick={() => setSelectedChat(index)}
                                sx={{
                                    bgcolor: selectedChat === index ? '#f5f5f5' : 'inherit',
                                    '&:hover': { bgcolor: '#fafafa' }
                                }}
                            >
                                <ListItemAvatar>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        badgeContent={
                                            chat.active ? (
                                                <FiberManualRecordIcon sx={{ color: '#4caf50', fontSize: '12px' }} />
                                            ) : null
                                        }
                                    >
                                        <Avatar sx={{ bgcolor: '#3f51b5' }}>
                                            {chat.userAvatar}
                                        </Avatar>
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography fontWeight="medium">
                                                {chat.userName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {chat.messages[chat.messages.length - 1].time}
                                            </Typography>
                                        </Box>
                                    }
                                    secondary={
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {chat.messages[chat.messages.length - 1].text}
                                        </Typography>
                                    }
                                />
                                {chat.unread > 0 && (
                                    <Avatar sx={{
                                        bgcolor: '#ff5722',
                                        width: '20px',
                                        height: '20px',
                                        fontSize: '12px'
                                    }}>
                                        {chat.unread}
                                    </Avatar>
                                )}
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    ))}
                </List>
            </Box>

            {/* Chat area */}
            {chats.length > 0 && (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    
                    <h6 className='px-3 text-left' >Trip Id : #123456789</h6>
                    {/* Chat header */}
                    <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: '#3f51b5', mr: 2 }}>
                            {chats[selectedChat].userAvatar}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="medium">
                                {chats[selectedChat].userName} (User)
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Chatting with {chats[selectedChat].ownerName} (Owner)
                            </Typography>
                        </Box>
                    </Box>

                    {/* Messages */}
                    <Box sx={{
                        flex: 1,
                        p: 2,
                        overflowY: 'auto',
                        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9))',
                        backgroundSize: 'cover'
                    }}>
                        {chats[selectedChat].messages.map((message) => (
                            <Box
                                key={message.id}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: message.sender === 'user' ? 'flex-start' :
                                        message.sender === 'owner' ? 'flex-end' : 'center',
                                    mb: 2
                                }}
                            >
                                {/* Username above bubble */}
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        mb: 0.5,
                                        ml: message.sender === 'user' ? 1 : 0,
                                        mr: message.sender === 'owner' ? 1 : 0
                                    }}
                                >
                                    {message.sender === 'user' ? chats[selectedChat].userName :
                                        message.sender === 'owner' ? chats[selectedChat].ownerName : 'Admin'}
                                </Typography>

                                {/* Message bubble with avatar */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: message.sender === 'user' ? 'row' : 'row-reverse',
                                        alignItems: 'flex-end',
                                        maxWidth: '70%'
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: message.sender === 'user' ? '#3f51b5' :
                                                message.sender === 'owner' ? '#f50057' : '#4caf50',
                                            width: 36,
                                            height: 36,
                                            mr: message.sender === 'user' ? 1 : 0,
                                            ml: message.sender === 'owner' ? 1 : 0
                                        }}
                                    >
                                        {message.sender === 'user' ? chats[selectedChat].userAvatar :
                                            message.sender === 'owner' ? chats[selectedChat].ownerAvatar : 'A'}
                                    </Avatar>

                                    <Paper
                                        sx={{
                                            p: 1.5,
                                            bgcolor: message.sender === 'user' ? '#e3f2fd' :
                                                message.sender === 'owner' ? '#f1f1f1' : '#e8f5e9',
                                            borderRadius: message.sender === 'user' ?
                                                '18px 18px 18px 4px' :
                                                '18px 18px 4px 18px'
                                        }}
                                    >
                                        <Typography variant="body2">
                                            {message.text}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ display: 'block', textAlign: 'right' }}
                                        >
                                            {message.time}
                                        </Typography>
                                    </Paper>
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    {/* Message input */}
                    {/* <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                        <Paper
                            component="form"
                            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
                        >
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <IconButton 
                                color="primary" 
                                sx={{ p: '10px' }} 
                                onClick={handleSendMessage}
                            >
                                <SendIcon />
                            </IconButton>
                        </Paper>
                    </Box> */}
                </Box>
            )}
        </Box>
    );
}