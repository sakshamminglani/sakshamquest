const clues = [
  {
    message: 'I got my name from it Marshall',

    correctAnswers: ['eminem'],
    location: 'https://www.shutterstock.com/image-photo/kharkov-ukraine-march-15-2021-m-2092409131'

  },
  {
    message: 'Im the king yet I hang on the trees or lie on the table in pieces',
    correctAnswers: ['mango'],
    location: 'https://www.healthyeating.org/nutrition-topics/general/food-groups/fruits'

  },
  {
    message: 'I am the goat, I am short and I like to play in these fields',
    correctAnswers: ['messi'],
    location: 'https://www.pexels.com/photo/green-football-field-399187/'
  },
  {
    message: 'You hate me, yet i am the only one who can save you from extinction',
    correctAnswers: ['bees'],
    location: 'https://www.indiamart.com/proddetail/pure-natural-honey-13643225173.html'

  },
  {
    message: 'See my last smoke, Its bad for the baby..',
    correctAnswers: ['max payne'],
    location: 'https://www.youtube.com/watch?v=Cv0y0On8ZGQ'

  },
];

let currentClue = 0;
let score = 0;

const clueElement = document.getElementById('clue');
const scoreElement = document.getElementById('score');
const answerElement = document.getElementById('answer');
const formElement = document.querySelector('form');
const textElement = document.getElementById('text');

function showClue() {
  clueElement.textContent = clues[currentClue].message;
  const location = clues[currentClue].location;
  if (location) {
    const link = document.createElement('div');
    link.innerHTML = `<a href="${location}" target="_blank">Click Here for the clue</a>`;
    clueElement.appendChild(link);
  }
}


function checkAnswer(event) {
  event.preventDefault();
  const answer = answerElement.value.toLowerCase();
  const correctAnswers = clues[currentClue].correctAnswers;
  if (correctAnswers.includes(answer)) {
    score += 10;
    scoreElement.textContent = score;
    if (currentClue === clues.length - 1) {
      clueElement.textContent = `Thanks for playing!`;
      formElement.style.display = 'none';
      textElement.value = 'Good Game!! Please visit next time!';
    } else {
      currentClue++;
      showClue();
      answerElement.value = '';
    }
  } else {
    alert('Sorry, that is not the correct answer.');
  }
}


showClue();
formElement.addEventListener('submit', checkAnswer);
