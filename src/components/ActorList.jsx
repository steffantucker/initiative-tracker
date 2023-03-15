import { useState } from 'preact/hooks';
import { useSelector, useDispatch } from 'react-redux';

import { ActorCard } from './ActorCard';
import { Button } from './Button';
import { next, add, loadTestState } from '../store/turns';

export function ActorList() {
    const [makeNew, setNew] = useState(false);
    const { room, isDM } = useSelector((state) => state.room);
    const turns = useSelector((state) => state.turns);
    const dispatch = useDispatch();

    //if (room === 'tester' && turns.actors.length === 0) dispatch(loadTestState());

    if (turns.actors.length === 0) {
        return (
            <>
                <div className='empty-list'>nothing to show</div>
                <Button label='new' size='small' onClick={() => setNew(true)} />
                {makeNew && <ActorCard key='actor-new' onRemove={() => setNew(false)} />}
            </>
        )
    }

    let actors = turns.actors.slice(turns.currentTurnIndex).filter((a) => isDM || !a.isHidden);
    if (turns.currentTurnIndex > 0) actors.push(...turns.actors.slice(0, turns.currentTurnIndex));
    // TODO: make this background different to differentiate each card
    return (
        <div className='actor-list'>
            {actors.map((a) => (
                <ActorCard 
                    key={`actor-${a.id}`} 
                    actor={a} 
                    isCurrent={a.id === turns.currentActorID} />
                ))
            }
            <Button label='next' size='small' onClick={() => dispatch(next())}/>
            <Button label='new' size='small' onClick={() => setNew(true)} />
            {makeNew && <ActorCard key='actor-new' onRemove={() => setNew(false)} />}
        </div>
    )
}

ActorList.PropTypes = {
}
