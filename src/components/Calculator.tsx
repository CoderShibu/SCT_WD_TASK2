import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface CalculatorProps {
  currentTask?: string;
}

const Calculator: React.FC<CalculatorProps> = ({ currentTask }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [expression, setExpression] = useState('');

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
      setExpression(expression + num);
    } else {
      setDisplay(display === '0' ? num : display + num);
      setExpression(expression === '' || waitingForNewValue ? num : expression + num);
    }
  };

  const inputDot = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
      setExpression(expression + '.');
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
      setExpression(expression + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
    setExpression('');
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(String(inputValue));
      setExpression(display + nextOperation);
    } else if (operation) {
      const currentValue = previousValue || '0';
      const newValue = calculate(parseFloat(currentValue), inputValue, operation);

      if (newValue === 'Error') {
        setDisplay('Error');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForNewValue(true);
        setExpression('');
        return;
      }

      setDisplay(String(newValue));
      setPreviousValue(String(newValue));
      setExpression(String(newValue) + nextOperation);
    }

    setWaitingForNewValue(true);
    // Only set the operation if it's not '='
    if (nextOperation !== '=') {
      setOperation(nextOperation);
    }
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number | string => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        if (secondValue === 0) {
          return 'Error';
        }
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      // Perform the calculation using the current operation
      const inputValue = parseFloat(display);
      const currentValue = previousValue || '0';
      const newValue = calculate(parseFloat(currentValue), inputValue, operation);

      if (newValue === 'Error') {
        setDisplay('Error');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForNewValue(true);
        setExpression('');
        return;
      }

      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
      setExpression('');
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      
      if (key >= '0' && key <= '9') {
        inputNumber(key);
      } else if (key === '.') {
        inputDot();
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        performOperation(key);
      } else if (key === 'Enter' || key === '=') {
        handleEquals();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, previousValue, operation, waitingForNewValue, expression]);

  const formatDisplay = (value: string): string => {
    if (value === 'Error') return value;
    
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    
    // Format large numbers with commas and limit decimal places
    if (Math.abs(num) >= 1000000000) {
      return num.toExponential(2);
    }
    
    const formatted = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 8,
    }).format(num);
    
    return formatted;
  };

  return (
    <div className="max-w-sm mx-auto bg-card rounded-2xl shadow-2xl shadow-calc-shadow/20 p-6 space-y-4">
      {/* Display */}
      <div className="bg-calc-display rounded-xl p-6 flex items-center justify-between">
        <div className="text-md font-medium text-muted-foreground truncate max-w-[60%] text-left">
          {expression || 'Enter calculation'}
        </div>
        <div className="text-4xl font-light text-foreground overflow-hidden text-right">
          {formatDisplay(display)}
        </div>
      </div>

      {/* Button Grid */}
      <div className="grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <CalculatorButton
          variant="function"
          onClick={clear}
          className="col-span-3"
        >
          Clear
        </CalculatorButton>
        
        <CalculatorButton
          variant="operator"
          onClick={() => performOperation('/')}
        >
          ÷
        </CalculatorButton>

        {/* Row 2 */}
        <CalculatorButton variant="number" onClick={() => inputNumber('7')}>
          7
        </CalculatorButton>
        <CalculatorButton variant="number" onClick={() => inputNumber('8')}>
          8
        </CalculatorButton>
        <CalculatorButton variant="number" onClick={() => inputNumber('9')}>
          9
        </CalculatorButton>
        <CalculatorButton
          variant="operator"
          onClick={() => performOperation('*')}
        >
          ×
        </CalculatorButton>

        {/* Row 3 */}
        <CalculatorButton variant="number" onClick={() => inputNumber('4')}>
          4
        </CalculatorButton>
        <CalculatorButton variant="number" onClick={() => inputNumber('5')}>
          5
        </CalculatorButton>
        <CalculatorButton variant="number" onClick={() => inputNumber('6')}>
          6
        </CalculatorButton>
        <CalculatorButton
          variant="operator"
          onClick={() => performOperation('-')}
        >
          −
        </CalculatorButton>

        {/* Row 4 */}
        <CalculatorButton variant="number" onClick={() => inputNumber('1')}>
          1
        </CalculatorButton>
        <CalculatorButton variant="number" onClick={() => inputNumber('2')}>
          2
        </CalculatorButton>
        <CalculatorButton variant="number" onClick={() => inputNumber('3')}>
          3
        </CalculatorButton>
        <CalculatorButton
          variant="operator"
          onClick={() => performOperation('+')}
        >
          +
        </CalculatorButton>

        {/* Row 5 */}
        <CalculatorButton
          variant="number"
          onClick={() => inputNumber('0')}
          className="col-span-2"
        >
          0
        </CalculatorButton>
        <CalculatorButton variant="number" onClick={inputDot}>
          .
        </CalculatorButton>
        <CalculatorButton variant="operator" onClick={handleEquals}>
          =
        </CalculatorButton>
      </div>
    </div>
  );
};

interface CalculatorButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant: 'number' | 'operator' | 'function';
  className?: string;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  children,
  onClick,
  variant,
  className = '',
}) => {
  const getButtonClasses = () => {
    const baseClasses = 'h-16 text-xl font-medium rounded-2xl transition-all duration-150 active:scale-95 active:brightness-110';
    
    switch (variant) {
      case 'number':
        return `${baseClasses} bg-calc-button-number text-foreground hover:bg-calc-button-active`;
      case 'operator':
        return `${baseClasses} bg-calc-button-operator text-foreground hover:brightness-110`;
      case 'function':
        return `${baseClasses} bg-calc-button-function text-foreground hover:bg-calc-button-active`;
      default:
        return baseClasses;
    }
  };

  return (
    <Button
      onClick={onClick}
      className={`${getButtonClasses()} ${className}`}
      variant="ghost"
    >
      {children}
    </Button>
  );
};

export default Calculator;