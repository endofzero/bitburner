import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { getServerOnNetwork } from "../../Server/ServerHelpers";
import { GetServer } from "../../Server/AllServers";
import { Server } from "../../Server/Server";
import { Programs } from "src/Programs/Programs";
import { programsMetadata } from "src/Programs/data/ProgramsMetadata";

export function connect(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  // Disconnect from current server in terminal and connect to new one
  if (args.length !== 1) {
    terminal.error("Incorrect usage of connect command. Usage: connect [hostname]");
    return;
  }

  const hostname = args[0] + "";

  for (let i = 0; i < server.serversOnNetwork.length; i++) {
    const other = getServerOnNetwork(server, i);
    if (other === null) throw new Error(`Server on network should not be null`);
    if (other.hostname == hostname) {
      terminal.connectToServer(player, hostname);
      return;
    }
  }

  const other = GetServer(hostname);
  if (other !== null) {
    if (other instanceof Server && other.backdoorInstalled) {
      terminal.connectToServer(player, hostname);
      return;
    }
    terminal.error(`Cannot directly connect to ${hostname}`);
  } else {
    terminal.error("Host not found");
  }
}
