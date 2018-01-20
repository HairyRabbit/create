## Create you project easy integrate cli and VC platform

```js
create create-react-app repo
```

The create tools require your presonal token, e.g. The Github need ~/.github file.
If not found token file, `create` will ask your **USERNAME** and **PASSWORD**
to create one.


### Syntax

```sh
create COMMAND PROJECTNAME
  [--platform=github|gitlab(TODO)]
  [cmdOptions]
```


### Interface

```js
type Options = {
  platform: string,         // default to github
  name: string,             // project name, also as platform(e.g. github) repo name
  cmd: string,              // commander
  cmdOptions: Array<string> // pass to cmd
}
```
