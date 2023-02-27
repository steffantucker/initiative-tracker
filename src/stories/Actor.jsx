import PropTypes from 'prop-types';
import { useState } from 'react';
import { FwAccordion, FwAccordionBody, FwAccordionTitle } from '@freshworks/crayons/react'

import './actor.css';

export const Actor = ({actor, currentTurn, collapsed}) => {
  if (actor === null) {
    return (<></>)
  }
  let mode = currentTurn ? "current" : "notcurrent"
  return (
    <div className='actor'>
      <FwAccordion
        className={['accordion', mode].join(' ').trim()}
        expanded={collapsed === null ? true : !collapsed}
      >
        <FwAccordionTitle className='title'>
          <h1>{actor.name}</h1>
          <div className='initiative'>{actor.initiative}</div>
        </FwAccordionTitle>
        <FwAccordionBody>
        </FwAccordionBody>
      </FwAccordion>
    </div>
  )
};

Actor.propTypes = {
  actor: PropTypes.shape({
    name: PropTypes.string.isRequired,
    ac: PropTypes.number.isRequired,
    initiative: PropTypes.number.isRequired,
    hp: {
      max: PropTypes.number.isRequired,
      current: PropTypes.number.isRequired,
      temp: PropTypes.number
    },
    active: true,
    visible: true
  }),
  currentTurn: PropTypes.bool 
};

Actor.defaultProps = {
  actor: null
};
