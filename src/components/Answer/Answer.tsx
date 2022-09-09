import styles from './Answer.module.scss';

type AnswerProps = {
  handleAnswerFn: (answer: string) => void;
  answer: string;
};

const Answer = (props: AnswerProps) => {
  return (
    <div
      className={styles.answer}
      onClick={() => props.handleAnswerFn(props.answer)}
    >
      {props.answer}
    </div>
  );
};

export default Answer;
