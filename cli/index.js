#!/usr/bin/env node

import { program } from 'commander';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import fs from 'fs';
import path from 'path';

const API_BASE = process.env.TOKENENGINE_API || 'http://localhost:3001';

program
    .name('tokenengine')
    .description('CLI to extract design tokens from URLs and inject them into your codebase')
    .version('1.0.0');

program
    .command('extract')
    .description('Extract design tokens from a target URL')
    .argument('<url>', 'URL to extract from (e.g., linear.app)')
    .action(async (url) => {
        console.log(chalk.bold.blue('\n🚀 TokenEngine CLI'));
        console.log(chalk.gray('Deterministic design system extraction.\n'));

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        const spinner = ora(`Analyzing ${chalk.cyan(url)} (this takes a few seconds)...`).start();

        try {
            const res = await axios.post(`${API_BASE}/api/extract`, { url });
            const data = res.data;

            spinner.succeed(`Successfully extracted system from ${chalk.cyan(url)} in ${data?.stats?.extractionTime || 'a few seconds'}`);

            console.log(`\nTokens found: ${chalk.green(data?.stats?.tokensFound || Object.keys(data?.colors || {}).length)}`);
            if (data?.stats?.healthScore) {
                console.log(`Health Score: ${chalk.green(data.stats.healthScore)} / 100\n`);
            }

            const choices = await prompts([
                {
                    type: 'multiselect',
                    name: 'actions',
                    message: 'What would you like to generate in this project?',
                    choices: [
                        { title: 'Tailwind Configuration (tailwind.config.tokenengine.js)', value: 'tailwind', selected: true },
                        { title: 'CSS Variables (tokenengine-globals.css)', value: 'css', selected: true },
                        { title: 'AI Assistant Prompts (.cursorrules / prompts)', value: 'prompts', selected: true },
                        { title: 'Raw JSON (tokens.json)', value: 'json' }
                    ],
                    min: 1
                }
            ]);

            if (!choices.actions || choices.actions.length === 0) {
                console.log(chalk.yellow('No actions selected. Exiting.'));
                return;
            }

            const cwd = process.cwd();

            if (choices.actions.includes('tailwind') && data.exports && data.exports.tailwind) {
                const tailwindContent = `/** @type {import('tailwindcss').Config} */\nmodule.exports = ${JSON.stringify(data.exports.tailwind, null, 2)};`;
                fs.writeFileSync(path.join(cwd, 'tailwind.config.tokenengine.js'), tailwindContent);
                console.log(chalk.green('✔') + ' Created ' + chalk.cyan('tailwind.config.tokenengine.js'));
            }

            if (choices.actions.includes('css') && data.exports && data.exports.css) {
                fs.writeFileSync(path.join(cwd, 'tokenengine-globals.css'), data.exports.css);
                console.log(chalk.green('✔') + ' Created ' + chalk.cyan('tokenengine-globals.css'));
            }

            if (choices.actions.includes('json') && data.exports && data.exports.json) {
                fs.writeFileSync(path.join(cwd, 'tokens.json'), JSON.stringify(data.exports.json, null, 2));
                console.log(chalk.green('✔') + ' Created ' + chalk.cyan('tokens.json'));
            }

            if (choices.actions.includes('prompts') && data.exports && data.exports.prompts) {
                // Write standard .cursorrules
                fs.writeFileSync(path.join(cwd, '.cursorrules'), data.exports.prompts.universal || 'No prompt found');
                console.log(chalk.green('✔') + ' Created ' + chalk.cyan('.cursorrules'));

                // Optionally save the others
                fs.mkdirSync(path.join(cwd, '.tokenengine-prompts'), { recursive: true });
                if (data.exports.prompts.v0) fs.writeFileSync(path.join(cwd, '.tokenengine-prompts', 'v0.md'), data.exports.prompts.v0);
                if (data.exports.prompts.claude) fs.writeFileSync(path.join(cwd, '.tokenengine-prompts', 'claude.md'), data.exports.prompts.claude);
                console.log(chalk.green('✔') + ' Created ' + chalk.cyan('.tokenengine-prompts/ '));
            }

            console.log(chalk.bold.green('\n🎉 Done! Your design system has been deterministically injected.'));
            console.log(chalk.gray('Pro tip: Rename the generated files as necessary to integrate with your setup.'));

        } catch (err) {
            if (spinner.isSpinning) spinner.fail(chalk.red('Extraction failed.'));
            if (err.response) {
                console.error(chalk.red(err.response.data?.message || err.message));
            } else {
                console.error(chalk.red(err.message));
            }
        }
    });

program.parse();
