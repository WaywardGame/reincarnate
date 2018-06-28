import Mod from "mod/Mod";
import { IPlayer } from "player/IPlayer";
export default class Reincarnate extends Mod {
    private reincarnateMessage;
    onLoad(saveData: any): void;
    onPlayerDeath(player: IPlayer): boolean | undefined;
}
