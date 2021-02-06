#!/usr/bin/env node

// const chalk = require("chalk");
// const boxen = require("boxen");
const yargs = require("yargs");

const options = yargs
 .usage("Usage: -n <name>")
 .option("n", { alias: "name", describe: "Your name", type: "string", demandOption: true })
 .argv;

const greeting = `Hello, ${options.name}!`;
console.log(greeting);


// const greeting = chalk.red.bold("Welcome to Five in A Row.\n Please enter your name: ");

// console.log(greeting);