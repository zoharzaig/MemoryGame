// You can write more code here
// / <reference path="../../node_modules/phaser/types/phaser.d.ts"/>
/* START OF COMPILED CODE */

import { GameManager } from "../Scripts/GameManager";

const NUM_OF_CARDS = 12;

export default class MainScene extends Phaser.Scene {

	private gameManger: GameManager = null as any;
	private messageDisplayer: Phaser.GameObjects.Text = null as any;
	private scoreDisplayer: Phaser.GameObjects.Text = null as any;
	public retryButton: Phaser.GameObjects.Text = null as any;
	static sortedPositions = [
		[215, 135],
		[405, 135],
		[595, 135],
		[215, 263],
		[405, 263],
		[595, 263],
		[215, 392],
		[405, 392],
		[595, 392],
		[215, 521],
		[405, 521],
		[595, 521],
	];

	private symbols: any[] = [];

	constructor() {
		super("MainScene");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	public displayTempMessage(text: string, timeout: number) {
		this.messageDisplayer.setText(text);
	}

	public hideMessage() {
		this.messageDisplayer.setText('');
	}

	public displayRetryButton() {
		const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
		this.retryButton = this.add.text(screenCenterX, 30, 'RETRY').setOrigin(0.5);
		this.retryButton.setFontSize(40);
		this.retryButton.setInteractive();
	}

	public hideRetryButton() {
		this.retryButton.setText('');
	}
	public enterButtonHoverState() {
		this.retryButton.setStyle({ fill: '#ff0' });
		setTimeout(() => {
			this.retryButton.setStyle({ fill: '#ffffff' });
		}, 300);
	}

	public updateScore(newScore: string) {
		this.scoreDisplayer.setText("Score: " + newScore);
	}

	private createAndAddSymbol(x: number, y: number, symbolName: string): Phaser.GameObjects.Sprite {
		const symbol = this.add.sprite(x, y, "symbols", `symbol_0.png`);
		symbol.scaleX = 0.5;
		symbol.scaleY = 0.5;
		return symbol;
	}

	private addMessageDisplayer() {
		const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
		const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
		this.messageDisplayer = this.add.text(screenCenterX, screenCenterY, '').setOrigin(0.5);
		this.messageDisplayer.setFontSize(50);
		this.messageDisplayer.setDepth(100);
	}

	private addScoreDisplayer() {
		this.scoreDisplayer = this.add.text(30, 20, 'Score: 0');
		this.scoreDisplayer.setFontSize(30);
		this.scoreDisplayer.setDepth(100);
	}

	private chooseRandomPosition(symbolNNumber: number, positionsPile: number[][], symbols_layer: Phaser.GameObjects.Layer){
		let cardPositin = Math.floor(Math.random() * (positionsPile.length));
		let position = positionsPile.splice(cardPositin, 1)[0];

		const card = this.createAndAddSymbol(position[0], position[1], `${symbolNNumber}`);
		this.symbols.push({ symbol: card, texture: symbolNNumber });
		symbols_layer.add(card);

		card.setInteractive();
		card.on('pointerup', () => {
			this.gameManger.cardFlipped(card, symbolNNumber);
		})
	}

	private shuffleCards(){
		// symbols_layer
		const symbols_layer = this.add.layer();
		//choose positions of cards ranndomly
		const positionsPile = [...MainScene.sortedPositions];

		for (let i = 1; i <= (NUM_OF_CARDS / 2); i++) {
			//choose ranndom position for 1st card of that type
			this.chooseRandomPosition(i, positionsPile, symbols_layer);
			//choose ranndom position for 2nd card of that type
			this.chooseRandomPosition(i, positionsPile, symbols_layer);
		}

	}

	init(){

		// bg
		const bg = this.add.image(408, 368, "bg");
		bg.scaleX = 0.6;
		bg.scaleY = 0.6;
		this.shuffleCards();
	}


	editorCreate(): void {

		this.addMessageDisplayer();
		this.addScoreDisplayer();
		this.init();
		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	preload() {
		this.load.pack("pack", './Assets/game_pack_sd.json');
	}

	create() {
		this.editorCreate();
		this.game.events.emit("GameCreated");
	}

	setGameManager(gameManger: GameManager) {
		this.gameManger = gameManger;
	}
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
