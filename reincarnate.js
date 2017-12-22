define(["require", "exports", "Enums", "language/Messages", "mod/Mod", "tile/Terrains", "Utilities"], function (require, exports, Enums_1, Messages_1, Mod_1, Terrains_1, Utilities) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Reincarnate extends Mod_1.default {
        onLoad(saveData) {
            this.reincarnateMessage = this.addMessage("Reincarnate", "You have been reincarnated! Can you track down the location of your previous demise?");
        }
        onPlayerDeath(player) {
            itemManager.placeItemsAroundLocation(player.inventory, player.x, player.y, player.z);
            const skills = Utilities.Enums.getValues(Enums_1.SkillType);
            for (const skillType of skills) {
                const skill = localPlayer.skills[skillType];
                let newSkill = Utilities.Math2.roundNumber(Utilities.Random.nextFloat() * 9 - 5 + skill.core, 1);
                if (newSkill > 100) {
                    newSkill = 100;
                }
                else if (newSkill < 0) {
                    newSkill = 0;
                }
                skill.percent = skill.core = newSkill;
            }
            player.strength = Math.floor(Utilities.Random.nextFloat() * 4 - 2) + player.strength;
            player.dexterity = Math.floor(Utilities.Random.nextFloat() * 4 - 2) + player.dexterity;
            player.starvation = Math.floor(Utilities.Random.nextFloat() * 4 - 2) + player.starvation;
            player.dehydration = Math.floor(Utilities.Random.nextFloat() * 4 - 2) + player.dehydration;
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
            player.customization = {
                hairStyle: Enums_1.HairStyle[Utilities.Enums.getRandomIndex(Enums_1.HairStyle)],
                hairColor: Enums_1.HairColor[Utilities.Enums.getRandomIndex(Enums_1.HairColor)],
                skinColor: Enums_1.SkinColor[Utilities.Enums.getRandomIndex(Enums_1.SkinColor)]
            };
            let xTry;
            let yTry;
            while (true) {
                xTry = Math.floor(Utilities.Random.nextFloat() * 400 + 50);
                yTry = Math.floor(Utilities.Random.nextFloat() * 400 + 50);
                if (Utilities.TileHelpers.isOpenTile({ x: xTry, y: yTry, z: Enums_1.WorldZ.Overworld }, game.getTile(xTry, yTry, Enums_1.WorldZ.Overworld))) {
                    player.x = xTry;
                    player.y = yTry;
                    player.fromX = xTry;
                    player.fromY = yTry;
                    break;
                }
            }
            player.z = Enums_1.WorldZ.Overworld;
            ui.displayMessage(player, this.reincarnateMessage, Messages_1.MessageType.Stat);
            player.updateCraftTableAndWeight();
            player.updateStatsAndAttributes();
            player.tick();
            player.addDelay(Enums_1.Delay.LongPause);
            const spawnedTile = game.getTile(player.x, player.y, player.z);
            const tileType = Utilities.TileHelpers.getType(spawnedTile);
            if (Terrains_1.default[tileType].water) {
                player.swimming = true;
            }
            game.updateView(true);
            player.queueSoundEffect(Enums_1.SfxType.Death, undefined, undefined, true);
            return false;
        }
    }
    exports.default = Reincarnate;
});
//# sourceMappingURL=Reincarnate.js.map