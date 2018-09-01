import { Message } from "language/IMessages";
import Mod from "mod/Mod";
import { IPlayer } from "player/IPlayer";
export default class Reincarnate extends Mod {
    readonly reincarnateMessage: Message;
    onPlayerDeath(player: IPlayer): boolean | undefined;
}
