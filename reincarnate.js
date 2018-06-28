var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/IStats", "Enums", "language/IMessages", "mod/IHookHost", "mod/Mod", "tile/Terrains", "utilities/enum/Enums", "utilities/math/Math2", "utilities/Random", "utilities/TileHelpers"], function (require, exports, IStats_1, Enums_1, IMessages_1, IHookHost_1, Mod_1, Terrains_1, Enums_2, Math2_1, Random_1, TileHelpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Reincarnate extends Mod_1.default {
        onLoad(saveData) {
            this.reincarnateMessage = this.addMessage("Reincarnate", "You have been reincarnated! Can you track down the location of your previous demise?");
        }
        onPlayerDeath(player) {
            itemManager.placeItemsAroundLocation(player.inventory, player.x, player.y, player.z);
            const skills = Enums_2.default.values(Enums_1.SkillType);
            for (const skillType of skills) {
                const skill = localPlayer.skills[skillType];
                let newSkill = Math2_1.default.roundNumber(Random_1.default.float() * 9 - 5 + skill.core, 1);
                if (newSkill > 100) {
                    newSkill = 100;
                }
                else if (newSkill < 0) {
                    newSkill = 0;
                }
                skill.percent = skill.core = newSkill;
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
            player.setStatus(Enums_1.StatusType.Bleeding, false);
            player.setStatus(Enums_1.StatusType.Burned, false);
            player.setStatus(Enums_1.StatusType.Poisoned, false);
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
            player.messages.type(IMessages_1.MessageType.Stat)
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
        IHookHost_1.HookMethod
    ], Reincarnate.prototype, "onPlayerDeath", null);
    exports.default = Reincarnate;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVpbmNhcm5hdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJSZWluY2FybmF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFZQSxpQkFBaUMsU0FBUSxhQUFHO1FBR3BDLE1BQU0sQ0FBQyxRQUFhO1lBQzFCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxzRkFBc0YsQ0FBQyxDQUFDO1FBQ2xKLENBQUM7UUFHTSxhQUFhLENBQUMsTUFBZTtZQUVuQyxXQUFXLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBR3JGLE1BQU0sTUFBTSxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUMsaUJBQVMsQ0FBQyxDQUFDO1lBQ3ZDLEtBQUssTUFBTSxTQUFTLElBQUksTUFBTSxFQUFFO2dCQUMvQixNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLFFBQVEsR0FBRyxlQUFLLENBQUMsV0FBVyxDQUFDLGdCQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN6RSxJQUFJLFFBQVEsR0FBRyxHQUFHLEVBQUU7b0JBQ25CLFFBQVEsR0FBRyxHQUFHLENBQUM7aUJBRWY7cUJBQU0sSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFO29CQUN4QixRQUFRLEdBQUcsQ0FBQyxDQUFDO2lCQUNiO2dCQUVELEtBQUssQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7YUFDdEM7WUFHRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQUksQ0FBQyxNQUFNLENBQUMs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