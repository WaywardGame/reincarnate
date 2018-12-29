var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/IEntity", "entity/IStats", "Enums", "game/IGame", "mod/IHookHost", "mod/Mod", "mod/ModRegistry", "player/MessageManager", "tile/Terrains", "utilities/enum/Enums", "utilities/math/Math2", "utilities/Random", "utilities/TileHelpers"], function (require, exports, IEntity_1, IStats_1, Enums_1, IGame_1, IHookHost_1, Mod_1, ModRegistry_1, MessageManager_1, Terrains_1, Enums_2, Math2_1, Random_1, TileHelpers_1) {
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
            game.updateView(IGame_1.RenderSource.Mod, true);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVpbmNhcm5hdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9SZWluY2FybmF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFnQkEsTUFBcUIsV0FBWSxTQUFRLGFBQUc7UUFNcEMsYUFBYSxDQUFDLE1BQWU7WUFFbkMsV0FBVyxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUdyRixNQUFNLE1BQU0sR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLGlCQUFTLENBQUMsQ0FBQztZQUN2QyxLQUFLLE1BQU0sU0FBUyxJQUFJLE1BQU0sRUFBRTtnQkFDL0IsSUFBSSxRQUFRLEdBQUcsZUFBSyxDQUFDLFdBQVcsQ0FBQyxnQkFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbEcsSUFBSSxRQUFRLEdBQUcsR0FBRyxFQUFFO29CQUNuQixRQUFRLEdBQUcsR0FBRyxDQUFDO2lCQUVmO3FCQUFNLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRTtvQkFDeEIsUUFBUSxHQUFHLENBQUMsQ0FBQztpQkFDYjtnQkFFRCxXQUFXLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUM5QztZQUdELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzNDLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzNDLE1B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