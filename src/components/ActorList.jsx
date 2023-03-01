import { useState } from 'preact/hooks'
import PropTypes from 'prop-types';
import { ActorCard } from './ActorCard';

export function ActorList({initialActors}) {
    if (initialActors == null) {
        return (
            <div className='empty-list'>nothing to show</div>
        )
    }
    const [actors, setNewActors] = useState(initialActors)
    console.log(actors)

    const onEdit = (actor) => {
        console.log(actor)
        const newActors = actors.slice()
        const i = newActors.findIndex((a) => a.actor.id == actor.id)
        console.log(i)
        newActors[i].actor = actor
        console.log(newActors)
        setNewActors(newActors)
    }

    return (
        <div className='actor-list'>
            {actors.map((a) => <ActorCard actor={a.actor} isCurrent={a.isCurrent} onEdit={onEdit} />)}
        </div>
    )
}

ActorList.PropTypes = {
    actors: PropTypes.array.isRequired,
}