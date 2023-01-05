"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const NUM_OF_TURNS_AVAILABLE = 10;
const NUM_OF_PAIRS = 6;
const MESSAGE_TIMEOUT = 2000;
/**
 * Use this class for main implementation.
 *
*/
class GameManager {
    constructor(i_Scene) {
        this.i_Scene = i_Scene;
        //indicators for 1st/2nd card flipped
        this.firstCard = null;
        this.score = 0;
        this.canFlip = true;
        this.turnsLeft = NUM_OF_TURNS_AVAILABLE;
        this.PositiveFeedbackBank = ['בשבילי תמיד תישארי מטומטמת', 'זאבה גאה', 'אזה יופי'];
        this.negativeFeedbackBank = ['מה עשית אגרול???', 'יצאת שונטל אבוחצרה', 'ענת לסקר מתביישת'];
        this.displayMessage('Start!');
    }
    displayMessage(text, isEndOfGame = false) {
        this.canFlip = false;
        this.i_Scene.displayTempMessage(text, MESSAGE_TIMEOUT);
        setTimeout(() => {
            this.i_Scene.hideMessage();
            !isEndOfGame && (this.canFlip = true);
        }, MESSAGE_TIMEOUT);
    }
    displayRetryButton() {
        this.i_Scene.displayRetryButton();
        this.i_Scene.retryButton.on('pointerover', () => this.i_Scene.enterButtonHoverState());
        this.i_Scene.retryButton.on('pointerdown', () => this.restartGame());
    }
    //recieves true for winning and false for losing
    atEndOfGame(win) {
        const endMessage = win ? "ניצחת כנגד כל הסיכויים" : "לוזרית";
        this.displayMessage(endMessage, true);
        this.canFlip = false;
        this.displayRetryButton();
    }
    restartGame() {
        this.score = 0;
        this.i_Scene.updateScore(this.score);
        this.turnsLeft = NUM_OF_TURNS_AVAILABLE;
        this.canFlip = true;
        this.i_Scene.hideRetryButton();
        this.i_Scene.init();
    }
    onFirstCardFlipped(card, texture) {
        this.firstCard = { symbol: card, texture };
    }
    isClickedSameCardTwice(card) {
        return (card.x === this.firstCard.symbol.x) && (card.y === this.firstCard.symbol.y);
    }
    cardFlipped(card, texture) {
        if (!this.canFlip) {
            return;
        }
        card.setTexture("symbols", `symbol_${texture}.png`);
        //if its the first card to flip
        if (!this.firstCard) {
            return this.onFirstCardFlipped(card, texture);
        }
        if (this.isClickedSameCardTwice(card)) {
            return;
        }
        this.turnsLeft--;
        if (this.firstCard.texture === texture) {
            this.correctPairChosen(card);
        }
        else {
            this.wrongPairChosen(card);
        }
    }
    correctPairChosen(card) {
        this.score++;
        this.i_Scene.updateScore(this.score);
        this.firstCard.symbol.removeInteractive();
        card.removeInteractive();
        this.firstCard = null;
        if (this.isGameOver()) {
            this.atEndOfGame(this.hasWon());
        }
        else {
            const randomMessageIndex = Math.floor(Math.random() * 3);
            const randomMessage = this.PositiveFeedbackBank[randomMessageIndex];
            this.displayMessage(randomMessage);
        }
    }
    wrongPairChosen(card) {
        this.canFlip = false;
        setTimeout(() => {
            this.firstCard.symbol.setTexture("symbols", `symbol_0.png`);
            card.setTexture("symbols", `symbol_0.png`);
            this.canFlip = true;
            this.firstCard = null;
            const randomMessageIndex = Math.floor(Math.random() * 3);
            const randomMessage = this.negativeFeedbackBank[randomMessageIndex];
            if (this.isGameOver()) {
                this.atEndOfGame(false);
            }
            else {
                this.displayMessage(randomMessage);
            }
        }, 1000);
    }
    hasWon() {
        return this.score === NUM_OF_PAIRS;
    }
    isGameOver() {
        return !this.turnsLeft || this.score === NUM_OF_PAIRS;
    }
}
exports.GameManager = GameManager;
