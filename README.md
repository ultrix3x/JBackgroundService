# BackgroundService

BackgroundService is a modular system that enables a primary system to unload some of the more heavy duties to this background system.

By using the tcp service the BackgroundService also allows the calling system to expand it's functionality.

The service was originally created to be used as a subssytem to a CMS to handle logging and error reporting.

## Switches
There are some switches that can be used when starting the service.

### -v
Use verbose output. This is useful for debugging purpose.

### -E
Catch all error not handled anywhere else in the global error handler.

### -e
Don't catch all errors in the global error handler. By using this switch the service doesn't even create the global error handler.

This is the default behaviour.

### -EE
Be setting -EE the output from the global error handler is sent to console.error.

This requires the -E switch to enable the global error handler.

## Modules
The functionality of the BackgrundService is more or less based upon modules.

### Exports
When i modules is loaded there should be two functions exported, UExecute and TExecute-

#### UExecute = function(parts)
UExecute is called from the datagram service.

The result of the function should be returned from this function with the return statement. However the returned data will not be used.

The intention is to run services without interaction with the client. Just start the job and then forget about it. This is the real idea behind the project BackgroundService even though it might seem as the focus lies on the TExecute functionality.

##### Argument - parts
The parts argument is divided into two parts. The first part is the modules name and the second part is the data (most often a string) intended for the module.

The parts argument is an array where the module name resides in parts[0] and the data can be found in parts[1].

#### TExecute = function(parts, client)
TExecute is called from the tcp service.

This function doesn't have to return anything. The result should instead be written to the client.write() function.

##### Argument - parts
The parts argument is divided into two parts. The first part is the modules name and the second part is the data (most often a string) intended for the module.

The parts argument is an array where the module name resides in parts[0] and the data can be found in parts[1].

##### Argument - client
The client argument is an object containing the client socket. Normally the result will be written to the client.write function.

## Calling conventions
A call to the BackgroundService should contain a string.

The initial content of the string up until the presence of a colon (*) is considered the module name. If the colon is omitted then the entire string is considered a module name.

The module name is cleaned so that it only contains the letters a-z, A-Z and the digits 0-9 as well as hyphens (-) and underscores (_). All other charactes are considered illegal and will be removed.

All modules reside in a subfolder called modules and they should have a file extension of .js to be detected by the service.

## Example modules
There are a few services included for demo purposes.

### coffee.js
Uses the node module coffee-script to compile the content as CoffeeScript.

This module is intended for tcp services only.

### fail.js
A simple module without exports to test the error handling of the service.

### jade.js
Uses the node module jade to compile templates in jade to html.

This module is intended for tcp services only.

### less.js
Uses the node module less to compile less scripts into css.

This module is intended for tcp services only.

### roole.js
Uses the node modules roole-parser and roole-compiler to compile roole scripts into css.

This module is intended for tcp services only.

### sass.js
Uses the node module node-sass to compile sass/scss scripts into css.

This module is intended for tcp services only.

*at the time of writing this there are some issues with node-sass that might make it fail to install*

### test.js
A simple test module that returns the string "Test".

### typescript.js
This module uses a command line interaction to compile typescript scripts into javascript.

This module is intended for tcp services only.
