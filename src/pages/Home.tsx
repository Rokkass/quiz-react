import { nanoid } from 'nanoid';
import StartQuiz from './StartQuiz';
import { useEffect, useState } from 'react';
import { Button } from '../components/Button/Button';
import Answer from '../components/Answer/Answer';
import ScorePage from './ScorePage';
import styles from './Home.module.scss';

type Question = {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
};

function Home() {
  const [isStartOpen, setIsStartOpen] = useState(true);
  const [quizPage, setQuizPage] = useState(false);
  const [isScoreOpen, setIsScoreOpen] = useState(false);

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState({
    content: '',
    answer: '',
  });
  const [questionCounter, setQuestionCounter] = useState(0);
  const [score, setScore] = useState<number>(0);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          'https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple'
        );
        const resData = await res.json();
        const data = resData.results;
        if (data) {
          data.map((q: Question) => q.incorrect_answers.push(q.correct_answer));
        }

        setData(data);
        setLoading(false);
      } catch (e) {
        console.error('Error fetching api data', e);
      }
    })();
    return () => {
      setData([]);
    };
  }, [reset]);

  useEffect(() => {
    if (questionCounter === 0 && data.length) {
      setQuestion(generateQuestion(0));
      setQuestionCounter((c) => c + 1);
    }
    console.log(data);
  }, [data]);

  function generateQuestion(num: number) {
    let obj = {
      content: data[num].question,
      answer: '',
    };
    const usedNumbers: number[] = [];
    while (Object.keys(obj).length !== 6) {
      let num = Math.floor(Math.random() * 4);
      if (!usedNumbers.includes(num)) {
        usedNumbers.push(num);

        obj = {
          ...obj,
          [Object.keys(obj).length]:
            data[questionCounter].incorrect_answers[num],
        };
      }
    }
    return obj;
  }

  function handleNextQuestion() {
    if (questionCounter < 6) {
      setQuestion(generateQuestion(questionCounter));
      setQuestionCounter((c) => c + 1);
    }
  }

  function closeStartPage() {
    setIsStartOpen(false);
    setQuizPage(true);
  }

  function resetQuiz() {
    setIsStartOpen(true);
    setIsScoreOpen(false);
    setScore(0);
    setQuestionCounter(0);
    setReset((reset) => !reset);
  }

  function handleAnswer(playerAnswer: string) {
    data[questionCounter - 1].answer = playerAnswer;
  }

  function handleSubmit() {
    let count = data
      .map((question) => {
        return question.answer === question.correct_answer ? 1 : 0;
      })
      .reduce(
        (previousValue: number, currentValue: number) =>
          previousValue + currentValue,
        0
      );
    setScore(count);
    setQuizPage(false);
  }

  const answers = [2, 3, 4, 5].map((num, id) => {
    return (
      <Answer
        // @ts-ignore
        answer={question[num]}
        key={id}
        handleAnswerFn={handleAnswer}
      />
    );
  });

  return (
    <>
      {isStartOpen && <StartQuiz closeFn={closeStartPage} />}
      {!loading && quizPage && (
        <div className={styles.home__wrapper}>
          <div className={styles.quiz__wrapper}>
            <h2>{question.content}</h2>
            <div className={styles.answers__wrapper}>{answers}</div>
            {questionCounter < 5 && (
              <Button handleNextQuestion={handleNextQuestion}>
                Next question
              </Button>
            )}
            {questionCounter >= 5 && (
              <Button handleSubmit={handleSubmit}>Check answers</Button>
            )}
          </div>
        </div>
      )}
      {!isStartOpen && !quizPage && (
        <ScorePage playerScore={score} closeScorePageFn={resetQuiz} />
      )}
    </>
  );
}

export default Home;
