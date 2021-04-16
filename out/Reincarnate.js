var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "audio/IAudio", "event/EventBuses", "event/EventManager", "game/entity/IEntity", "game/entity/IHuman", "game/entity/IStats", "game/entity/player/IMessageManager", "game/IGame", "game/tile/Terrains", "game/WorldZ", "mod/Mod", "mod/ModRegistry", "utilities/enum/Enums", "utilities/game/TileHelpers", "utilities/math/Math2", "utilities/random/Random"], function (require, exports, IAudio_1, EventBuses_1, EventManager_1, IEntity_1, IHuman_1, IStats_1, IMessageManager_1, IGame_1, Terrains_1, WorldZ_1, Mod_1, ModRegistry_1, Enums_1, TileHelpers_1, Math2_1, Random_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Reincarnate extends Mod_1.default {
        onPlayerDeath(player) {
            itemManager.placeItemsAroundLocation(player.inventory, player.x, player.y, player.z);
            const skills = Enums_1.default.values(IHuman_1.SkillType);
            for (const skillType of skills) {
                let newSkill = Math2_1.default.roundNumber(Random_1.default.float() * 9 - 5 + player.skill.getCore(skillType), 1);
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
            player.stat.setMax(IStats_1.Stat.Health, health.max + Math.floor(Random_1.default.float() * 4 - 2));
            player.stat.setMax(IStats_1.Stat.Stamina, stamina.max + Math.floor(Random_1.default.float() * 4 - 2));
            player.stat.setMax(IStats_1.Stat.Hunger, hunger.max + Math.floor(Random_1.default.float() * 4 - 2));
            player.stat.setMax(IStats_1.Stat.Thirst, thirst.max + Math.floor(Random_1.default.float() * 4 - 2));
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
            player.equipped = {};
            player.isMoving = false;
            player.isMovingClientside = false;
            player.movementCompleteZ = undefined;
            player.movementProgress = 1;
            player.vehicleItemId = undefined;
            player.restData = undefined;
            player.swimming = false;
            player.stopNextMovement = false;
            player.customization = {
                hairStyle: IHuman_1.HairStyle[Enums_1.default.getRandom(IHuman_1.HairStyle)],
                hairColor: IHuman_1.HairColor[Enums_1.default.getRandom(IHuman_1.HairColor)],
                skinColor: IHuman_1.SkinColor[Enums_1.default.getRandom(IHuman_1.SkinColor)],
            };
            const newSpawnPoint = TileHelpers_1.default.getSuitableSpawnPoint();
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
            const spawnedTile = game.getTile(player.x, player.y, player.z);
            const tileType = TileHelpers_1.default.getType(spawnedTile);
            if (Terrains_1.default[tileType].water) {
                player.swimming = true;
            }
            game.updateView(IGame_1.RenderSource.Mod, true);
            player.queueSoundEffect(IAudio_1.SfxType.Death, undefined, undefined, true);
            return false;
        }
    }
    __decorate([
        ModRegistry_1.default.message("Reincarnate")
    ], Reincarnate.prototype, "reincarnateMessage", void 0);
    __decorate([
        EventManager_1.EventHandler(EventBuses_1.EventBus.Players, "shouldDie")
    ], Reincarnate.prototype, "onPlayerDeath", null);
    exports.default = Reincarnate;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVpbmNhcm5hdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9SZWluY2FybmF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFtQkEsTUFBcUIsV0FBWSxTQUFRLGFBQUc7UUFNcEMsYUFBYSxDQUFDLE1BQWM7WUFFbEMsV0FBVyxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUdyRixNQUFNLE1BQU0sR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLGtCQUFTLENBQUMsQ0FBQztZQUN2QyxLQUFLLE1BQU0sU0FBUyxJQUFJLE1BQU0sRUFBRTtnQkFDL0IsSUFBSSxRQUFRLEdBQUcsZUFBSyxDQUFDLFdBQVcsQ0FBQyxnQkFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzlGLElBQUksUUFBUSxHQUFHLEdBQUcsRUFBRTtvQkFDbkIsUUFBUSxHQUFHLEdBQUcsQ0FBQztpQkFFZjtxQkFBTSxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUU7b0JBQ3hCLFFBQVEsR0FBRyxDQUFDLENBQUM7aUJBQ2I7Z0JBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQzFDO1lBR0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVDLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM5QyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFB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