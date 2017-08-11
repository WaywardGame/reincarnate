define(["require", "exports", "Enums", "language/Messages", "mod/Mod", "Utilities"], function (require, exports, Enums_1, Messages_1, Mod_1, Utilities) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Reincarnate extends Mod_1.default {
        onInitialize(saveDataGlobal) {
        }
        onLoad(saveData) {
            this.reincarnateMessage = this.addMessage("Reincarnate", "You have been reincarnated! Can you track down the location of your previous demise?");
        }
        onUnload() {
        }
        onSave() {
        }
        onPlayerDeath(player) {
            itemManager.placeItemsAroundLocation(player.inventory, player.x, player.y, player.z);
            player.stats.health.timer = 0;
            player.stats.stamina.timer = 0;
            player.stats.hunger.timer = 0;
            player.stats.thirst.timer = 0;
            player.stats.health.value = player.strength;
            player.stats.stamina.value = player.dexterity;
            player.stats.hunger.value = player.starvation;
            player.stats.thirst.value = player.dehydration;
            player.status.bleeding = false;
            player.status.burned = false;
            player.status.poisoned = false;
            player.raft = undefined;
            player.equipped = {};
            player.movementCompleteZ = undefined;
            player.movementProgress = 1;
            player.restData = undefined;
            player.swimming = false;
            player.customization = {
                hairStyle: Utilities.Enums.getRandomIndex(Enums_1.Hairstyle),
                hairColor: Utilities.Enums.getRandomIndex(Enums_1.HairColor),
                skinColor: Utilities.Enums.getRandomIndex(Enums_1.SkinColor)
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
            player.createFlowFieldManager();
            player.tick();
            player.addDelay(Enums_1.Delay.LongPause);
            game.updateView(true);
            player.queueSoundEffect(Enums_1.SfxType.Death, undefined, undefined, true);
            return false;
        }
    }
    exports.default = Reincarnate;
});
//# sourceMappingURL=Reincarnate.js.map