import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bulma/css/bulma.css';

const GAP = Math.floor(Math.random() * 9);
let counter = 0;

/********************************************** Helper functions **************************************************************/

// Makes the style of the image for the puzzle and its properties.
// Checks for the position of a block if given. Adjusts for the offset.
function getImage(image, position) {
  let x , y = 0;
  let block_size = 3;

  // if no position was specified, we are not dealing with a block
  // so we don't need to adjust the image offset
  if (position !== undefined) {
    x = (position % block_size ) * -132;
    y =
      Math.trunc(position / block_size ) * -132;
  }

  return {
    backgroundImage:  `url(${require("./image.jpg")})`,
    backgroundSize: image.width < image.height ? '396px auto' : 'auto 396px',
    backgroundPosition: `${x}px ${y}px`,
  };
}

// Boolean that checks if the block is next to gap in the puzzle.
function isNextTo(block, gaps) {
  let block_size = 3;
  let above = block === gaps - block_size  || block === gaps + block_size ;
  let gap_left = gaps % block_size  === 0;
  let gap_right = gaps % block_size  === block_size - 1;
  let side = (!gap_left && block === gaps - 1) || (!gap_right && block === gaps + 1);
  return side || above;
}

// Shuffle the array of block pieces.
function shuffle(block_pieces) {
  for (let i = block_pieces.length; i; i--) {
    let index = Math.floor(Math.random() * i);
    [block_pieces[i - 1], block_pieces[index]] = [block_pieces[index], block_pieces[i - 1]];
  }
}

// Boolean that checks if all puzzle blocks are in their correct position in the array compared to their index.
function gameWon(blocks) {
  for (let i = 0; i < blocks.length - 1; i++) {
    if (blocks[i] !== i) {
      return false;
    }
  }
  return true;
}

/************************************************** Sliding Puzzle ************************************************************/

// Initialize the positions for each puzzle piece. Shuffle the positions for the puzzle pieces.
class Puzzle extends React.Component {
  constructor() {
    super();

    let positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    positions = positions.filter((item) => {
      return item !== GAP;
    });
    shuffle(positions);
    positions.push(GAP);

    // Swap the block which is at the gap at its index with the gaps position.
    let tmp = 0;
    tmp = positions[GAP];
    positions[GAP] = positions[8];
    positions[8] = tmp;

    // Add the state of the blocks position, game with the corresponding image.
    this.state = {
      blocks: positions,
      gaps: GAP,
      image: {},
    };
  }

  // Count the moves done via clicks made. Check if the gap is next to the blocks position.
  // Check if the puzzle is complete.
  // Change position of the gap and block.
  handleMove(i) {
    if (!isNextTo(i, this.state.gaps)) {
      return;
    }

    const blocks = this.state.blocks.slice();
    if (gameWon(blocks)) {
      return;
    }

    blocks[this.state.gaps] = blocks[i];
    blocks[i] = GAP;
    this.setState({ blocks: blocks, gaps: i });
    counter = counter + 1;
  }

  render() {
    if (gameWon(this.state.blocks)) {
      alert('Congradulations you');
    }

    // Reload the page with a new shuffled puzzle.
    const newGame = () => {
      window.location.reload(false);
    };

    // Responsive text using bulma: https://bulma.io. Centering the text no matter the size.
    // Display the number of moves made.
    // Create the style element for the board. Sets the image for the game board.
    // Handles clicks(moves) from user.
    return (
      <div className = 'puzzle'>
        <div className = 'title section has-text-centered'> Sliding Puzzle </div>
        <h1 className = 'moves'>
          Moves: <span>{counter}</span>
        </h1>
        <div
          className = 'puzzle-grid hero is-primary'
          style = {{ backgroundColor: '#FFFFFF' }}
        >
          <Grid
            blocks = {this.state.blocks}
            image = {this.state.image}
            onClick = {(i) => this.handleMove(i)}
          />
        </div>
        <div className = 'new-game section has-text-centered'>
          <button className = 'restart' onClick = {newGame}>New Game</button>
        </div>
      </div>
    );
  }
}

// Create the game board with each piece. Set the properties for each block and their position.
// Get the full image as an overlay for the background.
class Grid extends React.Component {
  createBlock(i) {
    return (
      <Block
        key = {i}
        position = {this.props.blocks[i]}
        onClick = {() => this.props.onClick(i)}
        image = {this.props.image}
      />
    );
  }

  render() {
    let blocks = [];
    for (let i = 0; i < 9; i++) {
      blocks.push(this.createBlock(i));
    }

    return (
      <div className = 'grid container'>
        <div className = 'background-image is-overlay' style = {getImage(this.props.image)}></div>
        {blocks}
      </div>
    );
  }
}

// Apply style for the Block set the properties for each Block as a button.
class Block extends React.Component {
  render() {
    return (
      <button
        className = 'blocks'
        onClick = {this.props.onClick}
        style = {this.props.position !== GAP ? getImage(this.props.image, this.props.position) : {}}
      ></button>
    );
  }
}

ReactDOM.render(<Puzzle />, document.getElementById('root'));