try {
    require("dotenv").config();
}
catch {
    console.warn("Not using dotenv. Make sure environment variables are set");
}

const db = require("./models");
const { responseCooldown } = require("./config/discord.json");
const { Operators } = require("nessie");

async function main() {
    console.log("[db] Syncing tables with models");
    await db.sync({ force: process.env.DB_FORCE && process.env.DB_FORCE.trim().toLowerCase() !== "false" });
    console.log("[db] Pruning old cooldown data");
    await db.models.ResponseCooldown.destroy({
        where: {
            updatedAt: { [Operators.lt]: Date.now() - (responseCooldown * 2) }
        }
    });
    require("./discord");
}

main()
    .catch(console.error);
