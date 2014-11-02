# node tosr0x command line interface

> A CLI tool to control a Tosr0x board

## Installation

```
npm i tosr0x-cli -g
```

## Requirements

- node v0.10+
- Being able to compile [serial port](https://github.com/voodootikigod/node-serialport#to-install)
- A Tosr0x USB board from [TinySine](http://www.tinyosshop.com/) (TOSR02, TOSR04, TOSR08)

![Tosr02](http://www.tinyosshop.com/image/cache/data/Relay%20Boards/TOSR02-1-228x228.jpg)

## Usage

Start the program usign the global script

```
tosr0x
```

Valid command-line options are

```
Usage: tosr0x cmd [relay] [opts]

Options:
  -h, -?, --help    Show help                                            
  --version         Show version number                                  
  -p, --port        The usb port uri to use. Leave empty to use port scan
  -n, --relayCount  The number of relays on the board                      [default: 2]
  -v, --verbose     Enables verbose mode (for debug only)                

Valid commands (cmd) are: on, off, state, temp, version, voltage
```

## Credits

Made with love in Montréal by <https://deuxhuithuit.com>

Licensed under the MIT License: <http://deuxhuithuit.mit-license.org>

## Disclaimer

We are **not** affiliate with any sort with the usb boards manifacturer or reseller. Please refer to the license of the projet and the licenses emitted by the board manufacturer for all information.

