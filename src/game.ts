export interface Player {
  name: string;
  score: number;
  history: number[][]; // To store scores of each turn
}

/**
 * Manages the state and rules of a darts game.
 */
export class DartsGame {
  public players: Player[] = [];
  public readonly startingScore: number;
  public currentPlayerIndex: number = 0;

  constructor(startingScore: number = 501) {
    this.startingScore = startingScore;
  }

  /**
   * Adds a new player to the game.
   */
  addPlayer(name: string): void {
    if (this.players.find(p => p.name === name)) {
      console.warn(`Player ${name} already exists.`);
      return;
    }
    this.players.push({
      name,
      score: this.startingScore,
      history: [],
    });
  }

  /**
   * Records the scores for the current player's turn and advances to the next player.
   * @param dartScores An array of up to 3 numbers representing the score of each dart.
   */
  recordTurn(dartScores: number[]): void {
    const player = this.getCurrentPlayer();
    if (!player || this.getWinner()) {
      return; // Game is over or no players
    }

    const turnTotal = dartScores.reduce((sum, score) => sum + score, 0);
    const newScore = player.score - turnTotal;

    // Standard bust rules: score goes below zero, or hits 1.
    // A score of zero must be achieved with a double. (This logic can be added later).
    if (newScore < 0 || newScore === 1) {
      // Bust! Score does not change.
      console.log(`${player.name} busts!`);
    } else {
      player.score = newScore;
    }

    player.history.push(dartScores);

    // Advance to the next player
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }

  /**
   * Returns the currently active player.
   */
  getCurrentPlayer(): Player | undefined {
    return this.players[this.currentPlayerIndex];
  }

  /**
   * Checks if a player has won the game.
   */
  getWinner(): Player | undefined {
    return this.players.find(p => p.score === 0);
  }

  /**
   * Resets the game to its initial state.
   */
  reset(): void {
    this.players.forEach(p => {
      p.score = this.startingScore;
      p.history = [];
    });
    this.currentPlayerIndex = 0;
  }
}