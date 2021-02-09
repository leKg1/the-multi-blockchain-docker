#
# Ethereum
#
FROM ethereum/client-go

EXPOSE 8545

RUN apk update --no-cache \
    && apk upgrade --no-cache \
    && apk add --no-cache bash

ENTRYPOINT ["geth"]


#
# RSK Node
#
FROM ubuntu:latest

LABEL maintainer "support@rsk.co"

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get install -y --no-install-recommends openjdk-8-jre supervisor systemd software-properties-common

RUN groupadd --gid 888 rsk && useradd rsk -d /var/lib/rsk -s /sbin/nologin --uid=888 --gid=888

RUN \
  add-apt-repository -y ppa:rsksmart/rskj && \
  apt-get update && \
  (echo rskj shared/accepted-rsk-license-v1-1 select true | /usr/bin/debconf-set-selections )&& \
  apt-get install -y --no-install-recommends rskj && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* && \
  rm -f /etc/rsk/node.conf && \
  ln -s /etc/rsk/testnet.conf /etc/rsk/node.conf

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 4444
EXPOSE 50505

CMD ["/usr/bin/supervisord"]

#
# Moonbeam
#
FROM phusion/baseimage:0.11 as builder
LABEL maintainer "alan@purestake.com"
LABEL description="This is the build stage for Moonbeam. Here we create the binary."

ARG PROFILE=release
WORKDIR /moonbeam

COPY . /moonbeam

# Download Moonbeam repo
RUN apt-get update && \
	apt-get upgrade -y && \
	apt-get install -y cmake pkg-config libssl-dev git clang

# Download rust dependencies and build the rust binary
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y && \
	export PATH=$PATH:$HOME/.cargo/bin && \
	scripts/init.sh && \
	cargo build --$PROFILE

# ===== SECOND STAGE ======

FROM phusion/baseimage:0.11
LABEL maintainer "alan@purestake.com"
LABEL description="This is the 2nd stage: a very small image where we copy the Moonbeam binary."
ARG PROFILE=release
COPY --from=builder /moonbeam/target/$PROFILE/node-moonbeam /usr/local/bin

RUN mv /usr/share/ca* /tmp && \
	rm -rf /usr/share/*  && \
	mv /tmp/ca-certificates /usr/share/ && \
	rm -rf /usr/lib/python* && \
	useradd -m -u 1000 -U -s /bin/sh -d /moonbeam moonbeam && \
	mkdir -p /moonbeam/.local/share/moonbeam && \
	chown -R moonbeam:moonbeam /moonbeam/.local && \
	ln -s /moonbeam/.local/share/moonbeam /data && \
	rm -rf /usr/bin /usr/sbin

USER moonbeam

# 30333 for p2p traffic
# 9933 for RPC call
# 9944 for Websocket
# 9615 for Prometheus (metrics)
EXPOSE 30333 9933 9944 9615

VOLUME ["/data"]

CMD ["/usr/local/bin/node-moonbeam"]


#
# Namecoin
#
FROM alpine:3.8

ENV NAMECOIN_DBCACHE=400

RUN addgroup -g 1000 nmc \
  && adduser -D -g '' -G nmc -u 1000 nmc \
  && apk add --no-cache namecoin namecoin-cli

EXPOSE 8334 8336

USER nmc

WORKDIR /home/nmc

CMD ["namecoind"]