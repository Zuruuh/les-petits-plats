FROM mcr.microsoft.com/playwright:focal

WORKDIR /srv
RUN npm i -g npm pnpm

CMD [ "tail", "-f", "/dev/null" ]
