import { ActorList } from "../components/ActorList";

export function ActorPage({ turns, dispatch, isDM }) {
    const onEdit = (actor) => {
        dispatch({type: 'updateActor', value: actor, isDM});
    }

    const onNew = (actor) => {
        dispatch({type: 'addActor', value: actor, isDM})
    }
    
    const onRemove = (actor) => {
        return () => {
            dispatch({type: 'removeActor', value: actor})
        };
    }
    // TODO: add footer for buttons
    return (
        <>
            <ActorList turns={turns} onEdit={onEdit} onNew={onNew} onRemove={onRemove} />
        </>
    )
}
