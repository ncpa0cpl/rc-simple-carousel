issemver=$(./scripts/check-semver.sh -t "$TAG_NAME")
currenttag=$(npm pkg get version)
if [ "$issemver" -eq "1" ]; then
    if ! [ "$currenttag" = "\"$TAG_NAME\"" ]; then
        echo "Branch tag is different than packge.json version. Updating package.json version to $TAG_NAME"
        npm version --no-git-tag-version "$TAG_NAME"
    fi
    echo "Publishing to npm"
    npm publish && git checkout .
fi