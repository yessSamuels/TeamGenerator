const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// employee array
let employeeArray = [];
const firstWhen = (data) => !!data.managerName && employeeArray.length < 1
const secondWhen = (data) => !!data.managerName || (employeeArray.length > 0 && data.newMember != "None");

// questions per cards 

const questions = [{
        type: "input",
        message: "Hello manager, what is your name?",
        name: "managerName",
        when: (data) => !data.managerName && employeeArray.length < 1
    },
    {
        type: "input",
        message: "What is your employee ID",
        name: "managerID",
        when: firstWhen
    },
    {
        type: "input",
        message: "What is your email address?",
        name: "managerEmail",
        when: firstWhen
    },
    {
        type: "input",
        message: "What is your office number?",
        name: "officeNumber",
        when: firstWhen
    },
    {
        type: "list",
        message: "Who would you like to add?",
        name: "newMember",
        choices: ["Engineer", "Intern", "None"],
        when: (data) => !!data.managerName || employeeArray.length > 0
    },
    {
        type: "input",
        message: "What is this employee's name?",
        name: "employeeName",
        when: secondWhen
    },
    {
        type: "input",
        message: "What is this employee's ID?",
        name: "employeeID",
        when: secondWhen
    },
    {
        type: "input",
        message: "What is this employee's email address?",
        name: "employeeEmail",
        when: secondWhen
    },
    {
        type: "input",
        message: "What is the engineer's Github username?",
        name: "engineerGithub",
        when: (data) => data.newMember === "Engineer" && secondWhen(data)
    },
    {
        type: "input",
        message: "What school does the intern attend?",
        name: "internSchool",
        when: (data) => data.newMember === "Intern" && secondWhen(data)
    }
]

// questions
async function createTeam() {
    const data = await inquirer
        .prompt(questions)
    if (data.managerName) {
        let newManager = new Manager(data.managerName, data.managerID, data.managerEmail, data.officeNumber);
        employeeArray.push(newManager);
    }
    if (data.newMember === "Engineer") {
        let newEngineer = new Engineer(data.employeeName, data.employeeID, data.employeeEmail, data.engineerGithub)
        employeeArray.push(newEngineer);
        return createTeam();
    } else if (data.newMember === "Intern") {
        let newIntern = new Intern(data.employeeName, data.employeeID, data.employeeEmail, data.internSchool)
        employeeArray.push(newIntern);
        return createTeam();
    } else {
        const teamHTML = render(employeeArray);
        fs.writeFile(outputPath, teamHTML, function(error) {
            if (error) throw error;
            console.log("complete");
        });
    }
}

createTeam();



// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
