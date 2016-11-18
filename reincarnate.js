define(["require", "exports"], function (require, exports) {
    "use strict";
    class Mod extends Mods.Mod {
        onInitialize(saveDataGlobal) {
        }
        onLoad(saveData) {
            this.reincarnateMessage = this.addMessage("Reincarnate", "You have been reincarnated! Can you track down the location of your previous demise?");
        }
        onUnload() {
        }
        onSave() {
        }
        onPlayerDamage(amount, damageMessage) {
            if (player.health + amount <= 0) {
                const playerInventory = player.inventory.containedItems;
                for (let i = playerInventory.length - 1; i >= 0; i--) {
                    playerInventory[i].placeOnTile(player.x + Utilities.Random.randomFromInterval(-1, 1), player.y + Utilities.Random.randomFromInterval(-1, 1), player.z, true);
                }
                player.health = player.strength;
                player.stamina = player.dexterity;
                player.hunger = player.starvation;
                player.thirst = player.dehydration;
                player.status.bleeding = false;
                player.status.burned = false;
                player.status.poisoned = false;
                player.weight = 0;
                game.raft = null;
                audio.queueEffect(SfxType.Death);
                ui.displayMessage(this.reincarnateMessage, MessageType.Stat);
                player.gender = Math.floor(Math.random() * 2);
                let xTry;
                let yTry;
                while (true) {
                    xTry = Math.floor(Utilities.Random.nextFloat() * 400 + 50);
                    yTry = Math.floor(Utilities.Random.nextFloat() * 400 + 50);
                    if (Terrain.defines[Utilities.TileHelpers.getType(game.getTile(xTry, yTry, Z_NORMAL))].passable) {
                        player.x = xTry;
                        player.y = yTry;
                        player.nextX = xTry;
                        player.nextY = yTry;
                        break;
                    }
                }
                player.z = Z_NORMAL;
                game.updateCraftTableAndWeight();
                game.updateGame();
                return false;
            }
            return true;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Mod;
});
//# sourceMappingURL=reincarnate.js.map