import Mod from "mod/Mod";
import { IPlayer } from "player/IPlayer";
export default class Reincarnate extends Mod {
    private reincarnateMessage;
    onInitialize(saveDataGlobal: any): any;
    onLoad(saveData: any): void;
    onUnload(): void;
    onSave(): any;
    onPlayerDeath(player: IPlayer): boolean;
}
