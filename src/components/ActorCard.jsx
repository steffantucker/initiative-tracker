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

  // TODO: figure out expanding
  const [isExpanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(actor.name);
  const [newInit, setNewInit] = useState(actor.initiative);
  const [newAC, setNewAC] = useState(actor.armorClass);
  const [newCurrHP, setNewCurrHP] = useState(actor.currentHitPoints);
  const [newMaxHP, setNewMaxHP] = useState(actor.maxHitPoints);
  const mode = isCurrent ? 'current' : 'notcurrent';

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

  const handleChange = (setter) => {
    return (e) => {
      setter(e.target.innerText)
    }
  };

  const handleNumberChange = (setter) => {
    return (e) => {
      setter(Number(e.target.innerText))
    }
  };

  return (
    <div className={`actor-card ${mode}`}>
      <div className='title'>
        <span id={`name-${actor.id}`} className='name' contenteditable={editing} onBlur={handleChange(setNewName)}>{actor.name}</span>
        <span className='initiative' contenteditable={editing} onBlur={handleNumberChange(setNewInit)}>{actor.initiative}</span>
      </div>
      {isExpanded && (
        <div className='body'>
          <span><span contenteditable={editing} onBlur={handleNumberChange(setNewCurrHP)} tagName='span'>{actor.currentHitPoints}</span>/<span contenteditable={editing} onBlur={handleNumberChange(setNewMaxHP)} tagName='span'>{actor.maxHitPoints}</span></span>
          <span contenteditable={editing} onBlur={handleNumberChange(setNewAC)}>{actor.armorClass}</span>
        </div>
      )}
      {editing ? (
        <>
          // TODO: make these buttons icons
          <Button primary size='small' onClick={handleSave} label='save' />
          <Button size='small' onClick={handleCancel} label='cancel' />
        </>
      ) : (
        <Button size='small' onClick={() => setEditing(true)} label='edit' />
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