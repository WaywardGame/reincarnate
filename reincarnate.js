var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Mod = (function (_super) {
    __extends(Mod, _super);
    function Mod() {
        _super.apply(this, arguments);
    }
    Mod.prototype.onInitialize = function (saveDataGlobal) {
    };
    Mod.prototype.onLoad = function (saveData) {
        this.reincarnateMessage = this.addMessage("Reincarnate", "You have been reincarnated! Can you track down the location of your previous demise?");
    };
    Mod.prototype.onUnload = function () {
    };
    Mod.prototype.onSave = function () {
    };
    Mod.prototype.onPlayerDamage = function (amount, damageMessage) {
        if (player.health + amount <= 0) {
            for (var i = player.inventory.containedItems.length - 1; i >= 0; i--) {
                Item.placeOnTile(player.inventory.containedItems[i], player.x + Utilities.Random.randomFromInterval(-1, 1), player.y + Utilities.Random.randomFromInterval(-1, 1), player.z, true);
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
            var xTry = void 0;
            var yTry = void 0;
            while (true) {
                xTry = Math.floor(Utilities.Random.nextFloat() * 400 + 50);
                yTry = Math.floor(Utilities.Random.nextFloat() * 400 + 50);
                if (terrains[Utilities.TileHelpers.getType(game.getTile(xTry, yTry, Z_NORMAL))].passable) {
                    player.x = xTry;
                    player.y = yTry;
                    break;
                }
            }
            player.z = Z_NORMAL;
            game.updateGame();
            return false;
        }
        return true;
    };
    return Mod;
}(Mods.Mod));
//# sourceMappingURL=reincarnate.js.map