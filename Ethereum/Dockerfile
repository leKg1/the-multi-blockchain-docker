FROM ethereum/client-go:v1.9.25

EXPOSE 8545

RUN apk update --no-cache \
    && apk upgrade --no-cache \
    && apk add --no-cache bash

ENTRYPOINT ["geth"]