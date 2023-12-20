const startForm = document.getElementById('start-form');
const gameBoard = document.getElementById('game-board');
const timer = document.getElementById('timer');
const result = document.getElementById('result');
const restartBtn = document.getElementById('restart-btn');

let cards;
let flippedCards = [];
let matchedCards = [];
let gameStarted = false;
let gameTime = 0;
let timerInterval;
let score = 0;
let numPairs; // Declare numPairs as a global variable

function createCards() {
  const imageUrls = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Los_Angeles_Lakers_logo.svg/2560px-Los_Angeles_Lakers_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Boston_Celtics.svg/1200px-Boston_Celtics.svg.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/f/fb/Miami_Heat_logo.svg/800px-Miami_Heat_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/New_York_Knicks_logo.svg/1200px-New_York_Knicks_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/2/24/Atlanta_Hawks_logo.svg/1200px-Atlanta_Hawks_logo.svg.png',
    'https://www.cleveland.com/resizer/BZlusBah1PXRlb8mOUiHa4DOHXI=/1280x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/F2W3KQL3B5FT3DNU7RZJD44C3E.jpg',
    'https://logos-world.net/wp-content/uploads/2020/05/Utah-Jazz-logo.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/0/0e/Philadelphia_76ers_logo.svg/1200px-Philadelphia_76ers_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/7/76/Denver_Nuggets.svg/1200px-Denver_Nuggets.svg.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/d/dc/Phoenix_Suns_logo.svg/1200px-Phoenix_Suns_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Milwaukee_Bucks_logo.svg/1200px-Milwaukee_Bucks_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Memphis_Grizzlies.svg/1200px-Memphis_Grizzlies.svg.png',
    'https://assets.stickpng.com/images/58419cbca6515b1e0ad75a66.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Toronto_Raptors_logo.svg/800px-Toronto_Raptors_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/en/c/c2/Minnesota_Timberwolves_logo.svg',
    'https://upload.wikimedia.org/wikipedia/en/thumb/5/5d/Oklahoma_City_Thunder.svg/1200px-Oklahoma_City_Thunder.svg.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Houston_Rockets.svg/170px-Houston_Rockets.svg.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/6/67/Chicago_Bulls_logo.svg/1200px-Chicago_Bulls_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Pistons_logo17.svg/1200px-Pistons_logo17.svg.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Indiana_Pacers.svg/1200px-Indiana_Pacers.svg.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Charlotte_Hornets_%282014%29.svg/800px-Charlotte_Hornets_%282014%29.svg.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/0/0d/New_Orleans_Pelicans_logo.svg/1200px-New_Orleans_Pelicans_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Brooklyn_Nets_newlogo.svg/1200px-Brooklyn_Nets_newlogo.svg.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/b/bb/Los_Angeles_Clippers_%282015%29.svg/1200px-Los_Angeles_Clippers_%282015%29.svg.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/9/97/Dallas_Mavericks_logo.svg/640px-Dallas_Mavericks_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/0/01/Golden_State_Warriors_logo.svg/1200px-Golden_State_Warriors_logo.svg.png',
    'https://logos-world.net/wp-content/uploads/2020/05/Sacramento-Kings-logo.png',
    'https://content.sportslogos.net/logos/6/239/full/5767.gif',
    'https://upload.wikimedia.org/wikipedia/en/thumb/1/10/Orlando_Magic_logo.svg/1200px-Orlando_Magic_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Washington_Wizards_logo.svg/1200px-Washington_Wizards_logo.svg.png',
  ];

  let selectedImages = imageUrls.slice(0, numPairs);
  selectedImages = [...selectedImages, ...selectedImages];

  for (let i = selectedImages.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selectedImages[i], selectedImages[j]] = [selectedImages[j], selectedImages[i]];
  }

  cards = selectedImages.map((image, index) => ({
    id: index,
    image,
    flipped: false,
    matched: false,
  }));
}

function renderCards() {
  gameBoard.innerHTML = '';
  cards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    if (card.flipped || card.matched) {
      const imageElement = document.createElement('img');
      imageElement.src = card.image;
      imageElement.classList.add('card-image'); // Add a CSS class for styling

      cardElement.appendChild(imageElement);
      cardElement.classList.add(card.matched ? 'matched' : 'flipped');
    }
    cardElement.addEventListener('click', () => flipCard(card));
    gameBoard.appendChild(cardElement);
  });
}

function flipCard(card) {
  if (card.matched || flippedCards.length >= 2) return;

  card.flipped = true;
  flippedCards.push(card);
  renderCards();

  if (flippedCards.length === 2) {
    const [card1, card2] = flippedCards;

    if (card1.image === card2.image) {
      card1.matched = true;
      card2.matched = true;
      flippedCards = [];
      score++;

      if (score === numPairs) { // Check if the score equals the number of pairs
        endGame();
      }
    } else {
      setTimeout(() => {
        card1.flipped = false;
        card2.flipped = false;
        flippedCards = [];
        renderCards();
      }, 1000);
    }
  }
}

function startGame(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  numPairs = parseInt(document.getElementById('cards').value); // Assign the value to numPairs

  createCards();
  renderCards();

  startForm.style.display = 'none';
  gameBoard.style.display = 'flex';
  timerInterval = setInterval(updateTimer, 1000);

  gameStarted = true;
}

function updateTimer() {
  gameTime++;
  const minutes = Math.floor(gameTime / 60);
  const seconds = gameTime % 60;
  timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function endGame() {
  clearInterval(timerInterval);
  result.textContent = `Congratulations! You completed the game in ${timer.textContent}.`;
  restartBtn.style.display = 'block';
  //score = 0;
  
}

function restartGame() {
  startForm.style.display = 'block';
  gameBoard.style.display = 'none';
  timer.textContent = '00:00';
  result.textContent = '';
  restartBtn.style.display = 'none';
  cards = [];
  flippedCards = [];
  matchedCards = [];
  gameStarted = false;
  gameTime = 0;
  score = 0;
  renderScore();
}

function renderScore() {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = `Score: ${score}`;
}

startForm.addEventListener('submit', startGame);
restartBtn.addEventListener('click', restartGame);
