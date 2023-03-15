import { useState } from 'preact/hooks'
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Button } from './Button'
import { add, update, remove } from '../store/turns';

// TODO: make class?
export function ActorCard({ actor, isCurrent, onRemove }) {
  const dispatch = useDispatch()
  let isNew = false;
  let onEdit = (a) => dispatch(update(a));
  if (onRemove === null) onRemove = (a) => dispatch(update(a));

  if (actor == null) {
    actor = {
      id: -1,
      name: 'name',
      armorClass: 0,
      currentHitPoints: 0,
      maxHitPoints: 0,
      initiative: 0,
    };
    isNew = true;
    onEdit = (a) => dispatch(add(a));
  }

  // TODO: figure out expanding
  const [isExpanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(isNew);
  const [newName, setNewName] = useState(actor.name);
  const [newInit, setNewInit] = useState(actor.initiative);
  const [newAC, setNewAC] = useState(actor.armorClass);
  const [newCurrHP, setNewCurrHP] = useState(actor.currentHitPoints);
  const [newMaxHP, setNewMaxHP] = useState(actor.maxHitPoints);
  const [isHidden, setHidden] = useState(false);

  const mode = isCurrent ? 'current' : 'notcurrent';

  const handleSave = () => {
    const updatedCharacter = {
      id: actor.id,
      name: newName,
      armorClass: newAC,
      maxHitPoints: newMaxHP,
      currentHitPoints: newCurrHP,
      initiative: newInit,
      hidden: isHidden,
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
    setHidden(actor.hidden);
    setEditing(false);
  };

  const handleChange = (setter) => {
    return (e) => {
      setter(e.target.innerText);
    }
  };

  const handleNumberChange = (setter) => {
    return (e) => {
      setter(Number(e.target.innerText));
    }
  };

  const handleRemove = () => {
    onRemove(actor.id);
  }

  return (
    <div className={`actor-card ${mode}`}>
      <div className='title'>
        <span 
          id={`name-${actor.id}`} 
          className='name' 
          contenteditable={editing} 
          onBlur={handleChange(setNewName)}
        >
          {actor.name}
        </span>
        <span>
          🎲
          <span 
            className='initiative' 
            contenteditable={editing} 
            onBlur={handleNumberChange(setNewInit)}
          >
            {actor.initiative}
          </span>
        </span>
      </div>
      <div className='body'>
        <span>
          💖
          <span 
            contenteditable={editing} 
            onBlur={handleNumberChange(setNewCurrHP)} 
            tagName='span'
          >
            {actor.currentHitPoints}
          </span>
          /
          <span 
            contenteditable={editing} 
            onBlur={handleNumberChange(setNewMaxHP)} 
            tagName='span'
          >
            {actor.maxHitPoints}
          </span>
        </span>
        <span>
          🛡
          <span 
            contenteditable={editing} 
            onBlur={handleNumberChange(setNewAC)}
          >
            {actor.armorClass}
          </span>
        </span>
        <span>
          <label for={`hidden-${actor.id}`}>hidden?</label>
          <input type='checkbox' name={`hidden-${actor.id}`} id={`hidden-${actor.id}`} checked={isHidden} onChange={() => setHidden(!isHidden)} disabled={!editing} />
        </span>
      </div>
      {editing ? (
        <>
          // TODO: make these buttons icons
          <Button size='small' onClick={handleRemove} label='remove' />
          <Button primary size='small' onClick={handleSave} label='save' />
          {!isNew && <Button size='small' onClick={handleCancel} label='cancel' />}
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
  onEdit: PropTypes.func,
};
