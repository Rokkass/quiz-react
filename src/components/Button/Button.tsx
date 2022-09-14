import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  children: React.ReactNode;
  large?: boolean;
  handleSubmit?: () => void;
  closeFn?: () => void;
  handleNextQuestion?: () => void;
  disabled?: boolean;
  closeScorePageFn?: () => void;
}

export function Button(props: ButtonProps) {
  const buttonClass = props.disabled
    ? styles.disabled__button
    : props.large
    ? styles.large__button
    : styles.quiz__button;
  return props.handleSubmit ? (
    <button className={buttonClass} onClick={props.handleSubmit}>
      {props.children}
    </button>
  ) : props.handleNextQuestion ? (
    <button className={buttonClass} onClick={props.handleNextQuestion}>
      {props.children}
    </button>
  ) : props.closeScorePageFn ? (
    <button className={buttonClass} onClick={props.closeScorePageFn}>
      {props.children}
    </button>
  ) : props.disabled === true ? (
    <button className={buttonClass} onClick={props.closeFn} disabled>
      {props.children}
    </button>
  ) : (
    <button className={buttonClass} onClick={props.closeFn}>
      {props.children}
    </button>
  );
}
