var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/IEntity", "entity/IStats", "Enums", "mod/IHookHost", "mod/Mod", "mod/ModRegistry", "player/MessageManager", "tile/Terrains", "utilities/enum/Enums", "utilities/math/Math2", "utilities/Random", "utilities/TileHelpers"], function (require, exports, IEntity_1, IStats_1, Enums_1, IHookHost_1, Mod_1, ModRegistry_1, MessageManager_1, Terrains_1, Enums_2, Math2_1, Random_1, TileHelpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Reincarnate extends Mod_1.default {
        onPlayerDeath(player) {
            itemManager.placeItemsAroundLocation(player.inventory, player.x, player.y, player.z);
            const skills = Enums_2.default.values(Enums_1.SkillType);
            for (const skillType of skills) {
                let newSkill = Math2_1.default.roundNumber(Random_1.default.float() * 9 - 5 + localPlayer.getSkillCore(skillType), 1);
                if (newSkill > 100) {
                    newSkill = 100;
                }
                else if (newSkill < 0) {
                    newSkill = 0;
                }
                localPlayer.setSkillCore(skillType, newSkill);
            }
            const health = player.getStat(IStats_1.Stat.Health);
            const stamina = player.getStat(IStats_1.Stat.Stamina);
            const hunger = player.getStat(IStats_1.Stat.Hunger);
            const thirst = player.getStat(IStats_1.Stat.Thirst);
            player.setStatMax(IStats_1.Stat.Health, health.max + Math.floor(Random_1.default.float() * 4 - 2));
            player.setStatMax(IStats_1.Stat.Stamina, stamina.max + Math.floor(Random_1.default.float() * 4 - 2));
            player.setStatMax(IStats_1.Stat.Hunger, hunger.max + Math.floor(Random_1.default.float() * 4 - 2));
            player.setStatMax(IStats_1.Stat.Thirst, thirst.max + Math.floor(Random_1.default.float() * 4 - 2));
            health.changeTimer = health.nextChangeTimer;
            stamina.changeTimer = stamina.nextChangeTimer;
            hunger.changeTimer = hunger.nextChangeTimer;
            thirst.changeTimer = thirst.nextChangeTimer;
            player.setStat(health, health.max);
            player.setStat(stamina, stamina.max);
            player.setStat(hunger, hunger.max);
            player.setStat(thirst, thirst.max);
            player.setStatus(Enums_1.StatusType.Bleeding, false, IEntity_1.StatusEffectChangeReason.Passed);
            player.setStatus(Enums_1.StatusType.Burned, false, IEntity_1.StatusEffectChangeReason.Passed);
            player.setStatus(Enums_1.StatusType.Poisoned, false, IEntity_1.StatusEffectChangeReason.Passed);
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
            player.customization = {
                hairStyle: Enums_1.HairStyle[Enums_2.default.getRandom(Enums_1.HairStyle)],
                hairColor: Enums_1.HairColor[Enums_2.default.getRandom(Enums_1.HairColor)],
                skinColor: Enums_1.SkinColor[Enums_2.default.getRandom(Enums_1.SkinColor)]
            };
            let xTry;
            let yTry;
            while (true) {
                xTry = Math.floor(Random_1.default.float() * 400 + 50);
                yTry = Math.floor(Random_1.default.float() * 400 + 50);
                if (TileHelpers_1.default.isOpenTile({ x: xTry, y: yTry, z: Enums_1.WorldZ.Overworld }, game.getTile(xTry, yTry, Enums_1.WorldZ.Overworld))) {
                    player.x = xTry;
                    player.y = yTry;
                    player.fromX = xTry;
                    player.fromY = yTry;
                    break;
                }
            }
            player.z = Enums_1.WorldZ.Overworld;
            player.messages.type(MessageManager_1.MessageType.Stat)
                .send(this.reincarnateMessage);
            player.updateTablesAndWeight();
            player.updateStatsAndAttributes();
            player.tick();
            player.addDelay(Enums_1.Delay.LongPause);
            const spawnedTile = game.getTile(player.x, player.y, player.z);
            const tileType = TileHelpers_1.default.getType(spawnedTile);
            if (Terrains_1.default[tileType].water) {
                player.swimming = true;
            }
            game.updateView(true);
            player.queueSoundEffect(Enums_1.SfxType.Death, undefined, undefined, true);
            return false;
        }
    }
    __decorate([
        ModRegistry_1.default.message("Reincarnate")
    ], Reincarnate.prototype, "reincarnateMessage", void 0);
    __decorate([
        IHookHost_1.HookMethod
    ], Reincarnate.prototype, "onPlayerDeath", null);
    exports.default = Reincarnate;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVpbmNhcm5hdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJSZWluY2FybmF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFlQSxNQUFxQixXQUFZLFNBQVEsYUFBRztRQU1wQyxhQUFhLENBQUMsTUFBZTtZQUVuQyxXQUFXLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBR3JGLE1BQU0sTUFBTSxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUMsaUJBQVMsQ0FBQyxDQUFDO1lBQ3ZDLEtBQUssTUFBTSxTQUFTLElBQUksTUFBTSxFQUFFO2dCQUMvQixJQUFJLFFBQVEsR0FBRyxlQUFLLENBQUMsV0FBVyxDQUFDLGdCQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNsRyxJQUFJLFFBQVEsR0FBRyxHQUFHLEVBQUU7b0JBQ25CLFFBQVEsR0FBRyxHQUFHLENBQUM7aUJBRWY7cUJBQU0sSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFO29CQUN4QixRQUFRLEdBQUcsQ0FBQyxDQUFDO2lCQUNiO2dCQUVELFdBQVcsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQzlDO1lBR0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDM0MsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0MsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDM0MsTUFBTSxN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