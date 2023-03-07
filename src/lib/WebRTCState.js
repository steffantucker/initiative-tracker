import { useEffect, useState } from 'preact/hooks';
import { Peer } from 'peerjs';

export default function useWebRTCState(initialMessage, uid) {
    const [connections, setConnections] = useState([]);
    const [message, setMessage] = useState(initialMessage);
    const [error, setError] = useState(null);
    const [peerjs, setPeerJS] = useState(null);
    const [userId, setUserID] = useState(uid);

    useEffect(() => {
        const p = new Peer(userId);
        setPeerJS(p);

        p.on('open', () => console.log("conn open"));

        p.on('error', err => setError(err));

        p.on('connection', conn => {
            conn.on('open', conn.send(message));
            conn.on('data', d => setMessage(d));

            setConnections(prevConnections => [...prevConnections, conn]);
        });

        return () => {
            peer && peer.destroy()
        }
    }, [uid]);

    return [
        message,
        (newMessage) => {
            setMessage(newMessage);
            connections.forEach(conn => conn.send(newMessage));
        },
        connections,
        error,
    ];
}

const TestState = {
    actors: [
        {id : 5, name : "Duv", armorClass : 10, initiative : 21, maxHitPoints : 40, currentHitPoints : 40, isHidden: false},
        {id : 2, name : "Dav", armorClass : 10, initiative : 17, maxHitPoints : 40, currentHitPoints : 40, isHidden: false},
        {id : 0, name : "Dev", armorClass : 10, initiative : 13, maxHitPoints : 40, currentHitPoints : 40, isHidden: false},
        {id : 3, name : "Div", armorClass : 10, initiative : 4, maxHitPoints : 40, currentHitPoints : 40, isHidden: false},
    ], 
    currentActorID: 5, 
    currentTurnIndex: 0,
    nextID: 6
}

// TODO: save to localstorage
export class WebRTC {
    actors = [];
    nextID = 0;
    currentTurnIndex = 0;
    currentActorID = 0;
    peerError;
    peers = new Map();
    room = '';

    constructor() {
        this.peer = new Peer( {debug: 3});

        if (userID === 'tester') {
            this.actors = TestState.actors;
            this.nextID = TestState.nextID;
            this.currentTurnIndex = TestState.currentTurnIndex;
            this.currentActorID = TestState.currentActorID;
        }
        this.initializePeer()
    }

    initializePeer() {
        this.peer.on('error', (err) => {
            console.log('peer connection error', err);
            this.peer.reconnect();
        });
    }

    startRoom(room) {
        this.userID = room;
        this.room = room;
        this.peer = new Peer(room, {debug: 3});
        this.peer.on('open', async (id) => {
            if (id !== this.userID) console.log('using different id', id);
            console.log('connected',id);
        });
        this.peer.on('connection', conn => {
            conn.on('open', () => {
                console.log('new conn', conn);
                conn.on('data', (data) => {
                    this.parseMessage(data);
                    if (this.room !== this.userID)
                        this.peers.forEach((v, id) => id !== conn.peer && v.send(data))
                });
                conn.on('close', () => {
                    this.peers.delete(conn.peer);
                });
                conn.send({
                    type: 'fullsend',
                    actors: this.actors,
                    currentTurnIndex: this.currentTurnIndex,
                    currentActorID: this.currentActorID,
                    nextID: this.nextID,
                });
                this.peers[conn.peer] = conn;
            })
        });
    }

    joinRoom(room) {
        const conn = this.peer.connect(room, {serialization: 'json'});
        conn.on('open', () => {
            conn.on('data', (data) => {
                this.parseMessage(data);
            });
            this.peers[conn.peer] = conn
        });
    }

    send(message) {
        this.peers.forEach((conn) => conn.send(message));
    }

    newActor(actor) {
        actor.id = this.nextID;
        this.nextID++;
        this.send({type: 'newactor', actor: actor, nextID: this.nextID});
    }

    updateActor(actor) {
        this.send({type: 'updateactor', actor: actor});
    }

    removeActor(id) {
        this.send({type: 'removeactor', id});
    }

    nextTurn() {
        this.currentTurnIndex = (this.currentTurnIndex + 1) % this.actors.length;
        this.currentActorID = this.actors[this.currentTurnIndex].id;
        this.send({type: 'nextturn', currentTurnIndex: this.currentTurnIndex, currentActorID: this.currentActorID});
    }

    reset() {
        this.actors = [];
        this.currentActorID = 0;
        this.currentTurnIndex = 0;
        this.nextID = 0;
        this.send({type: 'send'});
    }

    parseMessage(message) {
        switch (message.type) {
            // TODO: fullrequest
            case 'fullsend':
                this.actors = message.actors;
                this.currentTurnIndex = message.currentTurnIndex;
                this.currentActorID = message.currentActorID;
                this.nextID = message.nextID;
            case 'newactor':
                this.actors.push(message.actor);
                this.nextID = message.nextID;
                sortActors();
            case 'updateactor':
                this.actors = this.actors.filter(a => a.id !== message.actor.id);
                this.actors.push(message.actor);
                this.sortActors();
            case 'removeactor':
                this.actors = this.actors.filter(a => a.id !== message.id);
            case 'nextturn':
                // TODO: double check and verify, request fullsend if no agreeance
                this.currentTurnIndex = message.currentTurnIndex;
                this.currentActorID = message.currentActorID;
            case 'reset':
                this.actors = [];
                this.currentActorID = 0;
                this.currentTurnIndex = 0;
                this.nextID = 0;
        }
    }

    sortActors() {
        this.actors.sort((a, b) => b.initiative - a.initiative);
    }
}