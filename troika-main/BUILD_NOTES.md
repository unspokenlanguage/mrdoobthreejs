# Troika Build and Deployment Notes

## Continuous Integration

All pushes to the GitHub repository's master branch, as well as all PRs, will be automatically built and tested by [Github Actions](https://github.com/protectwise/troika/actions).

Documentation will also be built and deployed to the docs site for every push to the master branch.


## Publishing New Versions

When the master branch is to a point where a new release is needed, execute the following from your local repository root directory:

First, validate it's releasable:

```bash
npm run build
npm run test
npm run build-examples
```

Then:

```bash
npx lerna version
```

This will prompt you for the new version number, perform all the required updates to the various `package.json` files including cross-referenced dependency versions, create a new Git tag for that version, and push the result to GitHub.

If you don't want it to push to GitHub yet, use:

```bash
npx lerna version --no-push
```

...and then manually push to GitHub when you're ready (don't forget to push the tag!)

At this point the CI will build and test the new tagged version, but it is _not_ currently set up to publish the results to the NPM registry; for the time being that will be a manual process. To do that:
 
 - Make sure the tagged commit is checked out, with no extra files hanging around

 - Run: 
 
    ```bash
    npm run build
    ```
    
 - Make sure you're logged in to an NPM account with permissions to publish to the various troika packages (`npm login`)

 - Run: 
 
    ```bash
    npx lerna publish from-git
    ```
