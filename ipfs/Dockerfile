FROM ipfs/go-ipfs:v0.8.0-rc1

RUN ipfs init
RUN ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
RUN ipfs config --json Addresses.API '"/ip4/0.0.0.0/tcp/5001"'
RUN ipfs bootstrap rm --all
RUN find /data/ipfs -type d -exec chmod 777 \{\} \;
RUN find /data/ipfs -type f -exec chmod 777 \{\} \;

EXPOSE 5001

ENTRYPOINT [ "ipfs", "daemon" ]
