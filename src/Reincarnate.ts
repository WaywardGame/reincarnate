/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import { SfxType } from "@wayward/game/audio/IAudio";
import { EventBus } from "@wayward/game/event/EventBuses";
import { EventHandler } from "@wayward/game/event/EventManager";
import { StatusEffectChangeReason, StatusType } from "@wayward/game/game/entity/IEntity";
import { Delay, HairColor, HairStyle, SkillType, SkinColor } from "@wayward/game/game/entity/IHuman";
import { IStatMax, Stat } from "@wayward/game/game/entity/IStats";
import { MessageType } from "@wayward/game/game/entity/player/IMessageManager";
import Player from "@wayward/game/game/entity/player/Player";
import { WorldZ } from "@wayward/utilities/game/WorldZ";
import Message from "@wayward/game/language/dictionary/Message";
import Mod from "@wayward/game/mod/Mod";
import Register from "@wayward/game/mod/ModRegistry";
import { RenderSource } from "@wayward/game/renderer/IRenderer";
import Enums from "@wayward/game/utilities/enum/Enums";
import Math2 from "@wayward/utilities/math/Math2";

export default class Reincarnate extends Mod {

	@Register.message("Reincarnate")
	public readonly reincarnateMessage: Message;

	@EventHandler(EventBus.Players, "shouldDie")
	public onPlayerDeath(player: Player): false | void {
		// Drop items
		player.island.items.placeItemsAroundTile(player.inventory, player.tile);

		// Randomize skills a bit
		const skills = Enums.values(SkillType);
		for (const skillType of skills) {
			if (player.skill.getCore(skillType) > 0) {
				let newSkill = Math2.roundNumber(player.island.seededRandom.float() * 9 - 5 + player.skill.getCore(skillType), 1);
				if (newSkill > 100) {
					newSkill = 100;

				} else if (newSkill < 0) {
					newSkill = 0;
				}

				player.skill.setCore(skillType, newSkill);
			}
		}

		// Randomize stats a bit
		const health = player.stat.get<IStatMax>(Stat.Health)!;
		const strength = player.stat.get<IStatMax>(Stat.Strength)!;
		const stamina = player.stat.get<IStatMax>(Stat.Stamina)!;
		const hunger = player.stat.get<IStatMax>(Stat.Hunger)!;
		const thirst = player.stat.get<IStatMax>(Stat.Thirst)!;

		// Minimums gathered from Player.ts
		player.stat.setMax(Stat.Stamina, Math.max(70, stamina.max + Math.floor(player.island.seededRandom.float() * 4 - 2)));
		player.stat.setMax(Stat.Hunger, Math.max(15, hunger.max + Math.floor(player.island.seededRandom.float() * 4 - 2)));
		player.stat.setMax(Stat.Thirst, Math.max(15, thirst.max + Math.floor(player.island.seededRandom.float() * 4 - 2)));
		player.stat.setValue(Stat.Strength, Math.max(45, strength.base.value + Math.floor(player.island.seededRandom.float() * 4 - 2)));

		// Reset stats
		health.changeTimer = health.nextChangeTimer;
		stamina.changeTimer = stamina.nextChangeTimer;
		hunger.changeTimer = hunger.nextChangeTimer;
		thirst.changeTimer = thirst.nextChangeTimer;

		const randomHealthLostAtStart = player.island.seededRandom.int(5);
		player.stat.setValue(Stat.Health, player.getMaxHealth() - randomHealthLostAtStart);
		player.stat.setValue(Stat.Stamina, stamina.max - player.island.seededRandom.int(10));
		player.stat.setValue(Stat.Hunger, hunger.max - player.island.seededRandom.int(2));
		player.stat.setValue(Stat.Thirst, thirst.max - player.island.seededRandom.int(2));

		player.setStatus(StatusType.Bleeding, false, StatusEffectChangeReason.Passed);
		player.setStatus(StatusType.Burned, false, StatusEffectChangeReason.Passed);
		player.setStatus(StatusType.Poisoned, false, StatusEffectChangeReason.Passed);

		player.isMoving = false;
		delete player.movingData.state;
		delete player.movingData.time;
		delete player.movingData.options;
		player.movementCompleteZ = undefined;
		player.restData = undefined;
		delete player.shouldSkipNextMovement;

		// Random character
		player.customization = {
			hairStyle: HairStyle[Enums.getRandom(HairStyle, player.island.seededRandom)] as keyof typeof HairStyle,
			hairColor: HairColor[Enums.getRandom(HairColor, player.island.seededRandom)] as keyof typeof HairColor,
			skinColor: SkinColor[Enums.getRandom(SkinColor, player.island.seededRandom)] as keyof typeof SkinColor,
		};

		// Random spawn
		const newSpawnPoint = player.island.getSuitableSpawnPoint();
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

		player.updateSwimming();

		player.tick();

		player.addDelay(Delay.LongPause);

		player.updateView(RenderSource.Mod, true);

		if (player.isLocalPlayer) {
			audio?.playUiSoundEffect(SfxType.Death);

		} else {
			player.queueSoundEffect(SfxType.Death);
		}

		return false;
	}
}
