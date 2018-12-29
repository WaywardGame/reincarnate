import { StatusEffectChangeReason } from "entity/IEntity";
import { Stat } from "entity/IStats";
import { Delay, HairColor, HairStyle, SfxType, SkillType, SkinColor, StatusType, WorldZ } from "Enums";
import { RenderSource } from "game/IGame";
import Message from "language/dictionary/Message";
import { HookMethod } from "mod/IHookHost";
import Mod from "mod/Mod";
import Register from "mod/ModRegistry";
import { IPlayer } from "player/IPlayer";
import { MessageType } from "player/MessageManager";
import Terrains from "tile/Terrains";
import Enums from "utilities/enum/Enums";
import Math2 from "utilities/math/Math2";
import Random from "utilities/Random";
import TileHelpers from "utilities/TileHelpers";

export default class Reincarnate extends Mod {

	@Register.message("Reincarnate")
	public readonly reincarnateMessage: Message;

	@HookMethod
	public onPlayerDeath(player: IPlayer): boolean | undefined {
		// Drop items
		itemManager.placeItemsAroundLocation(player.inventory, player.x, player.y, player.z);

		// Randomize skills a bit
		const skills = Enums.values(SkillType);
		for (const skillType of skills) {
			let newSkill = Math2.roundNumber(Random.float() * 9 - 5 + localPlayer.getSkillCore(skillType), 1);
			if (newSkill > 100) {
				newSkill = 100;

			} else if (newSkill < 0) {
				newSkill = 0;
			}

			localPlayer.setSkillCore(skillType, newSkill);
		}

		// Randomize stats a bit
		const health = player.getStat(Stat.Health);
		const stamina = player.getStat(Stat.Stamina);
		const hunger = player.getStat(Stat.Hunger);
		const thirst = player.getStat(Stat.Thirst);

		player.setStatMax(Stat.Health, health.max + Math.floor(Random.float() * 4 - 2));
		player.setStatMax(Stat.Stamina, stamina.max + Math.floor(Random.float() * 4 - 2));
		player.setStatMax(Stat.Hunger, hunger.max + Math.floor(Random.float() * 4 - 2));
		player.setStatMax(Stat.Thirst, thirst.max + Math.floor(Random.float() * 4 - 2));

		// Reset stats
		health.changeTimer = health.nextChangeTimer;
		stamina.changeTimer = stamina.nextChangeTimer;
		hunger.changeTimer = hunger.nextChangeTimer;
		thirst.changeTimer = thirst.nextChangeTimer;

		player.setStat(health, health.max);
		player.setStat(stamina, stamina.max);
		player.setStat(hunger, hunger.max);
		player.setStat(thirst, thirst.max);

		player.setStatus(StatusType.Bleeding, false, StatusEffectChangeReason.Passed);
		player.setStatus(StatusType.Burned, false, StatusEffectChangeReason.Passed);
		player.setStatus(StatusType.Poisoned, false, StatusEffectChangeReason.Passed);

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
			hairStyle: HairStyle[Enums.getRandom(HairStyle)] as keyof typeof HairStyle,
			hairColor: HairColor[Enums.getRandom(HairColor)] as keyof typeof HairColor,
			skinColor: SkinColor[Enums.getRandom(SkinColor)] as keyof typeof SkinColor
		};

		// Random spawn
		let xTry: number;
		let yTry: number;
		while (true) {
			xTry = Math.floor(Random.float() * 400 + 50);
			yTry = Math.floor(Random.float() * 400 + 50);
			if (TileHelpers.isOpenTile({ x: xTry, y: yTry, z: WorldZ.Overworld }, game.getTile(xTry, yTry, WorldZ.Overworld))) {
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
		player.messages.type(MessageType.Stat)
			.send(this.reincarnateMessage);

		player.updateTablesAndWeight();
		player.updateStatsAndAttributes();

		player.tick();

		player.addDelay(Delay.LongPause);

		// Start swimming if spawning in water
		const spawnedTile = game.getTile(player.x, player.y, player.z);
		const tileType = TileHelpers.getType(spawnedTile);
		if (Terrains[tileType].water) {
			player.swimming = true;
		}

		game.updateView(RenderSource.Mod, true);

		player.queueSoundEffect(SfxType.Death, undefined, undefined, true);

		return false;
	}
}
