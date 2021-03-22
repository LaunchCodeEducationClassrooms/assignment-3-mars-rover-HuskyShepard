const assert = require('assert');
const Message = require('../message.js');
const Command = require('../command.js');

describe("Message class", function() 
{
  it("throws error if a name is NOT passed into the constructor as the first parameter", function() 
  {
    assert.throws(
      function() 
      {
        new Message();
      },
      {
        message: "Name is required."
      }
    );
  });

 it("constructor sets name",function()
 {
   let name = "Test message with two commands";
   let test5 = new Message(name);
   assert.strictEqual(test5.name, name)
 });

 it("contains a commands array passed into the constructor as 2nd argument", function() 
 {
   let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
   let test6 = new Message("Test message with two commands",commands);
   assert.strictEqual(test6.commands,commands)

 }) 
  
}); 

