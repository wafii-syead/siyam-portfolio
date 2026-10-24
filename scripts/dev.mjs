import { spawn } from 'node:child_process';
// Accept both Next's --hostname and preview supervisors' --host flags.
const input = process.argv.slice(2);
const mode = input.includes('--production') ? 'start' : 'dev';
const args = [];
for (let i = 0; i < input.length; i++) {
  if (input[i] === '--strictPort' || input[i] === '--production') continue;
  args.push(input[i] === '--host' ? '--hostname' : input[i]);
}
if (!args.includes('--hostname') && !args.includes('-H')) args.push('--hostname', '0.0.0.0');
if (!args.includes('--port') && !args.includes('-p')) args.push('--port', process.env.PORT || '4173');
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', mode, ...args], { stdio: 'inherit', env: process.env });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', code => process.exit(code ?? 1));
