import Sprite from './sprite.js';
import MoneyData from './money.js';
export default class BudgetMenu extends Sprite {
	constructor(game) {
		super(game);
		this.expanded = false;
		this.budgetItems = [];
		let offsetY = 100;
		for (let i in MoneyData) { // TODO
			this.budgetItems.push(new BudgetItem(100, offsetY, 600, 50, 24, "$200 – Something you can purchase"));
		}
		let img = new Image();
		img.src = './dist/images/BudgetButton.png';
		img.height = 23;
		this.showButton = new Button(400, 600, 147, 50, img);
		img = new Image();
		img.height = 23;
		img.src = './dist/images/BudgetUpdateButton.png';
		this.hideButton = new Button(400, 600, 260, 56, img);
	}
	getSelectedIDs() {
		let ret = [];
		for (let i in this.budgetItems) {
			if (this.budgetItems[i].checked) ret.push(i);
		}
		return ret;
	}
	render() {
		if (this.expanded) {
			this.game.ctx.fillStyle = "#141922";
			this.game.ctx.fillRect(0, 0, 1440, 800);
			this.renderTitle(this.game.ctx);
			this.renderTotals(this.game.ctx);
			for (let i in this.budgetItems) {
				this.budgetItems[i].render(this.game.ctx);
			}
			this.hideButton.render(this.game.ctx);
		} else {
			this.showButton.render(this.game.ctx);
		}
	}
	click(x, y) {
		if (this.expanded) { // clicked somewhere on menu
			for (let i in this.budgetItems) {
				this.budgetItems[i].click(x, y);
			}
			if (this.hideButton.isClick(x, y)) {
				this.hideButton.visible = false;
				this.showButton.visible = true;
				this.expanded = false;
			}
			return true;
		} else if (this.showButton.isClick(x, y)) { // clicked button
			this.showButton.visible = false;
			this.hideButton.visible = true;
			this.expanded = true;
			return true;
		} else {
			return false;
		}
	}
	// private
	renderTitle(ctx) {
		ctx.fillStyle = "rgb(250, 250, 250)";
		ctx.font = "40px Arial";
		ctx.fillText("BUDGET", 650, 60);
	}
	renderTotals(ctx) {
		let budge = 1000; // temp
		for (let i in this.budgetItems) {
			if (this.budgetItems[i].checked) budge -= 200;
		}
		ctx.fillStyle = "rgb(200, 250, 200)";
		ctx.font = "30px Arial";
		ctx.fillText("$"+budge, 50, 50);
	}
}
class Button {
	constructor(x, y, w, h, img, visible=true) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.img = img;
		this.pad = 5; // buffer that still counts as click
		this.backColor = "rgb(50, 50, 50)"; // debug
		this.visible = visible;
	}
	isClick(x, y) {
		return (this.visible && x > this.x-this.pad && x < this.x+this.w+this.pad && y > this.y-this.pad && y < this.y+this.h+this.pad);
	}
	render(ctx) {
		if (!this.visible) return;
		ctx.fillStyle = this.backColor;
		ctx.fillRect(this.x-this.pad, this.y-this.pad, this.w+(this.pad*2), this.h+(this.pad*2)); // background
		ctx.drawImage(this.img, this.x, this.y);
	}
}
class BudgetItem {
	constructor(x, y, w, h, pt, text) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.pt = pt;
		this.text = text;

		this.imgChecked = new Image();
		this.imgChecked.src = './dist/images/CheckButton_Selected.png';
		this.imgUnchecked = new Image();
		this.imgUnchecked.src = './dist/images/CheckButton_Static.png';

		this.textColor = "rgb(250, 250, 250)";
		this.font = pt+"px Arial";
		this.pad = 5;
		this.checked = false;
		this.backColor = "rgb(50, 50, 50)"; // debug
	}
	click(x, y) {
		if (x > this.x-this.pad && x < this.x+this.w+this.pad && y > this.y-this.pad && y < this.y+this.h+this.pad) {
			this.checked = !this.checked;
		}
	}
	render(ctx) {
		ctx.fillStyle = this.backColor;
		ctx.fillRect(this.x-this.pad, this.y-this.pad, this.w+(this.pad*2), this.h+(this.pad*2)); // background
		let img = (this.checked) ? this.imgChecked : this.imgUnchecked;
		ctx.drawImage(img, this.x, this.y+(this.h-img.height)/2); // checkbox
		ctx.fillStyle = this.textColor;
		ctx.font = this.font;
		ctx.fillText(this.text, this.x+img.width+20, (this.y+this.h)-(this.h-this.pt)/2); // center text vertically
	}
}