import React from 'react';
import type { Condition, ConditionStatus } from '../types';
import Icon from './Icon';

interface ChecklistItemProps {
  condition: Condition;
  onUpdate: (id: number, description: string, status: ConditionStatus) => void;
  onRemove: (id: number) => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ condition, onUpdate, onRemove }) => {
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(condition.id, e.target.value, condition.status);
  };

  const handleStatusChange = (newStatus: ConditionStatus) => {
    onUpdate(condition.id, condition.description, newStatus);
  };

  return (
    <div className="checklist-item">
      <input
        type="text"
        className="condition-description-input"
        value={condition.description}
        placeholder="조건 설명을 입력하세요"
        onChange={handleDescriptionChange}
      />
      <div className="condition-actions">
        <button
          className={`ox-button ${condition.status === 'O' ? 'active-o' : ''}`}
          onClick={() => handleStatusChange('O')}
          aria-label="Condition met"
        >
          O
        </button>
        <button
          className={`ox-button ${condition.status === 'X' ? 'active-x' : ''}`}
          onClick={() => handleStatusChange('X')}
          aria-label="Condition not met"
        >
          X
        </button>
        <button
          className="remove-condition-button"
          onClick={() => onRemove(condition.id)}
          aria-label="Remove condition"
        >
          <Icon name="trash-alt" />
        </button>
      </div>
    </div>
  );
};

export default ChecklistItem;