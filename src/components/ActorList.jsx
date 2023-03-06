import { useState } from 'preact/hooks';
import { ActorCard } from './ActorCard';
import { Button } from './Button';

export function ActorList({ state, dispatch }) {
    const [makeNew, setNew] = useState(false);

    const onEdit = (actor) => {
        dispatch({type: 'updateActor', value: actor});
    }

    const onNew = (actor) => {
        dispatch({type: 'addActor', value: actor})
    }
    
    const onRemove = (actor) => {
        return () => {
            console.log(actor);
            dispatch({type: 'removeActor', value: actor})
        };
    }

    if (state.actors.length === 0) {
        return (
            <div className='empty-list'>nothing to show</div>
        )
    }

    let actors = state.actors.slice(state.currentTurnIndex)
    if (state.currentTurnIndex > 0) actors.push(...state.actors.slice(0, state.currentTurnIndex))
    return (
        // TODO: make this background different to differentiate each card
        <div className='actor-list'>
            {actors.map((a) => <ActorCard key={`actor-${a.id}`} actor={a} isCurrent={a.id === state.currentActorID} onEdit={onEdit} onRemove={onRemove(a.id)} />)}
            <Button label='Next' size='small' onClick={() => dispatch({type: 'nextTurn'})}/>
            <Button label='new' size='small' onClick={() => setNew(true)} />
            {makeNew && <ActorCard key='actor-new' onEdit={onNew} onRemove={() => setNew(false)} />}
        </div>
    )
}

ActorList.PropTypes = {
}