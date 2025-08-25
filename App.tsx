import React, { useState, useEffect, useMemo } from 'react';
import type { Condition, ConditionStatus } from './types';
import { INITIAL_CONDITIONS_DESC } from './constants';
import ChecklistItem from './components/ChecklistItem';
import CalculatorSection from './components/CalculatorSection';
import FixedLeverageCalculator from './components/FixedLeverageCalculator';
import Icon from './components/Icon';

type CalculatorTab = 'variable' | 'fixed';

const App: React.FC = () => {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [activeTab, setActiveTab] = useState<CalculatorTab>('variable');

  useEffect(() => {
    try {
      const savedConditions = localStorage.getItem('conditions');
      if (savedConditions) {
        setConditions(JSON.parse(savedConditions));
      } else {
        setConditions(
          INITIAL_CONDITIONS_DESC.map((desc, index) => ({
            id: index + 1,
            description: desc,
            status: 'X',
          }))
        );
      }
    } catch (error) {
        console.error("Failed to parse conditions from localStorage", error);
        // Fallback to initial conditions if parsing fails
        setConditions(
          INITIAL_CONDITIONS_DESC.map((desc, index) => ({
            id: index + 1,
            description: desc,
            status: 'X',
          }))
        );
    }
  }, []);
  
  useEffect(() => {
    if (conditions.length > 0) {
        localStorage.setItem('conditions', JSON.stringify(conditions));
    }
  }, [conditions]);


  const handleAddCondition = () => {
    const newId = conditions.length > 0 ? Math.max(...conditions.map(c => c.id)) + 1 : 1;
    const newCondition: Condition = {
      id: newId,
      description: '',
      status: 'X',
    };
    setConditions(prev => [...prev, newCondition]);
  };

  const handleRemoveCondition = (id: number) => {
    const newConditions = conditions.filter(c => c.id !== id);
    setConditions(newConditions);
    if (newConditions.length === 0) {
        localStorage.removeItem('conditions');
    }
  };

  const handleUpdateCondition = (id: number, description: string, status: ConditionStatus) => {
    setConditions(prev => 
      prev.map(c => (c.id === id ? { ...c, description, status } : c))
    );
  };

  const allConditionsMet = useMemo(() => {
    if (conditions.length === 0) return false;
    return conditions.every(c => c.status === 'O');
  }, [conditions]);

  return (
    <div className="container">
      <h1><Icon name="coins" className="mr-3" /> 코인 선물 트레이딩 시뮬레이터</h1>

      <div className="section">
        <h2><Icon name="list-check" /> 진입조건 확인 (O/X)</h2>
        <div>
          {conditions.map(condition => (
            <ChecklistItem
              key={condition.id}
              condition={condition}
              onUpdate={handleUpdateCondition}
              onRemove={handleRemoveCondition}
            />
          ))}
        </div>
        <button onClick={handleAddCondition} className="add-condition-button">
          <Icon name="plus" className="mr-2" /> 조건 추가
        </button>
      </div>

      {allConditionsMet && (
        <div className="section">
           <div className="tabs-container">
                <button 
                    className={`tab-button ${activeTab === 'variable' ? 'active' : ''}`}
                    onClick={() => setActiveTab('variable')}
                >
                    변동 레버리지
                </button>
                <button 
                    className={`tab-button ml-auto ${activeTab === 'fixed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('fixed')}
                >
                    고정 레버리지
                </button>
            </div>
            {activeTab === 'variable' && <CalculatorSection />}
            {activeTab === 'fixed' && <FixedLeverageCalculator />}
        </div>
      )}
    </div>
  );
};

export default App;