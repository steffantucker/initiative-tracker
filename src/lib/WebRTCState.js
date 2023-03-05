import { useEffect, useState } from 'preact/hooks';
import { Peer } from 'peerjs';

export default function useWebRTCState(initialMessage, uid) {
    const [connections, setConnections] = useState([]);
    const [message, setMessage] = useState(initialMessage);
    const [error, setError] = useState(null);
    const [peerjs, setPeerJS] = useState(null);
    const [userId, setUserID] = useState(uid);

    useEffect(() => {
        const p = new Peer(uid);
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