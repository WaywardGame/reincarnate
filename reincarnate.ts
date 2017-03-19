import { Delay, HairColor, Hairstyle, SfxType, SkinColor, WorldZ } from "Enums";
import { MessageType } from "language/Messages";
import Mod from "mod/Mod";
import { IPlayer } from "player/IPlayer";
import Terrains from "tile/Terrains";
import * as Utilities from "Utilities";

export default class Reincarnate extends Mod {
	private reincarnateMessage: number;

	public onInitialize(saveDataGlobal: any): any {
	}

	public onLoad(saveData: any): void {
		this.reincarnateMessage = this.addMessage("Reincarnate", "You have been reincarnated! Can you track down the location of your previous demise?");
	}

	public onUnload(): void {
	}

	public onSave(): any {
	}

	// Hooks
	public onPlayerDeath(player: IPlayer): boolean {
		// Drop items
		itemManager.placeItemsAroundLocation(player.inventory, player.x, player.y, player.z);

		// Reset stats
		player.stats.health.value = player.strength;
		player.stats.stamina.value = player.dexterity;
		player.stats.hunger.value = player.starvation;
		player.stats.thirst.value = player.dehydration;
		player.status.bleeding = false;
		player.status.burned = false;
		player.status.poisoned = false;
		player.raft = undefined;
		player.equipped = {};

		// Random character
		player.customization = {
			hairStyle: Utilities.Enums.getRandomIndex(Hairstyle),
			hairColor: Utilities.Enums.getRandomIndex(HairColor),
			skinColor: Utilities.Enums.getRandomIndex(SkinColor)
		};

		// Random spawn
		let xTry: number;
		let yTry: number;
		while (true) {
			xTry = Math.floor(Utilities.Random.nextFloat() * 400 + 50);
			yTry = Math.floor(Utilities.Random.nextFloat() * 400 + 50);
			if (Terrains[Utilities.TileHelpers.getType(game.getTile(xTry, yTry, WorldZ.Overworld))].passable) {
				player.x = xTry;
				player.y = yTry;
				player.nextX = xTry;
				player.nextY = yTry;
				break;
			}
		}

		// Always make the player go to overworld
		player.z = WorldZ.Overworld;

		// Effects and messages
		audio.queueEffect(SfxType.Death, player.x, player.y, player.z);
		ui.displayMessage(player, this.reincarnateMessage, MessageType.Stat);

		game.updateFieldOfViewNextTick();

		player.updateCraftTableAndWeight();
		player.calculateEquipmentStats();
		player.calculateStats();

		player.tick();

		player.addDelay(Delay.LongPause);

		game.updateFieldOfViewNextTick();
		game.updateGame();

		return false;
	}
}
