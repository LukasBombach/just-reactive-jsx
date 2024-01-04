import { z } from "zod";
import { startDevServer } from "../server/development";

const CliSchema = z.object({
  command: z.enum(["dev"]),
});

function parseArgs(args: string[]) {
  try {
    const parsedArgs = CliSchema.parse({ command: args[2] });
    return parsedArgs;
  } catch (error) {
    console.error("Invalid arguments:", error);
    process.exit(1);
  }
}

const args = parseArgs(Bun.argv);

if (args.command === "dev") {
  startDevServer();
} else {
  console.log("Command not recognized.");
}
