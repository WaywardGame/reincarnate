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
		player.stats.health.timer = 0;
		player.stats.stamina.timer = 0;
		player.stats.hunger.timer = 0;
		player.stats.thirst.timer = 0;
		player.stats.health.value = player.strength;
		player.stats.stamina.value = player.dexterity;
		player.stats.hunger.value = player.starvation;
		player.stats.thirst.value = player.dehydration;
		player.status.bleeding = false;
		player.status.burned = false;
		player.status.poisoned = false;
		player.raft = undefined;
		player.equipped = {};
		player.movementCompleteZ = undefined;
		player.movementProgress = 1;
		player.restData = undefined;
		player.swimming = false;

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
			if (Utilities.TileHelpers.isOpenTile({ x: xTry, y: yTry, z: WorldZ.Overworld }, game.getTile(xTry, yTry, WorldZ.Overworld))) {
				player.x = xTry;
				player.y = yTry;
				player.fromX = xTry;
				player.fromY = yTry;
				break;
			}
		}

		// Always make the player go to overworld
		player.z = WorldZ.Overworld;

		// Effects and messages
		ui.displayMessage(player, this.reincarnateMessage, MessageType.Stat);

		player.updateCraftTableAndWeight();
		player.updateStatsAndAttributes();

		player.createFlowFieldManager();

		player.tick();

		player.addDelay(Delay.LongPause);

		game.updateView(true);

		player.queueSoundEffect(SfxType.Death, undefined, undefined, true);

		return false;
	}
}
