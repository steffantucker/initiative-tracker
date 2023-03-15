import { Peer } from 'peerjs';
import { generateCode } from '../lib/Utils';

export function peerMiddleware() {
    console.log('peer middleware setup');
    let peer;
    let peers = [];
    const options = {
        debug: 3,
        config: {
            'iceServers': [
                {
                  urls: "stun:relay.metered.ca:80",
                },
                {
                  urls: "turn:relay.metered.ca:80",
                  username: "2c8a6acee3dac9800e8d96d6",
                  credential: "Ih0yQ4v/06Vp2RFa",
                },
                {
                  urls: "turn:relay.metered.ca:443",
                  username: "2c8a6acee3dac9800e8d96d6",
                  credential: "Ih0yQ4v/06Vp2RFa",
                },
                {
                  urls: "turn:relay.metered.ca:443?transport=tcp",
                  username: "2c8a6acee3dac9800e8d96d6",
                  credential: "Ih0yQ4v/06Vp2RFa",
                },
            ],
        }
    }
    let isServer = false;
    let room;

    const peerClientSetup = () => {
        peer = new Peer(options);
        console.log(peer);
        peer.on('open', onOpen);
        peer.on('error', onError);
        const conn = peer.connect(room)
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
            conn.on('data', (data) => {
                storeAPI.dispatch({type: 'turns/message', payload: data});
                peers.forEach((c) => c.peer !== conn.peer ? c.send(data) : null);
            });
            conn.on('close', peers = peers.filter((c) => c.peer !== conn.peer));
            peers.push(conn);
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
                if (action.payload === 'tester') {
                    room = tester;
                    peerServerSetup();
                    break;
                }
                room = (action.payload === 'testconnect') ? 'tester' : action.payload;
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
