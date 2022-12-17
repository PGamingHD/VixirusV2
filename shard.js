  const {
    ShardingManager
  } = require("discord.js");
  require('dotenv').config();
  const shards = new ShardingManager("./index.js", {
    token: process.env.LOGIN_TOKEN,
    totalShards: "auto",
    shardList: "auto",
  });
  shards.on("shardCreate", shard => console.log(`[SHARDS] <==> [${String(new Date).split(" ", 5).join(" ")}] || <==> || Shard #${shard.id} has been LAUNCHED || <==> [SHARDS]`))
  shards.spawn({
    amount: shards.totalShards,
    delay: 5500,
    timeout: 30000
  });

  /*

  Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
  Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
  Other than that, please do note that it is required if you are using this to mention the original developer
  Original Developer - PGamingHD#0666
  
  */