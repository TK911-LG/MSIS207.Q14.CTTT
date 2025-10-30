/** @jsx createElement */
import { ComponentProps } from './jsx-runtime';

interface CardProps extends ComponentProps {
  title?: string;
  className?: string;
  onClick?: (event: MouseEvent) => void;
  children?: any;
}

export const Card = (props: CardProps) => {
  const { title, className = '', onClick, children } = props;
  const cardClass = `card ${className}`.trim();

  return (
      <div className={cardClass} onClick={onClick}>
        {title && <h3>{title}</h3>}
        <div>{children}</div>
      </div>
  );
};

interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: any;
}

export const Modal = (props: ModalProps) => {
  const { isOpen, onClose, title, children } = props;

  if (!isOpen) {
    return null as any;
  }

  const handleOverlayClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-content">
          {title && <h2>{title}</h2>}
          <div>{children}</div>
          <button className="modal-close" onClick={onClose}>Close</button>
        </div>
      </div>
  );
};

interface FormProps extends ComponentProps {
  onSubmit: (event: Event) => void;
  className?: string;
  children?: any;
}

export const Form = (props: FormProps) => {
  const { onSubmit, className = '', children } = props;
  const formClass = `form ${className}`.trim();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
      <form className={formClass} onSubmit={handleSubmit}>
        {children}
      </form>
  );
};

interface InputProps extends ComponentProps {
  type?: string;
  value?: string;
  onChange?: (event: Event) => void;
  onInput?: (event: Event) => void;
  placeholder?: string;
  className?: string;
}

export const Input = (props: InputProps) => {
  const {
    type = 'text',
    value,
    onChange,
    onInput,
    placeholder,
    className = ''
  } = props;
  const inputClass = `input ${className}`.trim();

  return (
      <input
          type={type}
          value={value}
          onChange={onChange}
          onInput={onInput}
          placeholder={placeholder}
          className={inputClass}
      />
  );
};
