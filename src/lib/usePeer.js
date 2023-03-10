import { useEffect, useState } from 'preact/hooks';
import { Peer } from 'peerjs';

const parseConfig = {
    debug: 3,
}

export default function usePeer(isServer=false, roomCode='', parseMessage) {
    const [connections, setConnections] = useState([]);
    const [error, setError] = useState(null);
    const [peerjs, setPeerJS] = useState(null);
    const [room, setRoom] = useState(roomCode);

    useEffect(() => {
        const p = isServer ? new Peer(room, parseConfig) : new Peer(parseConfig);
        setPeerJS(p);

        p.on('open', (i) => console.log('opened', i));

        p.on('error', err => setError(err));

        if (isServer) {
            p.on('connection', conn => {
                conn.on('data', d => parseMessage(d));
                conn.on('close', () => {
                    setConnections(prev => prev.filter((v) => v.peer !== conn.peer));
                });

                setConnections(prevConnections => [...prevConnections, conn]);
            });
        } else {
            const conn = p.connect(room);
            conn.on('open', () => {
                conn.on('data', (data) => {
                    parseMessage(data);
                });
            });
            setConnections(prev => [...prev, conn]);
        }

        return () => {
            p && p.destroy()
        }
    }, [room]);

    return [
        (newMessage) => {
            connections.forEach(conn => conn.send(newMessage));
        },
        error,
        (r) => setRoom(r),
    ];
}
