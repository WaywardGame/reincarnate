import { Delay, HairColor, HairStyle, SfxType, SkillType, SkinColor, WorldZ } from "Enums";
import { MessageType } from "language/Messages";
import Mod from "mod/Mod";
import { IPlayer } from "player/IPlayer";
import Terrains from "tile/Terrains";
import * as Utilities from "Utilities";

export default class Reincarnate extends Mod {
	private reincarnateMessage: number;

	public onLoad(saveData: any): void {
		this.reincarnateMessage = this.addMessage("Reincarnate", "You have been reincarnated! Can you track down the location of your previous demise?");
	}

	// Hooks
	public onPlayerDeath(player: IPlayer): boolean {
		// Drop items
		itemManager.placeItemsAroundLocation(player.inventory, player.x, player.y, player.z);

		// Randomize skills a bit
		const skills: SkillType[] = Utilities.Enums.getValues(SkillType);
		for (const skillType of skills) {
			const skill = localPlayer.skills[skillType];
			let newSkill = Utilities.Math2.roundNumber(Utilities.Random.nextFloat() * 9 - 5 + skill.core, 1);
			if (newSkill > 100) {
				newSkill = 100;
			} else if (newSkill < 0) {
				newSkill = 0;
			}
			skill.percent = skill.core = newSkill;
		}

		// Randomize stats a bit
		player.strength = Math.floor(Utilities.Random.nextFloat() * 4 - 2) + player.strength;
		player.dexterity = Math.floor(Utilities.Random.nextFloat() * 4 - 2) + player.dexterity;
		player.starvation = Math.floor(Utilities.Random.nextFloat() * 4 - 2) + player.starvation;
		player.dehydration = Math.floor(Utilities.Random.nextFloat() * 4 - 2) + player.dehydration;

		// Reset stats
		player.stats.health.timer = 0;
		player.stats.health.value = player.strength;

		player.stats.stamina.timer = 0;
		player.stats.stamina.value = player.dexterity;

		player.stats.hunger.timer = 0;
		player.stats.hunger.value = player.starvation;

		player.stats.thirst.timer = 0;
		player.stats.thirst.value = player.dehydration;

		player.status.bleeding = false;
		player.status.burned = false;
		player.status.poisoned = false;

		player.equipped = {};
		player.isMoving = false;
		player.isMovingClientside = false;
		player.movementComplete = false;
		player.movementCompleteZ = undefined;
		player.movementProgress = 1;
		player.raft = undefined;
		player.restData = undefined;
		player.swimming = false;
		player.stopNextMovement = false;

		// Random character
		player.customization = {
			hairStyle: HairStyle[Utilities.Enums.getRandomIndex(HairStyle)] as keyof typeof HairStyle,
			hairColor: HairColor[Utilities.Enums.getRandomIndex(HairColor)] as keyof typeof HairColor,
			skinColor: SkinColor[Utilities.Enums.getRandomIndex(SkinColor)] as keyof typeof SkinColor
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

		player.tick();

		player.addDelay(Delay.LongPause);

		// Start swimming if spawning in water
		const spawnedTile = game.getTile(player.x, player.y, player.z);
		const tileType = Utilities.TileHelpers.getType(spawnedTile);
		if (Terrains[tileType].water) {
			player.swimming = true;
		}

		game.updateView(true);

		player.queueSoundEffect(SfxType.Death, undefined, undefined, true);

		return false;
	}
}
