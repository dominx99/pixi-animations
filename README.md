#### It is very simple tool to organize tiles and export animation in pixi format

[![Watch the video](https://imgur.com/1bbcf1u.png)](https://drive.google.com/file/d/1IyqJyI2AYfgET1d3PO8sG-NI4oaGhCnP/view?usp=sharing)
[Demo](https://pixi-tilesets.chylo.pl)

# Docker

> Note that `make init` creates docker proxy network with IP - 10.200.0.0

```sh
make init
make up
```

Open browser: `10.200.31.6`

# Notes
Imported file size must be multiplication of tile size otherwise file won't be imported.\
Export button exports pixi animations image format.
