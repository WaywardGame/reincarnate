var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "audio/IAudio", "event/EventBuses", "event/EventManager", "game/entity/IEntity", "game/entity/IHuman", "game/entity/IStats", "game/entity/player/IMessageManager", "game/tile/Terrains", "game/WorldZ", "mod/Mod", "mod/ModRegistry", "renderer/IRenderer", "utilities/enum/Enums", "utilities/game/TileHelpers", "utilities/math/Math2"], function (require, exports, IAudio_1, EventBuses_1, EventManager_1, IEntity_1, IHuman_1, IStats_1, IMessageManager_1, Terrains_1, WorldZ_1, Mod_1, ModRegistry_1, IRenderer_1, Enums_1, TileHelpers_1, Math2_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Reincarnate extends Mod_1.default {
        onPlayerDeath(player) {
            player.island.items.placeItemsAroundLocation(player.inventory, player.x, player.y, player.z);
            const skills = Enums_1.default.values(IHuman_1.SkillType);
            for (const skillType of skills) {
                if (player.skill.getCore(skillType) > 0) {
                    let newSkill = Math2_1.default.roundNumber(player.island.seededRandom.float() * 9 - 5 + player.skill.getCore(skillType), 1);
                    if (newSkill > 100) {
                        newSkill = 100;
                    }
                    else if (newSkill < 0) {
                        newSkill = 0;
                    }
                    player.skill.setCore(skillType, newSkill);
                }
            }
            const health = player.stat.get(IStats_1.Stat.Health);
            const strength = player.stat.get(IStats_1.Stat.Strength);
            const stamina = player.stat.get(IStats_1.Stat.Stamina);
            const hunger = player.stat.get(IStats_1.Stat.Hunger);
            const thirst = player.stat.get(IStats_1.Stat.Thirst);
            player.stat.setMax(IStats_1.Stat.Stamina, Math.max(70, stamina.max + Math.floor(player.island.seededRandom.float() * 4 - 2)));
            player.stat.setMax(IStats_1.Stat.Hunger, Math.max(15, hunger.max + Math.floor(player.island.seededRandom.float() * 4 - 2)));
            player.stat.setMax(IStats_1.Stat.Thirst, Math.max(15, thirst.max + Math.floor(player.island.seededRandom.float() * 4 - 2)));
            player.stat.setValue(IStats_1.Stat.Strength, Math.max(45, strength.base.value + Math.floor(player.island.seededRandom.float() * 4 - 2)));
            health.changeTimer = health.nextChangeTimer;
            stamina.changeTimer = stamina.nextChangeTimer;
            hunger.changeTimer = hunger.nextChangeTimer;
            thirst.changeTimer = thirst.nextChangeTimer;
            const randomHealthLostAtStart = player.island.seededRandom.int(5);
            player.stat.setValue(IStats_1.Stat.Health, player.getMaxHealth() - randomHealthLostAtStart);
            player.stat.setValue(IStats_1.Stat.Stamina, stamina.max - player.island.seededRandom.int(10));
            player.stat.setValue(IStats_1.Stat.Hunger, hunger.max - player.island.seededRandom.int(2));
            player.stat.setValue(IStats_1.Stat.Thirst, thirst.max - player.island.seededRandom.int(2));
            player.setStatus(IEntity_1.StatusType.Bleeding, false, IEntity_1.StatusEffectChangeReason.Passed);
            player.setStatus(IEntity_1.StatusType.Burned, false, IEntity_1.StatusEffectChangeReason.Passed);
            player.setStatus(IEntity_1.StatusType.Poisoned, false, IEntity_1.StatusEffectChangeReason.Passed);
            player.isMoving = false;
            player.isMovingClientside = false;
            player.movementCompleteZ = undefined;
            player.restData = undefined;
            player.swimming = false;
            player.stopNextMovement = false;
            player.customization = {
                hairStyle: IHuman_1.HairStyle[Enums_1.default.getRandom(IHuman_1.HairStyle, player.island.seededRandom)],
                hairColor: IHuman_1.HairColor[Enums_1.default.getRandom(IHuman_1.HairColor, player.island.seededRandom)],
                skinColor: IHuman_1.SkinColor[Enums_1.default.getRandom(IHuman_1.SkinColor, player.island.seededRandom)],
            };
            const newSpawnPoint = TileHelpers_1.default.getSuitableSpawnPoint(player.island);
            player.x = newSpawnPoint.x;
            player.y = newSpawnPoint.y;
            player.fromX = newSpawnPoint.x;
            player.fromY = newSpawnPoint.y;
            player.z = WorldZ_1.WorldZ.Overworld;
            player.messages.type(IMessageManager_1.MessageType.Stat)
                .send(this.reincarnateMessage);
            player.updateTablesAndWeight("M");
            player.updateStatsAndAttributes();
            player.tick();
            player.addDelay(IHuman_1.Delay.LongPause);
            const spawnedTile = player.island.getTile(player.x, player.y, player.z);
            const tileType = TileHelpers_1.default.getType(spawnedTile);
            if (Terrains_1.default[tileType]?.water) {
                player.swimming = true;
            }
            game.updateView(IRenderer_1.RenderSource.Mod, true);
            player.queueSoundEffect(IAudio_1.SfxType.Death, undefined, undefined, true);
            return false;
        }
    }
    __decorate([
        ModRegistry_1.default.message("Reincarnate")
    ], Reincarnate.prototype, "reincarnateMessage", void 0);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Players, "shouldDie")
    ], Reincarnate.prototype, "onPlayerDeath", null);
    exports.default = Reincarnate;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVpbmNhcm5hdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUmVpbmNhcm5hdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBa0JBLE1BQXFCLFdBQVksU0FBUSxhQUFHO1FBTXBDLGFBQWEsQ0FBQyxNQUFjO1lBRWxDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUc3RixNQUFNLE1BQU0sR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLGtCQUFTLENBQUMsQ0FBQztZQUN2QyxLQUFLLE1BQU0sU0FBUyxJQUFJLE1BQU0sRUFBRTtnQkFDL0IsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ3hDLElBQUksUUFBUSxHQUFHLGVBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDbEgsSUFBSSxRQUFRLEdBQUcsR0FBRyxFQUFFO3dCQUNuQixRQUFRLEdBQUcsR0FBRyxDQUFDO3FCQUVmO3lCQUFNLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRTt3QkFDeEIsUUFBUSxHQUFHLENBQUMsQ0FBQztxQkFDYjtvQkFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7aUJBQzFDO2FBQ0Q7WUFHRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBVyxhQUFJLENBQUMsTUFBTSxDQUFF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