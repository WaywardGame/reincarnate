import Player from "game/entity/player/Player";
import Message from "language/dictionary/Message";
import Mod from "mod/Mod";
export default class Reincarnate extends Mod {
    readonly reincarnateMessage: Message;
    onPlayerDeath(player: Player): false;
}
