import { Peer } from 'peerjs';
import { generateCode } from '../lib/Utils';

const testroom = "scorpius";

export function peerMiddleware() {
    console.log('peer middleware setup');
    let peer;
    let peers = [];
    const options = {
        debug: 3,
    }
    let isServer = false;
    let room;

    const peerClientSetup = () => {
        peer = new Peer(room+"1", options);
        console.log(peer);
        peer.on('open', onOpen);
        peer.on('error', onError);
        console.log(room)
        const conn = peer.connect(room)
        conn.on('open', () => conn.send("test"));
        conn.on('data', (data) => storeAPI.dispatch({type: 'turns/message', payload: data}));
        conn.on('close', () => peers = peers.filter((c) => c.peer !== conn.peer));
        peers.push(conn);
    }

    const peerServerSetup = () => {
        peer = new Peer(room, options);
        console.log(peer);
        peer.on('open', onOpen);
        peer.on('error', onError);
        peer.on('connection', (conn) => {
            console.log('new connection', conn);
            conn.on('open', () => {
                peers.push(conn);
                conn.send('hello');
            });
            conn.on('data', (data) => {
                storeAPI.dispatch({type: 'turns/message', payload: data});
                peers.forEach((c) => c.peer !== conn.peer ? c.send(data) : null);
            });
            conn.on('close', peers = peers.filter((c) => c.peer !== conn.peer));
        });
    }

    const sendMessage = (message) => {
        console.log('sending message', message);
        peers.forEach((conn) => conn.send(message));
    }

    const onOpen = (i) => {
        console.log('Peer: opened', i);
    }

    const onError = (err) => {
        console.error('Peer: error', err);
    }

    return (storeAPI => next => action => {
        console.log(action);
        switch (action.type) {
            case 'room/join':
                if (action.payload === testroom) {
                    room = testroom;
                    isServer = true;
                    peerServerSetup();
                    break;
                }
                room = (action.payload === testroom+"connect") ? testroom : action.payload;
                peerClientSetup();
                break;
            case 'room/create':
                isServer = true;
                room = generateCode();
                peerServerSetup();

                action.payload = room;
                break;
            case 'room/leave':
                peer && peer.destroy();
                peer = null;
                peers = [];
                isServer = false;
                room = null;
                break;
            case 'turns/next':
                sendMessage({type: 'next'});
                break;
            case 'turns/add':
                sendMessage({type: 'add', data: action.payload});
                break;
            case 'turns/update':
                sendMessage({type: 'update', data: action.payload});
                break;
            case 'turns/remove':
                sendMessage({type: 'remove', data: action.payload});
                break;
        }
        return next(action);
    })

}
