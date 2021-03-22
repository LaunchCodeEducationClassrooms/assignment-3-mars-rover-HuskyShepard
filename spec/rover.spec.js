const assert = require('assert');
const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

describe("Rover class", function() 
{
  it("constructor sets position and default values for mode and generatorWatts", function() 
  {
    let rover = new Rover(98382);
    assert.strictEqual(rover.position,98382);
    assert.strictEqual(rover.mode, "NORMAL");
    assert.strictEqual(rover.generatorWatts, 110);
  });

  it("response returned by receiveMessage contains name of message", function() 
  {
    let commands = [new Command('MODE_CHANGE'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover();
    let response = rover.receiveMessage(message);
    assert.strictEqual(response.message, 'Test message with two commands');
  })

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() 
  {
    let commands = [new Command('MODE_CHANGE'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover();
    let response = rover.receiveMessage(message);
    assert.strictEqual(response.results.length,2);
  })

  it("responds correctly to status check command", function() 
  {
    let command = [new Command('STATUS_CHECK')]
    let message = new Message('Test message with status command',command);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    assert.strictEqual((response.results[0].roverStatus.mode), "NORMAL");
    assert.strictEqual((response.results[0].roverStatus.generatorWatts), 110);
    assert.strictEqual((response.results[0].roverStatus.position), 98382);  
  })

  it("responds correctly to mode change command",function()
  {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER')];
    let message = new Message('Test message with mode change command', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    assert.strictEqual((response.results[0].completed),true);
    assert.strictEqual(rover.mode, "LOW_POWER");
  })

  it("responds with false completed value when attempting to move in LOW_POWER mode",function()
  {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MOVE', 100)];
    let message = new Message("Test message to move in low power mode",commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    assert.strictEqual((response.results[1].completed),false);
  });

  it("responds with position for move command",function()
  {
    let command = [new Command('MOVE', 100)];
    let message = new Message("Test message with position to move",command);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    assert.strictEqual(rover.position,100);
  });  
    
  it("responds to TA message & commands", function() 
  {
   let rover = new Rover(100);
   let commands = [
      new Command('MOVE', 4321),
      new Command('STATUS_CHECK'),
      new Command('MODE_CHANGE', 'LOW_POWER'),
      new Command('MOVE', 3579),
      new Command('STATUS_CHECK')
   ];
   let message = new Message('TA power', commands);
   let response = rover.receiveMessage(message);
   assert.strictEqual(response.message,'TA power');
   assert.strictEqual(response.results[0].completed, true);
   assert.strictEqual(rover.position, 4321);
   assert.strictEqual(response.results[2].completed, true);
   assert.strictEqual(response.results[3].completed, false);
   assert.strictEqual(rover.position, 4321);
   assert.strictEqual(response.results[4].roverStatus.mode, 'LOW_POWER');
   assert.strictEqual(response.results[4].roverStatus.generatorWatts, 110);
  });

});
