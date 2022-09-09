import styles from './ScorePage.module.scss';
import { Button } from '../components/Button/Button';

type ScorePageProps = {
  playerScore: number;
  closeScorePageFn: () => void;
};

export default function ScorePage(props: ScorePageProps) {
  return (
    <div className={styles.score__wrapper}>
      <h1>Quiz completed!</h1>
      <p>Score: {props.playerScore}/5</p>
      <Button large closeScorePageFn={props.closeScorePageFn}>
        Back to start
      </Button>
    </div>
  );
}
