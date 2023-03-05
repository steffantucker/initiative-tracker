import { ActorCard } from './ActorCard';
import { Button } from './Button';

export function ActorList({ state, dispatch }) {

    const onEdit = (actor) => {
        dispatch({type: 'updateActor', value: actor});
    }
    
    const onRemove = (actor) => {
        dispatch({type: 'removeActor', value: actor.id});
    }

    if (state.actors.length === 0) {
        return (
            <div className='empty-list'>nothing to show</div>
        )
    }

    let actors = state.actors.slice(state.currentTurnIndex)
    if (state.currentTurnIndex > 0) actors.push(...state.actors.slice(0, state.currentTurnIndex))
    console.log(actors)
    return (
        <div className='actor-list'>
            {actors.map((a) => <ActorCard id={a.id} actor={a} isCurrent={a.id === state.currentActorID} onEdit={onEdit} onRemove={onRemove} />)}
            <Button label='Next' size='small' onClick={() => dispatch({type: 'nextTurn'})}/>
        </div>
    )
}

ActorList.PropTypes = {
}