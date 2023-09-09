import {DataService} from "./data.service";
import {WebService} from "./web.service";

export class StatusService {
    public static async fromAddress(addr: string) {
        const status = await WebService.getServerStatus(addr)
        const sample = []

        if (status.data.players.online > 0) {
            for (let player of status.data.players.sample) {
                if (player.id !== '00000000-0000-0000-0000-000000000000') {
                    const uuid = player.id.replaceAll("-", "")
                    const data = await DataService.findByUuid(uuid)
                    sample.push(data)
                }
            }
        }

        status.data.players.sample = sample
        return status.data
    }
}