#!/bin/sh

# This is done to prevent an issue with esbuild
# esbuild installs a platform-dependent package
# that works only for the current OS.
# This means if you run `pnpm install` on macOS,
# the package won't work for linux OS
# This means we have to re-install node modules to ensure that
# the correct version of esbuild is used

benchmark() {
    if [ -d ./node_modules.docker ]; then
      rm -rf ./node_modules.old

      if [ -d ./node_modules ]; then
          mv -f ./node_modules ./node_modules.old
      fi;

      mv ./node_modules.docker ./node_modules
      pnpm run playwright:benchmark
      mv ./node_modules ./node_modules.docker

      if [ -d ./node_modules.old ]; then
        mv ./node_modules.old ./node_modules
      fi
    else
      echo "Installing packages"
      if [ -d ./node_modules ]; then
        mv ./node_modules ./node_modules.old
      fi

      pnpm install
      mv ./node_modules ./node_modules.docker
      if [ -d ./node_modules.old ]; then
        mv ./node_modules.old ./node_modules
      fi
      benchmark
    fi;
}

benchmark
