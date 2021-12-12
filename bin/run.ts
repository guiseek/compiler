#!/usr/bin/env node

import { dev } from '../src'

function run(...args: string[]) {
  dev({ path: args.pop() ?? './' })
}

run(...process.argv)