/// <reference path="mod-reference/modreference.d.ts" />
export default class Mod extends Mods.Mod {
    private reincarnateMessage;
    onInitialize(saveDataGlobal: any): any;
    onLoad(saveData: any): void;
    onUnload(): void;
    onSave(): any;
    onPlayerDamage(amount: number, damageMessage: string): boolean;
}
