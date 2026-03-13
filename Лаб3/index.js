function startTournament() {

    let playAgain = true;

    while (playAgain) {

        alert("Добро пожаловать на Рыцарский турнир!");

        let start = confirm("Хочешь участвовать в турнире?");
        if (!start) return;

        let name = prompt("Введи имя рыцаря:");

        if (name === null || name.trim() === "") {
            alert("Имя введено неправильно.");
            return;
        }

        let playerHP = 100;
        let score = 0;

        alert("Привет, " + name + "! Турнир начинается!");

        playerHP = fightMonster("Гоблин", 40, playerHP);
        if (playerHP <= 0) {
            alert("Ты проиграл турнир.");
            playAgain = confirm("Играть снова?");
            continue;
        }
        score += 10;

        playerHP = fightMonster("Орк", 60, playerHP);
        if (playerHP <= 0) {
            alert("Ты проиграл турнир.");
            playAgain = confirm("Играть снова?");
            continue;
        }
        score += 20;

        playerHP = fightMonster("Дракон", 100, playerHP);
        if (playerHP <= 0) {
            alert("Дракон победил тебя...");
        } else {
            score += 50;
            alert("Ты победил дракона!");
        }

        alert("Твои очки: " + score);

        playAgain = confirm("Хочешь сыграть ещё раз?");
    }

    alert("Спасибо за игру!");
}


function fightMonster(monsterName, monsterHP, playerHP) {

    alert("Появился враг: " + monsterName + "!");

    while (monsterHP > 0 && playerHP > 0) {

        let action = prompt(
            monsterName + " HP: " + monsterHP +
            "\nТвоё HP: " + playerHP +
            "\n\nВыбери действие:" +
            "\n1 — Атаковать" +
            "\n2 — Защититься" +
            "\n3 — Магия" +
            "\n4 — Убежать"
        );

        if (action === null) {
            alert("Ты убежал с поля боя!");
            return 0;
        }

        let playerDamage = Math.floor(Math.random() * 20) + 5;
        let monsterDamage = Math.floor(Math.random() * 15) + 5;

        if (action === "1") {

            monsterHP -= playerDamage;
            alert("Ты ударил " + monsterName + " на " + playerDamage);

        }
        else if (action === "2") {

            monsterDamage = Math.floor(monsterDamage / 2);
            alert("Ты защищаешься.");

        }
        else if (action === "3") {

            playerDamage += 10;
            monsterHP -= playerDamage;
            alert("Магия нанесла " + playerDamage + " урона!");

        }
        else if (action === "4") {

            alert("Ты решил сбежать от " + monsterName + "!");
            return 0;

        }
        else {

            alert("Неверный ввод! Ты потерял ход.");

        }

        if (monsterHP > 0) {

            playerHP -= monsterDamage;
            alert(monsterName + " ударил тебя на " + monsterDamage);

        }

    }

    if (playerHP > 0) {
        alert("Ты победил " + monsterName + "!");
    }

    return playerHP;
}