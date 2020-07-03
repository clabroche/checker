FROM alpine:3.11 as builder
RUN apk --no-cache add gcc g++ make python nodejs npm

WORKDIR /checker
COPY package-lock.json ./package-lock.json
COPY package.json ./package.json
RUN npm ci
COPY . .

FROM alpine:3.11
RUN apk --no-cache add nodejs
WORKDIR /checker
RUN mkdir /checker/dist
COPY --from=builder /checker .

CMD ["node", "src/index"]
