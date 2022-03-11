import { SfxType } from "audio/IAudio";
import { EventBus } from "event/EventBuses";
import { EventHandler } from "event/EventManager";
import { StatusEffectChangeReason, StatusType } from "game/entity/IEntity";
import { Delay, HairColor, HairStyle, SkillType, SkinColor } from "game/entity/IHuman";
import { IStatMax, Stat } from "game/entity/IStats";
import { MessageType } from "game/entity/player/IMessageManager";
import Player from "game/entity/player/Player";
import Terrains from "game/tile/Terrains";
import { WorldZ } from "game/WorldZ";
import Message from "language/dictionary/Message";
import Mod from "mod/Mod";
import Register from "mod/ModRegistry";
import { RenderSource } from "renderer/IRenderer";
import Enums from "utilities/enum/Enums";
import TileHelpers from "utilities/game/TileHelpers";
import Math2 from "utilities/math/Math2";

export default class Reincarnate extends Mod {

	@Register.message("Reincarnate")
	public readonly reincarnateMessage: Message;

	@EventHandler(EventBus.Players, "shouldDie")
	public onPlayerDeath(player: Player): false | void {
		// Drop items
		player.island.items.placeItemsAroundLocation(player.inventory, player.x, player.y, player.z);

		// Randomize skills a bit
		const skills = Enums.values(SkillType);
		for (const skillType of skills) {
			let newSkill = Math2.roundNumber(player.island.seededRandom.float() * 9 - 5 + player.skill.getCore(skillType), 1);
			if (newSkill > 100) {
				newSkill = 100;

			} else if (newSkill < 0) {
				newSkill = 0;
			}

			player.skill.setCore(skillType, newSkill);
		}

		// Randomize stats a bit
		const health = player.stat.get<IStatMax>(Stat.Health)!;
		const stamina = player.stat.get<IStatMax>(Stat.Stamina)!;
		const hunger = player.stat.get<IStatMax>(Stat.Hunger)!;
		const thirst = player.stat.get<IStatMax>(Stat.Thirst)!;

		player.stat.setMax(Stat.Health, health.max + Math.floor(player.island.seededRandom.float() * 4 - 2));
		player.stat.setMax(Stat.Stamina, stamina.max + Math.floor(player.island.seededRandom.float() * 4 - 2));
		player.stat.setMax(Stat.Hunger, hunger.max + Math.floor(player.island.seededRandom.float() * 4 - 2));
		player.stat.setMax(Stat.Thirst, thirst.max + Math.floor(player.island.seededRandom.float() * 4 - 2));

		// Reset stats
		health.changeTimer = health.nextChangeTimer;
		stamina.changeTimer = stamina.nextChangeTimer;
		hunger.changeTimer = hunger.nextChangeTimer;
		thirst.changeTimer = thirst.nextChangeTimer;

		player.stat.set(health, health.max);
		player.stat.set(stamina, stamina.max);
		player.stat.set(hunger, hunger.max);
		player.stat.set(thirst, thirst.max);

		player.setStatus(StatusType.Bleeding, false, StatusEffectChangeReason.Passed);
		player.setStatus(StatusType.Burned, false, StatusEffectChangeReason.Passed);
		player.setStatus(StatusType.Poisoned, false, StatusEffectChangeReason.Passed);

		player.isMoving = false;
		player.isMovingClientside = false;
		player.movementCompleteZ = undefined;
		player.movementProgress = 1;
		player.restData = undefined;
		player.swimming = false;
		player.stopNextMovement = false;

		// Random character
		player.customization = {
			hairStyle: HairStyle[Enums.getRandom(HairStyle, player.island.seededRandom)] as keyof typeof HairStyle,
			hairColor: HairColor[Enums.getRandom(HairColor, player.island.seededRandom)] as keyof typeof HairColor,
			skinColor: SkinColor[Enums.getRandom(SkinColor, player.island.seededRandom)] as keyof typeof SkinColor,
		};

		// Random spawn
		const newSpawnPoint = TileHelpers.getSuitableSpawnPoint(player.island);
		player.x = newSpawnPoint.x;
		player.y = newSpawnPoint.y;
		player.fromX = newSpawnPoint.x;
		player.fromY = newSpawnPoint.y;
		player.z = WorldZ.Overworld; // Always make the player go to overworld

		// Effects and messages
		player.messages.type(MessageType.Stat)
			.send(this.reincarnateMessage);

		player.updateTablesAndWeight("M");
		player.updateStatsAndAttributes();

		player.tick();

		player.addDelay(Delay.LongPause);

		// Start swimming if spawning in water
		const spawnedTile = player.island.getTile(player.x, player.y, player.z);
		const tileType = TileHelpers.getType(spawnedTile);
		if (Terrains[tileType]?.water) {
			player.swimming = true;
		}

		game.updateView(RenderSource.Mod, true);

		player.queueSoundEffect(SfxType.Death, undefined, undefined, true);

		return false;
	}
}