import { Game } from "phaser";
import { isContext } from "vm";
import MainScene from "../Scenes/MainScene";

const NUM_OF_TURNS_AVAILABLE = 10;
const NUM_OF_PAIRS = 6;
const MESSAGE_TIMEOUT = 2000;

/**
 * Use this class for main implementation.
 * 
*/
export class GameManager {
    //indicators for 1st/2nd card flipped
    private firstCard: { symbol: Phaser.GameObjects.Sprite; texture: number } = null as any;
    private score = 0;
    private canFlip = true;
    private turnsLeft = NUM_OF_TURNS_AVAILABLE;
    private PositiveFeedbackBank: string[];
    private negativeFeedbackBank: string[];

    constructor(private i_Scene: MainScene) {
        this.PositiveFeedbackBank = ['בשבילי תמיד תישארי מטומטמת', 'זאבה גאה', 'אזה יופי'];
        this.negativeFeedbackBank = ['מה עשית אגרול???', 'יצאת שונטל אבוחצרה', 'ענת לסקר מתביישת'];
        this.displayMessage('Start!');

    }

    public displayMessage(text: string, isEndOfGame: boolean = false) {

        this.canFlip = false;
        this.i_Scene.displayTempMessage(text, MESSAGE_TIMEOUT);
        setTimeout(() => {
            this.i_Scene.hideMessage();
            !isEndOfGame && (this.canFlip = true);
        }, MESSAGE_TIMEOUT);
    }

    public displayRetryButton() {
        this.i_Scene.displayRetryButton();
        this.i_Scene.retryButton.on('pointerover', () => this.i_Scene.enterButtonHoverState())
        this.i_Scene.retryButton.on('pointerdown', () => this.restartGame());
    }

    //recieves true for winning and false for losing
    public atEndOfGame(win: boolean) {
        const endMessage: string = win ? "ניצחת כנגד כל הסיכויים" : "לוזרית";
        this.displayMessage(endMessage, true);
        this.canFlip = false;
        this.displayRetryButton();
    }

    private restartGame() {
        this.score = 0;
        this.i_Scene.updateScore(this.score as unknown as string);
        this.turnsLeft = NUM_OF_TURNS_AVAILABLE;
        this.canFlip = true;
        this.i_Scene.hideRetryButton();
        this.i_Scene.init();
    }

    private onFirstCardFlipped(card: Phaser.GameObjects.Sprite, texture: number) {
        this.firstCard = { symbol: card, texture };
    }

    private isClickedSameCardTwice(card: Phaser.GameObjects.Sprite) {
        return (card.x === this.firstCard.symbol.x) && (card.y === this.firstCard.symbol.y);
    }

    public cardFlipped(card: Phaser.GameObjects.Sprite, texture: number) {

        if (!this.canFlip) { return; }

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

    public correctPairChosen(card: Phaser.GameObjects.Sprite) {
        this.score++;
        this.i_Scene.updateScore(this.score as unknown as string);
        this.firstCard.symbol.removeInteractive();
        card.removeInteractive();
        this.firstCard = null as any;
        if (this.isGameOver()) {
            this.atEndOfGame(this.hasWon());
        } else {
            const randomMessageIndex = Math.floor(Math.random() * 3);
            const randomMessage = this.PositiveFeedbackBank[randomMessageIndex];
            this.displayMessage(randomMessage);
        }
    }

    public wrongPairChosen(card: Phaser.GameObjects.Sprite) {
        this.canFlip = false;
        setTimeout(() => {
            this.firstCard.symbol.setTexture("symbols", `symbol_0.png`);
            card.setTexture("symbols", `symbol_0.png`);

            this.canFlip = true;
            this.firstCard = null as any;
            const randomMessageIndex = Math.floor(Math.random() * 3);
            const randomMessage = this.negativeFeedbackBank[randomMessageIndex];
            if (this.isGameOver()) {
                this.atEndOfGame(false);
            } else {
                this.displayMessage(randomMessage);
            }
        }, 1000);
    }

    public hasWon() {
        return this.score === NUM_OF_PAIRS;
    }

    public isGameOver() {
        return !this.turnsLeft || this.score === NUM_OF_PAIRS;
    }
}




