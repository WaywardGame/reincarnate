define(["require", "exports", "Enums", "language/Messages", "mod/Mod", "tile/Terrains", "Utilities"], function (require, exports, Enums_1, Messages_1, Mod_1, Terrains_1, Utilities) {
    "use strict";
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
            player.stats.health.value = player.strength;
            player.stats.stamina.value = player.dexterity;
            player.stats.hunger.value = player.starvation;
            player.stats.thirst.value = player.dehydration;
            player.status.bleeding = false;
            player.status.burned = false;
            player.status.poisoned = false;
            player.raft = undefined;
            player.equipped = {};
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
                if (Terrains_1.default[Utilities.TileHelpers.getType(game.getTile(xTry, yTry, Enums_1.WorldZ.Overworld))].passable) {
                    player.x = xTry;
                    player.y = yTry;
                    player.nextX = xTry;
                    player.nextY = yTry;
                    break;
                }
            }
            player.z = Enums_1.WorldZ.Overworld;
            audio.queueEffect(Enums_1.SfxType.Death, player.x, player.y, player.z);
            ui.displayMessage(player, this.reincarnateMessage, Messages_1.MessageType.Stat);
            game.updateFieldOfViewNextTick();
            player.updateCraftTableAndWeight();
            player.calculateEquipmentStats();
            player.calculateStats();
            player.tick();
            player.addDelay(Enums_1.Delay.LongPause);
            game.updateFieldOfViewNextTick();
            game.updateGame();
            return false;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Reincarnate;
});
//# sourceMappingURL=Reincarnate.js.map