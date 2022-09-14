import styles from './Answer.module.scss';

interface AnswerProps {
  handleAnswerFn: (answer: string, q: string) => void;
  answer: string;
  selected?: string;
  question: string;
}

const Answer = (props: AnswerProps) => {
  const answerStyles =
    props.selected === props.answer ? styles.answer__selected : styles.answer;
  return (
    <div
      className={answerStyles}
      onClick={() => props.handleAnswerFn(props.answer, props.question)}
    >
      {props.answer}
    </div>
  );
};

export default Answer;
