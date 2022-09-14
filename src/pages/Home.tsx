import { nanoid } from 'nanoid';
import StartQuiz from './StartQuiz';
import { useEffect, useState } from 'react';
import { Button } from '../components/Button/Button';
import Answer from '../components/Answer/Answer';
import ScorePage from './ScorePage';
import styles from './Home.module.scss';

// TODO : button styles on click

interface Question {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

interface currentQuestion {
  content: string;
  answer: string;
  2?: { answerContent: string; isHeld: boolean };
  3?: { answerContent: string; isHeld: boolean };
  4?: { answerContent: string; isHeld: boolean };
  5?: { answerContent: string; isHeld: boolean };
}

function Home() {
  const [tidy, setTidy] = useState(false);
  const [isStartOpen, setIsStartOpen] = useState(true);
  const [quizPage, setQuizPage] = useState(false);
  const [isScoreOpen, setIsScoreOpen] = useState(false);

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<currentQuestion>({
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
        // console.log(JSON.stringify(resData));
        const clearData =
          resData &&
          JSON.stringify(resData)
            .replaceAll('&#039;', "'")
            .replaceAll('&quot;', "''")
            .replaceAll('&rsquo;', "'")
            .replaceAll('&shy;', '')
            .replaceAll('&amp;', '&')
            .replaceAll('&lrm;', '')
            .replaceAll('&oacute;', 'ó')
            .replaceAll('&hellip;', '…')
            .replaceAll('&rdquo;', "''");
        const parsedData = clearData && JSON.parse(clearData);
        const data = parsedData.results;
        // const data = resData.results;
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

  function generateQuestion(num: number): currentQuestion {
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
  // function generateQuestion(num: number) {
  //   let obj = {
  //     content: data[num].question,
  //     answer: '',
  //   };
  //   const usedNumbers: number[] = [];
  //   while (Object.keys(obj).length !== 6) {
  //     let num = Math.floor(Math.random() * 4);
  //     if (!usedNumbers.includes(num)) {
  //       usedNumbers.push(num);
  //
  //       obj = {
  //         ...obj,
  //         [Object.keys(obj).length]: {
  //           answerContent: data[questionCounter].incorrect_answers[num],
  //           isHeld: false,
  //         },
  //       };
  //     }
  //   }
  //   return obj;
  // }

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

  function handleSubmit() {
    let count = data
      .map((question: { answer: string; correct_answer: string }) => {
        return question.answer === question.correct_answer ? 1 : 0;
      })
      .reduce(
        (previousValue: number, currentValue: number) =>
          previousValue + currentValue,
        0
      );
    setScore(count);
    setQuizPage(false);
    console.log(question.answer);
  }

  function handleAnswer(playerAnswer: string, q: string) {
    setData((oldData) =>
      oldData.map((quest) => {
        return quest.question === q
          ? { ...quest, answer: playerAnswer }
          : quest;
      })
    );
    setQuestion((oldQ) => {
      return {
        ...oldQ,
        selected: playerAnswer,
      };
    });
    // data[questionCounter - 1].answer = playerAnswer;
  }

  const answers = [2, 3, 4, 5].map((num, id) => {
    return (
      <Answer
        // @ts-ignore
        answer={question[num]}
        key={id}
        question={question.content}
        selected={
          // @ts-ignore
          data.length > 0 && question.selected
        }
        handleAnswerFn={handleAnswer}
      />
    );
  });
  console.log();

  return (
    <>
      {isStartOpen && <StartQuiz closeFn={closeStartPage} disabled={loading} />}
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
