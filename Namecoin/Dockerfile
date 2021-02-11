FROM alpine:3.8

ENV NAMECOIN_DBCACHE=400

RUN addgroup -g 1000 nmc \
  && adduser -D -g '' -G nmc -u 1000 nmc \
  && apk add --no-cache namecoin namecoin-cli

EXPOSE 8334 8336

USER nmc

WORKDIR /home/nmc

CMD ["namecoind"]