const cornelius = require('cornelius');
const readline = require('readline-promise').default;

const rlp = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});

console.log('Welcome to player search!');
console.log('Press ctrl-c at any point to exit');
console.log("\n");

promptSearch();

function promptSearch() {
  rlp.questionAsync("Search for a player: ").then(query => {
    cornelius.playerSearch({ query }).then(handlePlayerSearchResults);
  });
}

function handlePlayerSearchResults(players) {
  if (!players.length) {
    console.log('Sorry, no players match that search')
    console.log("\n");

    promptSearch();
    return;
  } else if (players.length > 1) {
    console.log("\n");
    console.log('That search returned a different players:')
    players.forEach((p, i) => {
      console.log(`${i + 1}) ${p.name.full}`)
    });
    console.log("\n");
    choosePlayer(players);
    // TODO: add logic for receiving console input
  } else {
    const [player] = players;
    getPlayerStats(player);
  }

}

function choosePlayer(players) {
  rlp.questionAsync("Select the number next to the player you are looking for: ").then(input => {
    const inputNum = Number.parseInt(input);
    if (Number.isInteger(inputNum)) {
      if (inputNum > 0 && inputNum <= players.length) {
        getPlayerStats(players[inputNum - 1]);
      } else {
        console.log('Hmmm, that wasn\'t one of the options')
        choosePlayer(players);
      }
    } else {
      console.log('I...don\'t think that\'s one of the choices')
      choosePlayer(players);
    }
  })
}

function getPlayerStats(player) {
  return cornelius.getStats({
    player_id: player.id
  }).then(stats => {
    console.log('\n');
    console.log(`Stats for ${player.name.full}:`)
    console.log("\n");
    console.log(`   Season `, "|", "   AVG   ", "|", "   SLG  ", "|");
    console.log(`   --------------------------------`);
    stats.reverse().map(s => {
      console.log(`   ${s.season}   `, "|", `  ${s.avg}   `, '|', `  ${s.slg}  `, '|');
     })
    console.log("\n");
  }).then(() => {
    process.exit();
  })
}

