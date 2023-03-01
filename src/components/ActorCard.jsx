import { useState } from 'preact/hooks'
import PropTypes from 'prop-types';
import { Button } from './Button'

export function ActorCard({ actor, isCurrent, onEdit }) {
  if (actor == null) {
    actor = {
      id: -1,
      name: '',
      armorClass: 0,
      currentHitPoints: 0,
      maxHitPoints: 0,
      initiative: 0,
    };
  }
  const [isExpanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(actor.name);
  const [newInit, setNewInit] = useState(actor.initiative);
  const [newAC, setNewAC] = useState(actor.armorClass);
  const [newCurrHP, setNewCurrHP] = useState(actor.currentHitPoints);
  const [newMaxHP, setNewMaxHP] = useState(actor.maxHitPoints);
  const mode = isCurrent ? 'current' : 'notcurrent';

  const handleDoubleClick = () => {
    console.log("dblclck")
    setEditing(true);
  };

  const handleSave = () => {
    const updatedCharacter = {
      id: actor.id,
      name: newName,
      armorClass: newAC,
      maxHitPoints: newMaxHP,
      currentHitPoints: newCurrHP,
      initiative: newInit,
    };
    onEdit(updatedCharacter);
    setEditing(false);
  };

  const handleCancel = () => {
    setNewName(actor.name);
    setNewAC(actor.armorClass);
    setNewMaxHP(actor.maxHitPoints);
    setNewCurrHP(actor.currentHitPoints);
    setNewInit(actor.initiative);
    setEditing(false);
  };
  return (
    <div className={`actor-card ${mode}`} onDoubleClick={handleDoubleClick}>
      {editing ? (
        <div>
          <div className='title'>
            <input id={`name-${actor.id}`} type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <input id={`ac-${actor.id}`} type="number" value={newAC} onChange={(e) => setNewAC(parseInt(e.target.value, 10))} />
          </div>
          <div className='body'>
            <span>
              <input
                id={`currhp-${actor.id}`}
                type="number"
                value={newCurrHP}
                onChange={(e) => setNewCurrHP(parseInt(e.target.value, 10))}
              />
              /
              <input
                id={`maxhp-${actor.id}`}
                type="number"
                value={newMaxHP}
                onChange={(e) => setNewMaxHP(parseInt(e.target.value, 10))}
              />
            </span>
            <input id={`init-${actor.id}`} type="number" value={newInit} onChange={(e) => setNewInit(parseInt(e.target.value, 10))} />
          </div>
          <Button onClick={handleSave} label='Save' size='small' />
          <Button onClick={handleCancel} label='Cancel' size='small' />
        </div>
      ) : (
        <div onClick={() => setExpanded(ex => !ex)}>
          <div className='title'>
            <span className='name'>{actor.name}</span>
            <span className='initiative'>{actor.initiative}</span>
          </div>
          {isExpanded && (
            <div className='body'>
              <span>{actor.currentHitPoints}/{actor.maxHitPoints}</span>
              <span>{actor.armorClass}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

ActorCard.propTypes = {
  actor: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    armorClass: PropTypes.number.isRequired,
    maxHitPoints: PropTypes.number.isRequired,
    currentHitPoints: PropTypes.number.isRequired,
    initiative: PropTypes.number.isRequired,
  }),
  isCurrent: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
};