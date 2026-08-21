/**
 * fork from vue3.0
 */
process.env.FORCE_COLOR = 1
const args = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const semver = require('semver')
const currentVersion = require('../package.json').version
const { prompt } = require('enquirer')
const execa = require('execa')

const preId =
  args.preid ||
  (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0])
const isDryRun = args.dry
const skipTests = args.skipTests
const skipBuild = args.skipBuild

const pkgRoot = path.resolve(__dirname, '..')
const pkgPath = path.resolve(pkgRoot, 'package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
const pkgName = pkg.name

const versionIncrements = [
  'patch',
  'minor',
  'major',
  ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : []),
]

const inc = (i) => semver.inc(currentVersion, i, preId)
const bin = (name) => path.resolve(__dirname, '../node_modules/.bin/' + name)
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })
const dryRun = (bin, args, opts = {}) =>
  console.log(chalk.blue(`[dryrun] ${bin} ${args.join(' ')}`), opts)
const runIfNotDry = isDryRun ? dryRun : run
const step = (msg) => console.log(chalk.cyan(msg))
const releaseState = {
  targetVersion: null,
  releaseTag: null,
  currentStep: null,
}

function getReleaseTag(version) {
  if (args.tag) {
    return args.tag
  } else if (version.includes('alpha')) {
    return 'alpha'
  } else if (version.includes('beta')) {
    return 'beta'
  } else if (version.includes('rc')) {
    return 'rc'
  }

  return null
}

async function runStep(name, message, action) {
  releaseState.currentStep = name
  step(message)
  await action()
}

function printCommands(commands) {
  for (const command of commands) {
    console.log(chalk.yellow(`  ${command}`))
  }
}

function getPublishCommand() {
  const commandArgs = [
    'npm publish',
    ...(releaseState.releaseTag ? [`--tag ${releaseState.releaseTag}`] : []),
    ...(args.otp ? [`--otp ${args.otp}`] : []),
    '--access public',
  ]
  return commandArgs.join(' ')
}

function getReleaseCommand() {
  const commandArgs = [
    `pnpm release ${releaseState.targetVersion}`,
    ...(releaseState.releaseTag ? [`--tag ${releaseState.releaseTag}`] : []),
    ...(args.otp ? [`--otp ${args.otp}`] : []),
  ]
  return commandArgs.join(' ')
}

function printFailureHelp(err) {
  const { currentStep, targetVersion } = releaseState

  console.error(err)
  process.exitCode = 1

  if (!targetVersion) {
    return
  }

  console.log(chalk.red(`\nRelease failed at step: ${currentStep}`))
  console.log(chalk.cyan('\nSuggested recovery commands:'))

  if (currentStep === 'tests') {
    printCommands(['pnpm test', getReleaseCommand()])
    return
  }

  if (currentStep === 'version') {
    printCommands(['git status --short', getReleaseCommand()])
    return
  }

  if (currentStep === 'build') {
    printCommands([
      'pnpm build',
      'pnpm changelog',
      'git diff',
      'git add -A',
      `git commit -m "release: v${targetVersion}"`,
      getPublishCommand(),
      `git tag v${targetVersion}`,
      `git push origin refs/tags/v${targetVersion}`,
      'git push',
    ])
    return
  }

  if (currentStep === 'changelog') {
    printCommands([
      'pnpm changelog',
      'git diff',
      'git add -A',
      `git commit -m "release: v${targetVersion}"`,
      getPublishCommand(),
      `git tag v${targetVersion}`,
      `git push origin refs/tags/v${targetVersion}`,
      'git push',
    ])
    return
  }

  if (currentStep === 'commit') {
    printCommands([
      'git status --short',
      'git add -A',
      `git commit -m "release: v${targetVersion}"`,
      getPublishCommand(),
      `git tag v${targetVersion}`,
      `git push origin refs/tags/v${targetVersion}`,
      'git push',
    ])
    return
  }

  if (currentStep === 'publish') {
    printCommands([
      'git status --short',
      `npm view ${pkgName}@${targetVersion} version`,
      `npm view ${pkgName} dist-tags`,
      getPublishCommand(),
      `git tag v${targetVersion}`,
      `git push origin refs/tags/v${targetVersion}`,
      'git push',
    ])
    return
  }

  if (currentStep === 'tag') {
    printCommands([
      `git tag v${targetVersion}`,
      `git push origin refs/tags/v${targetVersion}`,
      'git push',
    ])
    return
  }

  if (currentStep === 'push-tag') {
    printCommands([`git push origin refs/tags/v${targetVersion}`, 'git push'])
    return
  }

  if (currentStep === 'push') {
    printCommands(['git push'])
  }
}

async function main() {
  let targetVersion = args._[0]

  if (!targetVersion) {
    // no explicit version, offer suggestions
    const { release } = await prompt({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: versionIncrements
        .map((i) => `${i} (${inc(i)})`)
        .concat(['custom']),
    })

    if (release === 'custom') {
      targetVersion = (
        await prompt({
          type: 'input',
          name: 'version',
          message: 'Input custom version',
          initial: currentVersion,
        })
      ).version
    } else {
      targetVersion = release.match(/\((.*)\)/)[1]
    }
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`)
  }
  releaseState.targetVersion = targetVersion
  releaseState.releaseTag = getReleaseTag(targetVersion)

  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`,
  })

  if (!yes) {
    return
  }

  await runStep('tests', '\nRunning tests...', async () => {
    if (!skipTests && !isDryRun) {
      await run(bin('jest'), ['--clearCache'])
      await run('pnpm', ['test', '--bail'])
    } else {
      console.log(`(skipped)`)
    }
  })

  await runStep('version', '\nUpdating version...', async () => {
    updateVersions(targetVersion)
  })

  await runStep('build', '\nBuilding all packages...', async () => {
    if (!skipBuild && !isDryRun) {
      await run('pnpm', ['build'])
    } else {
      console.log(`(skipped)`)
    }
  })

  // generate changelog
  await runStep('changelog', '\nGenerating changelog...', async () => {
    await run(`pnpm`, ['changelog'])
  })

  await runStep('commit', '\nCommitting changes...', async () => {
    const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
    if (stdout) {
      await runIfNotDry('git', ['add', '-A'])
      await runIfNotDry('git', ['commit', '-m', `release: v${targetVersion}`])
    } else {
      console.log('No changes to commit.')
    }
  })

  // publish packages
  await runStep('publish', '\nPublishing packages...', async () => {
    await publishPackage(targetVersion, runIfNotDry)
  })

  // push to GitHub
  await runStep('tag', '\nTagging release...', async () => {
    await runIfNotDry('git', ['tag', `v${targetVersion}`])
  })
  await runStep('push-tag', '\nPushing release tag...', async () => {
    await runIfNotDry('git', ['push', 'origin', `refs/tags/v${targetVersion}`])
  })
  await runStep('push', '\nPushing release commit...', async () => {
    await runIfNotDry('git', ['push'])
  })

  if (isDryRun) {
    console.log(`\nDry run finished - run git diff to see package changes.`)
  }
  console.log()
}

function updateVersions(version) {
  pkg.version = version
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

async function publishPackage(version, runIfNotDry) {
  if (pkg.private) {
    return
  }

  const releaseTag = getReleaseTag(version)

  // TODO use inferred release channel after official release
  // const releaseTag = semver.prerelease(version)[0] || null

  step(`Publishing ${pkgName}...`)
  try {
    await runIfNotDry(
      'npm',
      [
        'publish',
        ...(releaseTag ? ['--tag', releaseTag] : []),
        ...(args.otp ? ['--otp', args.otp] : []),
        '--access',
        'public',
      ],
      {
        cwd: pkgRoot,
      }
    )
    console.log(chalk.green(`Successfully published ${pkgName}@${version}`))
  } catch (e) {
    if (e.stderr && e.stderr.match(/previously published/)) {
      console.log(chalk.red(`Skipping already published: ${pkgName}`))
    } else {
      throw e
    }
  }
}

main().catch(printFailureHelp)
