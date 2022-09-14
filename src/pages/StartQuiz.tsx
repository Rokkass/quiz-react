import styles from './StartQuiz.module.scss';
import { Button } from '../components/Button/Button';

interface StartQuizProps {
  closeFn: () => void;
}

export default function StartQuiz(props: StartQuizProps) {
  return (
    <div className={styles.start__wrapper}>
      <h1>Quizzical</h1>
      <p>Do you take up the challenge?</p>
      <Button large closeFn={props.closeFn}>
        Start quiz
      </Button>
    </div>
  );
}
