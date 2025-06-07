const gradient = require("gradient-string");
const readlineP = require('readline/promises');

const readline = readlineP.createInterface({
    input: process.stdin,
    output: process.stdout
  });

const treeArr = [
'\n ******** Welcome To ******** \n',
'              * *    ',
'           *    *  *',
'      *  *    *  🍎 *  *',
'     *     *    *  *    *',
' * *   *    *    *    *   *',
' *   🍎*  *    * * .#  *   *',
' *   *     * #.  .# *   *',
'  *     "#.  #: #" * *  🍎 *',
' *   * * "#. ##"       *',
'   *       "###',
'     Your    "##',
'              ##.',
'  Fruit       .##:',
'              :###',
'     Tree     ;###',
'            ,####.',
'**************************** \n',
];

function openScreen() {
    treeArr.forEach((str, i) => {
        let delay = 250;
        setTimeout(() => console.log(gradient.cristal(str)), delay * i);
    })
}

function countDown(seconds) {

}

function wait(seconds) {
    return new Promise((res) => setInterval(res, seconds * 1000))
}

function getSecret() {
    const secrets = [
        "🌿 Time does not pass, it gathers.",
        "🍂 The roots speak more than the leaves ever hear.",
        "🌕 The moon knows all our names."
    ]

    return secrets[Math.floor(Math.random() * secrets.length)];
}

const tree = {
    type: '', // apple / orange / mango etc
    age: 0, // in years
    status: '', // sprout / young tree / mature tree / ancient tree
    height: 0, // in meters
    stage: '', // leafs / bloom / unripe fruit / ripe fuit
    fruitNumber: 0,
    growthInterval: null,
    ageInterval: null,
    fruitInterval: null,
   
    check() {
        console.log("\n**********************************");
        console.log(`${this.type} tree`);
        console.log(`age: ${this.age} years old`);
        console.log(`status: ${this.status}`);
        console.log(`height: ${this.height} meters`);
        console.log(`stage: ${this.stage}`);
        console.log(`there are ${this.fruitNumber} fruits`);
        console.log("**********************************\n");

    }, 
    plantSeed(type) {
        this.type = type;
        this.status = "sprout";
        this.stage = "leaves";
        this.growthInterval = setInterval(() => this.height += 0.2, 20000);
        this.ageInterval = setInterval(() => {
            this.age += 1;
            if(this.age == 2) {
                this.status = "young tree";
            } else if(this.age == 5) {
                this.status = "mature tree";
            } else if (this.age == 100) {
                this.status = "ancient tree";
            }
        }, 20000);
        this.check();
    },
    water() {
        if(this.age < 3) {
            console.log("you watered the tree! thank you!");
        } else if (this.age >= 5) {
            if(this.stage == "leaves") this.stage = "flowers";
            else if(this.stage == "flowers") {
                this.stage = "unripe fruits";
                this.fruitNumber = this.age * 2
            } else if (this.stage == "unripe fruits") this.stage = "ripe fruits";
        } else if (this.age >= 100) {
            const secret = getSecret();
            console.log("THE TREE WHISPERED:");
            console.log(`.... . . ${secret} . ... . . `);
        }
    },
    pickFruit() {
        console.log("picking fruit!");
        const fruitNum = this.fruitNumber;
        if(this.fruitNumber < 1) {
            console.log("There are no fruits to pick...");
            return;
        } else {
            this.fruitNumber = 0;
            this.stage = "leaves";
            this.check();
        }
        console.log(`You picked ${fruitNum} fruits!`)
        return fruitNum;
    },
    chopDown() {
        const logs = this.height * 3;
        clearInterval(this.growthInterval);
        clearInterval(this.ageInterval);
        console.log(`You chopped down the tree and got ${logs} logs of wood!`);
        return logs;
    },
}

const game = {
    ongoing: true,
    fruits: 0,
    logs: 0,
    achivements: [],


    check() {
        console.log("_________Game Stats_________");
        console.log(`Fruits: ${this.fruits}`);
        console.log(`Logs: ${this.logs}`);

        this.achivements.forEach((ach)=> console.log(ach));

        console.log("_____________________________")
    },


    async getMenueSelection() {
        let answer = 0;
        do {
            console.log("\nWhat would you like to do?");
            console.log("[1] Water the tree");
            console.log("[2] Pick fruits");
            console.log("[3] Check tree status");
            console.log("[4] Chop down the tree");
            console.log("[5] Wait for a while");
            console.log("[6] Exit game");
            answer = await readline.question("Enter your choice (1-6): ");
        } while (!(answer == 1 || answer == 2 ||answer == 3 ||answer == 4 ||answer == 5 ||answer == 6));
        
        return answer;
    },

    stop() {
        tree.type = '';
        tree.age = 0; 
        tree.status = ''; 
        tree.height = 0; 
        tree.stage = ''; 
        tree.fruitNumber = 0;
        clearInterval(tree.growthInterval);
        clearInterval(tree.ageInterval);
        tree.growthInterval = null;
        tree.ageInterval = null;
    },

    exit() {
        console.log("Thanks for playing! These are your stats:");
        this.check();
        process.exit();
    },


    async start() {
        openScreen();
        await wait(5);
        
        const type = await readline.question("Welcome to your field. you can now plant your first tree. what will it be? ");
        tree.plantSeed(type);

        while(this.ongoing) {
            const choice = await this.getMenueSelection();

            if(choice == 1) {
                tree.water();
            } else if(choice == 2) {
                console.log("Reaching to pick fruits")
                if(tree.fruitNumber < 1) console.log("there are no fruits to pick")
                if(tree.stage == "unripe fruits") {
                    const fruitNum = tree.pickFruit();
                    console.log(`You picked ${fruitNum} fruits, and lost a tooth trying to taste one. You tossed the unripe fruits into the compost`);
                } else if (tree.stage == "ripe fruits") {
                    this.fruits += tree.pickFruit();
                    if(this.fruits > 100 && !this.achivements.includes("Fruit Ninja")) {
                        this.achivements.push("Fruit Ninja");
                        console.log("Achivement: Fruit Ninja - collect over 100 fruits");
                    }
                } 
            } else if(choice == 3) {
                tree.check();
                if(tree.age > 100 && !this.achivements.includes("Nursing Home")) {
                    this.achivements.push("Nursing Home");
                    console.log("Achivement: Nursing Home - grow an ancient tree");
                }
            } else if(choice == 4) {
                this.logs += tree.chopDown();
                if(this.logs > 100 && !this.achivements.includes("Timber!")) {
                    this.achivements.push("Timber!");
                    console.log("Achivement: Timner! - get 100 logs");
                    
                    const answer = await readline.question("will you like to start over?").toLowerCase();
                    if(this.answer == "yes") {
                        this.stop();
                        this.start();
                    } else {
                        this.stop();
                        this.exit();
                    }

                }
            } else if (choice == 5) {
                const waitTime = await readline.question("how many seconds will you like to wait?: ");
                await wait(waitTime);
            } else if(choice == 6) {
                this.stop();
                this.exit();
            }
        }
    }
}


game.start();