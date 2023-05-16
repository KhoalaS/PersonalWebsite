# Personal Website

Meine persönliche Website

## Simulierte Shell und Dateisystem

### Coreutils:

- [x] cat
- [x] clear
- [x] mkdir
  - [x] rekursiv mit -p
- [x] cd
- [ ] ls
  - [x] actually use args and not just cwd
  - [x] -l long output
  - [ ] -l formatting
- [x] echo
- [ ] touch
  - [ ] check options
  - [x] update and create modify time
- [x] chat, a ChatGPT integration
  - Usage: chat [message]
  - for local only, dont want to expose API Key in frontend or use dedicated backend

### I/O Functions

Right now the order of redirects is ignored

- [ ] redirect >,<, >>
  - [x] >
  - [x] <
  - [ ] > >
- [ ] pipe |
