/// <reference path="mod-reference/modreference.d.ts"/>

class Mod extends Mods.Mod {
    private reincarnateMessage: number;

    public onInitialize(saveDataGlobal: any): any {
    }

    public onLoad(saveData: any): void {
        this.reincarnateMessage = this.addMessage("Reincarnate", "You have been reincarnated! Can you track down the location of your previous demise?");
    }

    public onUnload(): void {
    }

    public onSave(): any {
    }

    // Hooks
    public onPlayerDamage(amount: number, damageMessage: string): boolean {

        // Player got REKT
        if (player.health + amount <= 0) {

            // Drop items
            for (let i = player.inventory.containedItems.length - 1; i >= 0; i--) {
                // Drop them in a 3x3 square randomly
                Item.placeOnTile(player.inventory.containedItems[i], player.x + Utilities.Random.randomFromInterval(-1, 1), player.y + Utilities.Random.randomFromInterval(-1, 1), player.z, true);
            }

            // Reset stats
            player.health = player.strength;
            player.stamina = player.dexterity;
            player.hunger = player.starvation;
            player.thirst = player.dehydration;
            player.status.bleeding = false;
            player.status.burned = false;
            player.status.poisoned = false;
            game.raft = null;

            // Effects and messages
            audio.queueEffect(SfxType.Death);
            ui.displayMessage(this.reincarnateMessage, MessageType.Stat);

            // Random gender
            player.gender = Math.floor(Math.random() * 2);

            // Random spawn
            let xTry: number;
            let yTry: number;
            while (true) {
                xTry = Math.floor(Utilities.Random.nextFloat() * 400 + 50);
                yTry = Math.floor(Utilities.Random.nextFloat() * 400 + 50);
                if (terrains[Utilities.TileHelpers.getType(game.getTile(xTry, yTry, Z_NORMAL))].passable) {
                    player.x = xTry;
                    player.y = yTry;
                    break;
                }
            }
            player.z = Z_NORMAL; // Always make the player go to overworld

            game.updateGame();
            return false;
        }
        return true;
    }
}
