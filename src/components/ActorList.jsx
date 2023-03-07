import { useState } from 'preact/hooks';
import { ActorCard } from './ActorCard';
import { Button } from './Button';

export function ActorList({ turns, onEdit, onNew, onRemove }) {
    const [makeNew, setNew] = useState(false);

    if (turns.actors.length === 0) {
        return (
            <div className='empty-list'>nothing to show</div>
        )
    }

    let actors = turns.actors.slice(turns.currentTurnIndex)
    if (turns.currentTurnIndex > 0) actors.push(...turns.actors.slice(0, turns.currentTurnIndex))
    return (
        // TODO: make this background different to differentiate each card
        <div className='actor-list'>
            {actors.map((a) => <ActorCard key={`actor-${a.id}`} actor={a} isCurrent={a.id === turns.currentActorID} onEdit={onEdit} onRemove={onRemove(a.id)} />)}
            <Button label='Next' size='small' onClick={() => dispatch({type: 'nextTurn'})}/>
            <Button label='new' size='small' onClick={() => setNew(true)} />
            {makeNew && <ActorCard key='actor-new' onEdit={onNew} onRemove={() => setNew(false)} />}
        </div>
    )
}

ActorList.PropTypes = {
}
