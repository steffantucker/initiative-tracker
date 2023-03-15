import { Component } from "preact";
import { useSelector } from "react-redux";
import { Header } from '../components/Header';
import { ActorList } from '../components/ActorList';
import { LoginPage } from "./LoginPage";

export function Main() {
    const room = useSelector((state) => state.room.room);

    return (
        <>
            {room ? (
            <>
                <Header />
                <ActorList />
            </>
            ):(
            <>
                <Header />
                <LoginPage />
            </>
            )}
        </>
    )
}

/*    startRoom() {
        const room = generateCode();
        [this.send, this.peerError, this.peerClose] = usePeer(true, room, this.parseMessage);
        if (room === 'tester') {
            this.setState({turns: TestState});
        }
        this.setState({room: room, isServer: true, inRoom: true});
    }

    joinRoom(){
        return (room) => {
            console.log('attempt room join', room);
            if (room === 'tester') {
                this.startRoom('tester');
                return;
            }
            if (room === 'testconnect')
                room = 'tester';
            [this.send, this.peerError, this.peerClose] = usePeer(false, room, this.parseMessage);
            this.setState({room: room, inRoom: true});
        }
    }

    leaveRoom() {
        this.setState({inRoom: false});
    }

    newActor(actor) {
        actor.id = this.state.turns.nextID;
        const nextID = this.state.turns.nextID + 1;
        this.send({type: 'newactor', actor: actor, nextID: this.nextID});
        this.setState((prev) => {return {turns: {nextID: prev.turns.nextID + 1, actors: [...prev.turns.actors, actor]}}});
    }

    updateActor(actor) {
        let newActors = this.state.actors.filter((a) => a.id !== actor.id);
        newActors.push(actor);
        newActors = this.sortActors(newActors);
        this.send({type: 'updateactor', actor: actor});
        this.setState({turns: {actors: newActors}});
    }

    removeActor(id) {
        const newActors = this.state.turns.actors.filter((a) => a.id !== id);
        this.send({type: 'removeactor', id});
        this.setState({turns: {actors: newActors}});
    }

    nextTurn() {
        currentTurnIndex = (this.state.turns.currentTurnIndex + 1) % this.actors.length;
        currentActorID = this.state.turns.actors[currentTurnIndex].id;
        this.send({type: 'nextturn', currentTurnIndex: currentTurnIndex, currentActorID: currentActorID});
        this.setState({turns: {currentActorID: currentActorID, currentTurnIndex: currentTurnIndex}});        
    }

    reset() {
        this.send({type: 'reset'});
        this.setState({
            turns: {
                actors: [],
                nextID: 0,
                currentTurnIndex: 0,
                currentActorID: 0,
            }
        });
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

    sortActors(actors) {
        return actors.sort((a, b) => b.initiative - a.initiative);
    }

    render(props, state) {
        return (
            <>{state.inRoom ? (
                <>
                    <Header room={state.room} onLogout={() => this.leaveRoom()} />
                    <ActorList 
                        turns={state.turns} 
                        isDM={state.isServer} 
                        next={this.nextTurn}
                        onEdit={this.updateActor}
                        onNew={this.newActor}
                        onRemove={this.removeActor}
                    />
                </>
            )
            :
            (
                <>
                    <Header />
                    <LoginPage enterRoom={this.joinRoom()} newRoom={this.startRoom} />
                </>
            )}</>
        );
    }
}
*/