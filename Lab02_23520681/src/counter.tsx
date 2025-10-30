/** @jsx createElement */
import { ComponentProps, useState } from './jsx-runtime';

interface ButtonProps extends ComponentProps {
  onClick?: (event: MouseEvent) => void;
  className?: string;
  children?: any;
}

export const Button = (props: ButtonProps) => {
  const { onClick, children, className = '' } = props;

  return (
      <button onClick={onClick} className={className}>
        {children}
      </button>
  );
};

interface CounterProps extends ComponentProps {
  initialCount?: number;
}

export const Counter = (props: CounterProps) => {
  const { initialCount = 0 } = props;

  const [getCount, setCount] = useState(initialCount);

  const increment = () => {
    setCount(getCount() + 1);
  };

  const decrement = () => {
    setCount(currentCount => currentCount - 1);
  };

  const reset = () => {
    setCount(initialCount);
  };

  return (
      <div className="counter">
        <h2>Count: {getCount()}</h2>
        <div className="buttons">
          <Button onClick={increment}>+</Button>
          <Button onClick={decrement}>-</Button>
          <Button onClick={reset} className="danger">Reset</Button>
        </div>
      </div>
  );
};
