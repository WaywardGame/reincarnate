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
            var _a;
            player.island.items.placeItemsAroundLocation(player.inventory, player.x, player.y, player.z);
            const skills = Enums_1.default.values(IHuman_1.SkillType);
            for (const skillType of skills) {
                let newSkill = Math2_1.default.roundNumber(player.island.seededRandom.float() * 9 - 5 + player.skill.getCore(skillType), 1);
                if (newSkill > 100) {
                    newSkill = 100;
                }
                else if (newSkill < 0) {
                    newSkill = 0;
                }
                player.skill.setCore(skillType, newSkill);
            }
            const health = player.stat.get(IStats_1.Stat.Health);
            const stamina = player.stat.get(IStats_1.Stat.Stamina);
            const hunger = player.stat.get(IStats_1.Stat.Hunger);
            const thirst = player.stat.get(IStats_1.Stat.Thirst);
            player.stat.setMax(IStats_1.Stat.Health, health.max + Math.floor(player.island.seededRandom.float() * 4 - 2));
            player.stat.setMax(IStats_1.Stat.Stamina, stamina.max + Math.floor(player.island.seededRandom.float() * 4 - 2));
            player.stat.setMax(IStats_1.Stat.Hunger, hunger.max + Math.floor(player.island.seededRandom.float() * 4 - 2));
            player.stat.setMax(IStats_1.Stat.Thirst, thirst.max + Math.floor(player.island.seededRandom.float() * 4 - 2));
            health.changeTimer = health.nextChangeTimer;
            stamina.changeTimer = stamina.nextChangeTimer;
            hunger.changeTimer = hunger.nextChangeTimer;
            thirst.changeTimer = thirst.nextChangeTimer;
            player.stat.set(health, health.max);
            player.stat.set(stamina, stamina.max);
            player.stat.set(hunger, hunger.max);
            player.stat.set(thirst, thirst.max);
            player.setStatus(IEntity_1.StatusType.Bleeding, false, IEntity_1.StatusEffectChangeReason.Passed);
            player.setStatus(IEntity_1.StatusType.Burned, false, IEntity_1.StatusEffectChangeReason.Passed);
            player.setStatus(IEntity_1.StatusType.Poisoned, false, IEntity_1.StatusEffectChangeReason.Passed);
            player.isMoving = false;
            player.isMovingClientside = false;
            player.movementCompleteZ = undefined;
            player.movementProgress = 1;
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
            if ((_a = Terrains_1.default[tileType]) === null || _a === void 0 ? void 0 : _a.water) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVpbmNhcm5hdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUmVpbmNhcm5hdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBa0JBLE1BQXFCLFdBQVksU0FBUSxhQUFHO1FBTXBDLGFBQWEsQ0FBQyxNQUFjOztZQUVsQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFHN0YsTUFBTSxNQUFNLEdBQUcsZUFBSyxDQUFDLE1BQU0sQ0FBQyxrQkFBUyxDQUFDLENBQUM7WUFDdkMsS0FBSyxNQUFNLFNBQVMsSUFBSSxNQUFNLEVBQUU7Z0JBQy9CLElBQUksUUFBUSxHQUFHLGVBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbEgsSUFBSSxRQUFRLEdBQUcsR0FBRyxFQUFFO29CQUNuQixRQUFRLEdBQUcsR0FBRyxDQUFDO2lCQUVmO3FCQUFNLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRTtvQkFDeEIsUUFBUSxHQUFHLENBQUMsQ0FBQztpQkFDYjtnQkFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDMUM7WUFHRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBVyxhQUFJLENBQUMsTUFBTSxDQUFFLENBQUM7WUFDdkQsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQVcsYUFBSSxDQUFDLE9BQU8s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