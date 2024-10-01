import "./modules/Fly"
import "./modules/VehicleInfo";
import { EffectSystem } from "@shared/modules/EffectSystem";

mp.events.add(EffectSystem.Start, (effectName: string, duration: number, looped: boolean) => {
	mp.game.graphics.startScreenEffect(effectName, duration, looped);
})

mp.events.add(EffectSystem.Stop, () => {
	mp.game.graphics.stopAllScreenEffects()
})