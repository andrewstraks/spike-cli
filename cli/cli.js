#! /usr/bin/env node

const shell = require("shelljs");
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
var argv = require('minimist')(process.argv.slice(2));

clear();
console.log(
    chalk.yellow(
        figlet.textSync('Spike CLI', {horizontalLayout: 'full'})
    )
);
console.log('\n');

var version = '3.0.0';
var type = '';
var input = '';
var output = '';
var output2 = '';
var project = '';
var env = '';
var command = '';
var debug = false;

function help(full){

    if(full){
        console.log(chalk.red("Available commands:"));
    }else{
        console.log(chalk.red("Please specify command:"));
    }

    console.log(chalk.yellow(">> transpile {input_spike_file} {output_spike_file}"));
    console.log(chalk.yellow(">> templates {input_templates_dir} {output_templates_file} {output_watchers_file}"));
    console.log(chalk.yellow(">> create [class|static-class|controller|element|enum] {output_dir} {package_full_name}"));

    console.log(chalk.blue("Optional constants after base arguments:"));
    console.log(chalk.blue("--project=PROJECT_NAME"));
    console.log(chalk.blue("--env=ENV_TYPE"));

    console.log(chalk.blue("Other:"));
    console.log(chalk.blue("--help"));
    console.log(chalk.blue("--version"));
}

if(argv.debug){
    debug = true;
}

if(argv.help){
    help(true);
    return;
}

if(argv.version){
    console.log(chalk.yellow("v."+version));
    return;
}

if (argv['_'].length >= 3) {

    type = argv['_'][0].trim().toLowerCase();
    input = argv['_'][1].trim();
    output = argv['_'][2].trim();

    project = (argv.project || 'none').trim();
    env = (argv.env || 'none').trim();


    var constantsVars = 'PROJECT:' + project + ',ENV:' + env;
    if (type === 'template') {

        if(debug){
            console.log(chalk.green("type: "+type));
            console.log(chalk.green("input: "+input));
            console.log(chalk.green("output: "+output));
            console.log(chalk.green("project: "+project));
            console.log(chalk.green("env: "+env));
        }

        try {
            output2 = argv['_'][3].trim();
        }catch (e){
            help();
            return;
        }


        if(debug){
            console.log(chalk.green("output2: "+output2));
        }

        command = "java -jar ./jar/spike-transpiler.jar templates " + input + " " + output + " " + output2 + " new " + constantsVars;

    } else if (type === 'transpile') {

        if(debug){
            console.log(chalk.green("type: "+type));
            console.log(chalk.green("input: "+input));
            console.log(chalk.green("output: "+output));
            console.log(chalk.green("project: "+project));
            console.log(chalk.green("env: "+env));
        }

        command = "java -jar ./jar/spike-transpiler.jar transpiler " + input + " " + output + " app " + constantsVars;

    }else if(type === 'create'){

        var createType = argv['_'][1].trim();
        var outputSrc = argv['_'][2].trim();
        var fullPackage = '';

        try {
             fullPackage = argv['_'][3].trim();
        }catch (e){
            help();
            return;
        }

        if(debug){
            console.log(chalk.green("createType: "+createType));
            console.log(chalk.green("outputSrc: "+outputSrc));
            console.log(chalk.green("fullPackage: "+fullPackage));
        }

        if(['class', 'static-class', 'controller', 'element', 'enum'].indexOf(createType.toLowerCase()) > -1){
            command = "java -jar ./jar/spike-transpiler.jar cli " + outputSrc + " " + fullPackage + " "+createType;
        }else{
            help();
        }

    }else{
        help();
    }

    if(command){

        if(debug){
            console.log(chalk.green("command: "+command));
        }

        shell.exec(command);
        console.log(chalk.yellow("Done"));

    }

}else{
    help();
}
