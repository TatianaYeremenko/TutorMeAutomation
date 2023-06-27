FROM mcr.microsoft.com/playwright:focal
WORKDIR /app
COPY . .
ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > /root/.npmrc
RUN npm install
CMD [ "npm", "test" ]
